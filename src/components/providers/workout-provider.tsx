"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
} from "react";

import { builtInExercises } from "@/lib/data/catalog";
import {
  createInitialStoreState,
  isSeededDemoState,
  syncStoreProfileIdentity,
} from "@/lib/data/mock";
import {
  addExerciseToSession,
  addSetToExercise,
  deleteSetFromExercise,
  finishWorkout,
  logActiveSet,
  moveSessionExercise,
  selectActiveSet,
  startBlankWorkout,
  startWorkoutFromSplitDay,
  updateSetDraft,
} from "@/lib/domain/workout";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import type {
  ExerciseCatalogItem,
  KineticStoreState,
  UserProfile,
  UserSettings,
  WorkoutSplit,
} from "@/types/kinetic";

const STORAGE_KEY = "kinetic-store-v2";
const LEGACY_STORAGE_KEY = "kinetic-store-v1";

type WorkoutContextValue = KineticStoreState & {
  catalog: ExerciseCatalogItem[];
  hydrated: boolean;
  defaultSplit: WorkoutSplit | null;
  recentExerciseSlugs: string[];
  startBlankSession: () => void;
  startSplitDaySession: (splitId: string, dayId: string) => void;
  addExercise: (exerciseSlug: string) => void;
  updateDraft: (
    exerciseId: string,
    setId: string,
    patch: { draftWeight?: number | null; draftReps?: number | null; assistAmount?: number | null },
  ) => void;
  selectSet: (exerciseId: string, setId: string) => void;
  logFocusedSet: () => void;
  addSet: (exerciseId: string) => void;
  deleteSet: (exerciseId: string, setId: string) => void;
  moveExercise: (fromIndex: number, toIndex: number) => void;
  updateActiveSessionTitle: (title: string) => void;
  finishActiveSession: (notes: string) => void;
  clearActiveSession: () => void;
  toggleFavorite: (exerciseSlug: string) => void;
  toggleArchive: (exerciseSlug: string) => void;
  updateSettings: (patch: Partial<UserSettings>) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  completeOnboarding: (bodyWeight: number | null) => void;
  createSplit: (name: string, focus: string) => void;
  createCustomExercise: (exercise: Pick<ExerciseCatalogItem, "name" | "equipment"> & {
    primaryMuscles: string[];
    instructions?: string[];
  }) => void;
};

const WorkoutContext = createContext<WorkoutContextValue | null>(null);

function createSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<KineticStoreState>(createInitialStoreState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw =
      window.localStorage.getItem(STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_STORAGE_KEY);

    if (!raw) {
      setHydrated(true);
      return;
    }

    startTransition(() => {
      try {
        const parsed = JSON.parse(raw) as KineticStoreState;
        setStore(
          isSeededDemoState(parsed)
            ? createInitialStoreState()
            : {
                ...parsed,
                hasCompletedOnboarding: parsed.hasCompletedOnboarding ?? true,
              },
        );
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
        window.localStorage.removeItem(LEGACY_STORAGE_KEY);
      } finally {
        setHydrated(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  }, [hydrated, store]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    let cancelled = false;

    supabase.auth.getUser().then(({ data }) => {
      if (cancelled || !data.user) {
        return;
      }

      startTransition(() => {
        setStore((current) => syncStoreProfileIdentity(current, data.user));
      });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        return;
      }

      startTransition(() => {
        setStore((current) => syncStoreProfileIdentity(current, session.user));
      });
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [hydrated]);

  const catalog = [...builtInExercises, ...store.customExercises];
  const defaultSplit = store.splits.find((split) => split.isDefault) ?? null;
  const recentExerciseSlugs = Array.from(
    new Set(
      store.history.flatMap((session) =>
        session.exercises.map((exercise) => exercise.exerciseSlug),
      ),
    ),
  ).slice(0, 12);

  const value: WorkoutContextValue = {
    ...store,
    catalog,
    hydrated,
    defaultSplit,
    recentExerciseSlugs,
    startBlankSession() {
      setStore((current) => ({
        ...current,
        activeSession: startBlankWorkout(current.settings),
      }));
    },
    startSplitDaySession(splitId, dayId) {
      setStore((current) => {
        const split = current.splits.find((entry) => entry.id === splitId);
        const day = split?.days.find((entry) => entry.id === dayId);

        if (!split || !day) {
          return current;
        }

        return {
          ...current,
          activeSession: startWorkoutFromSplitDay(
            day,
            [...builtInExercises, ...current.customExercises],
            current.history,
            current.settings,
            split.id,
          ),
        };
      });
    },
    addExercise(exerciseSlug) {
      setStore((current) => {
        const exercise = [...builtInExercises, ...current.customExercises].find(
          (entry) => entry.slug === exerciseSlug,
        );

        if (!exercise) {
          return current;
        }

        const session = current.activeSession ?? startBlankWorkout(current.settings);

        return {
          ...current,
          activeSession: addExerciseToSession(session, exercise, current.history),
        };
      });
    },
    updateDraft(exerciseId, setId, patch) {
      setStore((current) => {
        if (!current.activeSession) {
          return current;
        }

        return {
          ...current,
          activeSession: updateSetDraft(current.activeSession, exerciseId, setId, patch),
        };
      });
    },
    selectSet(exerciseId, setId) {
      setStore((current) => {
        if (!current.activeSession) {
          return current;
        }

        return {
          ...current,
          activeSession: selectActiveSet(current.activeSession, exerciseId, setId),
        };
      });
    },
    logFocusedSet() {
      setStore((current) => {
        if (!current.activeSession) {
          return current;
        }

        return {
          ...current,
          activeSession: logActiveSet(current.activeSession, current.settings),
        };
      });
    },
    addSet(exerciseId) {
      setStore((current) => {
        if (!current.activeSession) {
          return current;
        }

        return {
          ...current,
          activeSession: addSetToExercise(
            current.activeSession,
            exerciseId,
            current.history,
          ),
        };
      });
    },
    deleteSet(exerciseId, setId) {
      setStore((current) => {
        if (!current.activeSession) {
          return current;
        }

        return {
          ...current,
          activeSession: deleteSetFromExercise(current.activeSession, exerciseId, setId),
        };
      });
    },
    moveExercise(fromIndex, toIndex) {
      setStore((current) => {
        if (!current.activeSession) {
          return current;
        }

        return {
          ...current,
          activeSession: moveSessionExercise(current.activeSession, fromIndex, toIndex),
        };
      });
    },
    updateActiveSessionTitle(title) {
      setStore((current) => {
        if (!current.activeSession) {
          return current;
        }

        return {
          ...current,
          activeSession: {
            ...current.activeSession,
            title,
          },
        };
      });
    },
    finishActiveSession(notes) {
      setStore((current) => {
        if (!current.activeSession) {
          return current;
        }

        const completed = finishWorkout(current.activeSession, notes);

        return {
          ...current,
          history: [completed, ...current.history],
          activeSession: null,
        };
      });
    },
    clearActiveSession() {
      setStore((current) => ({
        ...current,
        activeSession: null,
      }));
    },
    toggleFavorite(exerciseSlug) {
      setStore((current) => {
        const favorites = current.settings.favoriteExerciseSlugs.includes(exerciseSlug)
          ? current.settings.favoriteExerciseSlugs.filter((slug) => slug !== exerciseSlug)
          : [...current.settings.favoriteExerciseSlugs, exerciseSlug];

        return {
          ...current,
          settings: {
            ...current.settings,
            favoriteExerciseSlugs: favorites,
          },
        };
      });
    },
    toggleArchive(exerciseSlug) {
      setStore((current) => {
        const archived = current.settings.archivedExerciseSlugs.includes(exerciseSlug)
          ? current.settings.archivedExerciseSlugs.filter((slug) => slug !== exerciseSlug)
          : [...current.settings.archivedExerciseSlugs, exerciseSlug];

        return {
          ...current,
          settings: {
            ...current.settings,
            archivedExerciseSlugs: archived,
          },
        };
      });
    },
    updateSettings(patch) {
      setStore((current) => ({
        ...current,
        settings: {
          ...current.settings,
          ...patch,
        },
      }));
    },
    updateProfile(patch) {
      setStore((current) => ({
        ...current,
        profile: {
          ...current.profile,
          ...patch,
        },
      }));
    },
    completeOnboarding(bodyWeight) {
      setStore((current) => ({
        ...current,
        profile: {
          ...current.profile,
          bodyWeight,
        },
        hasCompletedOnboarding: true,
      }));
    },
    createSplit(name, focus) {
      setStore((current) => ({
        ...current,
        splits: [
          ...current.splits,
          {
            id: `split-${createSlug(name)}`,
            name,
            description: `${focus} focused split created inside Kinetic.`,
            isDefault: false,
            days: [
              {
                id: `day-${createSlug(name)}`,
                name: `${name} Day`,
                sortOrder: 1,
                focus,
                exercises: current.settings.favoriteExerciseSlugs.slice(0, 3).map((slug, index) => ({
                  id: `plan-${createSlug(name)}-${index + 1}`,
                  exerciseSlug: slug,
                  setCount: 3,
                  notes: "Autogenerated starter slot. Swap or edit as needed.",
                  targetWeight: null,
                  targetReps: 8,
                  tag: "standard",
                })),
              },
            ],
          },
        ],
      }));
    },
    createCustomExercise(exercise) {
      setStore((current) => ({
        ...current,
        customExercises: [
          ...current.customExercises,
          {
            id: `custom-${createSlug(exercise.name)}`,
            slug: createSlug(exercise.name),
            name: exercise.name,
            source: "custom",
            force: null,
            level: "all-levels",
            mechanic: "custom",
            equipment: exercise.equipment ?? "custom",
            category: "strength",
            primaryMuscles: exercise.primaryMuscles,
            secondaryMuscles: [],
            instructions:
              exercise.instructions ?? [
                "Add your own notes to keep this movement searchable and reusable.",
              ],
            anatomyLabel: exercise.primaryMuscles[0] ?? "Custom",
            images: [],
          },
        ],
      }));
    },
  };

  return (
    <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
  );
}

export function useWorkoutStore() {
  const context = useContext(WorkoutContext);

  if (!context) {
    throw new Error("useWorkoutStore must be used inside WorkoutProvider.");
  }

  return context;
}
