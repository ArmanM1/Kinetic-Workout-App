"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  FolderHeart,
  Heart,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
  Zap,
} from "lucide-react";

import { useWorkoutStore } from "@/components/providers/workout-provider";
import { CustomExerciseDialog } from "@/components/exercises/custom-exercise-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { searchExercises } from "@/lib/data/catalog";
import { calculateExerciseEstimatedOneRepMax } from "@/lib/domain/analytics";
import type { ExerciseCatalogItem } from "@/types/kinetic";
import { cn } from "@/lib/utils";

function parseNumericInput(value: string) {
  const normalized = value.trim().replace(",", ".");

  if (normalized === "") {
    return null;
  }

  const numeric = Number(normalized);

  return Number.isNaN(numeric) ? null : numeric;
}

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainder = (seconds % 60).toString().padStart(2, "0");

  return `${minutes}:${remainder}`;
}

export function ActiveWorkoutClient() {
  const router = useRouter();
  const {
    activeSession,
    catalog,
    history,
    profile,
    recentExerciseSlugs,
    settings,
    addExercise,
    addSet,
    clearActiveSession,
    deleteSet,
    finishActiveSession,
    logFocusedSet,
    selectSet,
    startBlankSession,
    toggleFavorite,
    updateActiveSessionTitle,
    updateDraft,
  } = useWorkoutStore();
  const [searchQuery, setSearchQuery] = useState("");
  const deferredQuery = useDeferredValue(searchQuery);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [librarySection, setLibrarySection] = useState<"quick" | "all" | "favorites" | "recent">(
    "quick",
  );
  const [finishDialogOpen, setFinishDialogOpen] = useState(false);
  const [finishNotes, setFinishNotes] = useState("");
  const [restNow, setRestNow] = useState(0);
  const [dismissedTimerKey, setDismissedTimerKey] = useState<string | null>(null);
  const [keyboardInset, setKeyboardInset] = useState(0);
  const [prefersDockEditor, setPrefersDockEditor] = useState(false);
  const [pendingDeleteSet, setPendingDeleteSet] = useState<{
    exerciseId: string;
    setId: string;
    exerciseName: string;
    setNumber: number;
  } | null>(null);
  const [discardAlertOpen, setDiscardAlertOpen] = useState(false);
  const dockLoadInputRef = useRef<HTMLInputElement>(null);
  const dockRepsInputRef = useRef<HTMLInputElement>(null);
  const dockFieldRef = useRef<"load" | "reps">("load");
  const pendingDockFocusRef = useRef<"load" | "reps" | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRestNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) {
      return;
    }

    const viewport = window.visualViewport;

    const updateKeyboardInset = () => {
      const nextInset = Math.max(
        0,
        window.innerHeight - viewport.height - viewport.offsetTop,
      );

      setKeyboardInset(nextInset > 120 ? nextInset : 0);
    };

    updateKeyboardInset();
    viewport.addEventListener("resize", updateKeyboardInset);
    viewport.addEventListener("scroll", updateKeyboardInset);
    window.addEventListener("orientationchange", updateKeyboardInset);

    return () => {
      viewport.removeEventListener("resize", updateKeyboardInset);
      viewport.removeEventListener("scroll", updateKeyboardInset);
      window.removeEventListener("orientationchange", updateKeyboardInset);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const syncDockPreference = () => {
      setPrefersDockEditor(window.innerWidth < 640);
    };

    syncDockPreference();
    window.addEventListener("resize", syncDockPreference);

    return () => {
      window.removeEventListener("resize", syncDockPreference);
    };
  }, []);

  const visibleCatalog = catalog.filter(
    (exercise) => !settings.archivedExerciseSlugs.includes(exercise.slug),
  );
  const catalogBySlug = new Map(catalog.map((exercise) => [exercise.slug, exercise]));
  const quickExercises = Array.from(
    new Set([
      ...settings.favoriteExerciseSlugs,
      ...recentExerciseSlugs,
    ]),
  )
    .map((slug) => visibleCatalog.find((exercise) => exercise.slug === slug) ?? null)
    .filter((exercise): exercise is ExerciseCatalogItem => exercise !== null)
    .slice(0, 8);
  const activeLibrarySection =
    librarySection === "quick" && quickExercises.length === 0 ? "all" : librarySection;
  const librarySource =
    activeLibrarySection === "quick"
      ? quickExercises
      : visibleCatalog.filter((exercise) => {
          if (activeLibrarySection === "favorites") {
            return settings.favoriteExerciseSlugs.includes(exercise.slug);
          }

          if (activeLibrarySection === "recent") {
            return recentExerciseSlugs.includes(exercise.slug);
          }

          return true;
        });
  const filteredExercises = searchExercises(librarySource, deferredQuery, {
    source: "all",
  }).slice(0, 24);
  const activeExercise =
    activeSession?.exercises.find((exercise) => exercise.id === activeSession?.activeExerciseId) ??
    null;
  const activeSet =
    activeExercise?.sets.find((set) => set.id === activeSession?.activeSetId) ?? null;
  const workoutTitle = activeSession?.title.trim() || "Blank Workout";
  const activeSetHasValues = Boolean(
    activeSet &&
      (activeSet.draftWeight != null ||
        activeSet.draftReps != null ||
        activeSet.previousWeight != null ||
        activeSet.previousReps != null ||
        activeSet.assistAmount != null),
  );
  const restSecondsRemaining = activeSession?.restTimerEndsAt
    ? Math.max(0, Math.ceil((new Date(activeSession.restTimerEndsAt).getTime() - restNow) / 1000))
    : 0;
  const isRestTimerVisible =
    restSecondsRemaining > 0 && dismissedTimerKey !== activeSession?.restTimerEndsAt;
  const activeLoadValue =
    activeExercise?.tag === "assisted"
      ? activeSet?.assistAmount ?? ""
      : activeSet?.draftWeight ?? "";
  const activeRepsValue = activeSet?.draftReps ?? "";
  const isKeyboardOpen = keyboardInset > 0;
  const isDockEditorOpen = Boolean(prefersDockEditor && activeSet);
  const dockEditorBottom = isKeyboardOpen ? keyboardInset + 8 : 84;
  const workoutBottomPadding = isDockEditorOpen ? dockEditorBottom + 188 : 176;
  const actionBarBottom = isKeyboardOpen ? keyboardInset + 12 : 96;
  const restTimerBottom = isKeyboardOpen ? keyboardInset + 88 : 160;

  function handleAddExercise(exerciseSlug: string) {
    addExercise(exerciseSlug);
    setSearchQuery("");
    setLibrarySection("quick");
    setLibraryOpen(false);
  }

  function focusSet(
    exerciseId: string,
    setId: string,
    options?: { field?: "load" | "reps"; openDock?: boolean; maintainDock?: boolean },
  ) {
    if (options?.field) {
      dockFieldRef.current = options.field;
    }

    if (prefersDockEditor && (options?.openDock || options?.maintainDock)) {
      pendingDockFocusRef.current = options.field ?? dockFieldRef.current;
    }

    selectSet(exerciseId, setId);

    window.setTimeout(() => {
      document
        .querySelector<HTMLElement>(`[data-set-id="${setId}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  }

  function handleActiveSetDraftUpdate(
    field: "load" | "reps",
    value: string,
  ) {
    if (!activeExercise || !activeSet) {
      return;
    }

    dockFieldRef.current = field;
    updateDraft(activeExercise.id, activeSet.id, {
      [field === "load"
        ? activeExercise.tag === "assisted"
          ? "assistAmount"
          : "draftWeight"
        : "draftReps"]: parseNumericInput(value),
    });
  }

  function handleLogSet() {
    if (isDockEditorOpen && activeSet) {
      pendingDockFocusRef.current = dockFieldRef.current;
    }

    logFocusedSet();
  }

  useEffect(() => {
    if (!isDockEditorOpen || !activeSet || !pendingDockFocusRef.current) {
      if (!activeSet) {
        pendingDockFocusRef.current = null;
      }
      return;
    }

    const field = pendingDockFocusRef.current;
    const target = field === "reps" ? dockRepsInputRef.current : dockLoadInputRef.current;
    const timeout = window.setTimeout(() => {
      target?.focus();
      target?.select();
      pendingDockFocusRef.current = null;
    }, 60);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [activeSet, isDockEditorOpen]);

  useEffect(() => {
    if (!isDockEditorOpen || !activeSet) {
      return;
    }

    const timeout = window.setTimeout(() => {
      document
        .querySelector<HTMLElement>(`[data-set-id="${activeSet.id}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 90);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [activeSet, isDockEditorOpen]);

  if (!activeSession) {
    return (
      <div className="space-y-4">
        <Card className="border-white/10 bg-white/[0.04] text-white">
          <CardContent className="space-y-4 p-5">
            <div>
              <p className="text-3xl font-semibold tracking-tight">No workout live</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                className="bg-lime-300 text-zinc-950 hover:bg-lime-200"
                onClick={() => {
                  startBlankSession();
                  router.push("/app/active-workout");
                }}
              >
                <Plus className="size-4" />
                Start Empty Workout
              </Button>
              <Button asChild variant="outline">
                <Link href="/app/splits">Browse Splits</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Drawer open={libraryOpen} onOpenChange={setLibraryOpen} fixed repositionInputs>
        <DrawerContent className="border-white/10 bg-zinc-950 text-white">
          <DrawerHeader className="px-5 pb-2 pt-5 text-left">
            <div className="flex items-center justify-between gap-3">
              <DrawerTitle className="text-left text-lg text-white">Add exercise</DrawerTitle>
              <CustomExerciseDialog
                description="Create and add something unique without leaving the workout."
                onCreated={({ name, slug }) => {
                  setSearchQuery(name);
                  handleAddExercise(slug);
                }}
                title="Create exercise"
                trigger={
                  <button
                    type="button"
                    className="lift-tap flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium uppercase tracking-[0.22em] text-zinc-300 transition hover:border-lime-300/30 hover:text-white"
                  >
                    <Sparkles className="size-3.5 text-lime-300" />
                    Custom
                  </button>
                }
              />
            </div>
          </DrawerHeader>
          <div className="space-y-4 px-5 pb-5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-12 rounded-2xl border-white/10 bg-white/[0.03] pl-11 text-white placeholder:text-zinc-500"
                placeholder="Search exercises..."
                aria-label="Search exercises"
              />
            </div>
            <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[
                { id: "quick" as const, label: "Quick", icon: Zap },
                { id: "all" as const, label: "All", icon: Search },
                { id: "favorites" as const, label: "Favorites", icon: FolderHeart },
                { id: "recent" as const, label: "Recent", icon: Sparkles },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLibrarySection(item.id)}
                    className={cn(
                      "lift-tap flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium uppercase tracking-[0.22em] transition",
                      activeLibrarySection === item.id
                        ? "border-lime-300/30 bg-lime-300/10 text-lime-200"
                        : "border-white/8 bg-white/[0.02] text-zinc-500 hover:text-white",
                    )}
                  >
                    <Icon className="size-3.5" />
                    {item.label}
                  </button>
                );
              })}
            </div>
            <div className="no-scrollbar max-h-[min(56vh,calc(100dvh-16rem))] space-y-2 overflow-y-auto pr-1 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
              {filteredExercises.map((exercise) => (
                <button
                  key={exercise.slug}
                  type="button"
                  onClick={() => handleAddExercise(exercise.slug)}
                  className="lift-tap flex w-full items-center justify-between rounded-[1.7rem] border border-white/8 bg-white/[0.03] px-4 py-4 text-left transition hover:border-lime-300/20 hover:bg-white/[0.05]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-base font-medium text-white">{exercise.name}</p>
                    <p className="mt-1 truncate text-sm text-zinc-400">
                      {exercise.anatomyLabel} / {exercise.equipment ?? "Bodyweight"}
                    </p>
                  </div>
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-lime-300 text-zinc-950">
                    <Plus className="size-4" />
                  </div>
                </button>
              ))}
              {filteredExercises.length === 0 ? (
                <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-center">
                  <p className="text-sm font-medium text-white">Nothing here yet</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Try another section or create a custom exercise.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <Dialog open={finishDialogOpen} onOpenChange={setFinishDialogOpen}>
        <DialogContent className="border border-white/10 bg-zinc-950 text-white">
          <DialogHeader>
            <DialogTitle>End workout?</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Textarea
              value={finishNotes}
              onChange={(event) => setFinishNotes(event.target.value)}
              className="min-h-24 rounded-2xl border-white/10 bg-white/[0.03] text-white placeholder:text-zinc-500"
              placeholder="Optional note for this session."
            />
            <div className="grid gap-2 sm:grid-cols-3">
              <Button variant="outline" onClick={() => setFinishDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="outline"
                className="border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
                onClick={() => {
                  setDiscardAlertOpen(true);
                }}
              >
                Discard
              </Button>
              <Button
                className="bg-lime-300 text-zinc-950 hover:bg-lime-200"
                onClick={() => {
                  finishActiveSession(finishNotes);
                  setFinishNotes("");
                  setFinishDialogOpen(false);
                  router.push("/app");
                }}
              >
                Finish Workout
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={discardAlertOpen} onOpenChange={setDiscardAlertOpen}>
        <AlertDialogContent className="border border-rose-400/20 bg-zinc-950 text-white">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-rose-500/12 text-rose-300">
              <AlertTriangle className="size-5" />
            </AlertDialogMedia>
            <AlertDialogTitle>Discard this workout?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              This clears the live session and removes any unfinished progress from the screen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="border-white/10 bg-white/[0.03]">
            <AlertDialogCancel className="border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]">
              Keep workout
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                clearActiveSession();
                setFinishNotes("");
                setFinishDialogOpen(false);
                router.push("/app");
              }}
            >
              Discard workout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={pendingDeleteSet !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDeleteSet(null);
          }
        }}
      >
        <AlertDialogContent className="border border-rose-400/20 bg-zinc-950 text-white">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-rose-500/12 text-rose-300">
              <Trash2 className="size-5" />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete this set?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              {pendingDeleteSet
                ? `${pendingDeleteSet.exerciseName} set ${pendingDeleteSet.setNumber} will be removed.`
                : "This set will be removed."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="border-white/10 bg-white/[0.03]">
            <AlertDialogCancel className="border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]">
              Keep set
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (!pendingDeleteSet) {
                  return;
                }

                deleteSet(pendingDeleteSet.exerciseId, pendingDeleteSet.setId);
                setPendingDeleteSet(null);
              }}
            >
              Delete set
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="ios-page space-y-4" style={{ paddingBottom: `${workoutBottomPadding}px` }}>
        <section className="ios-card space-y-4 rounded-[2rem] border border-white/8 bg-white/[0.04] p-5 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge className="border border-lime-300/20 bg-lime-300/10 text-lime-100">
                {activeSession.entryPoint === "blank" ? "Blank workout" : "Split day"}
              </Badge>
              {activeSession.entryPoint === "blank" ? (
                <Input
                  value={activeSession.title}
                  onChange={(event) => updateActiveSessionTitle(event.target.value)}
                  onBlur={(event) =>
                    updateActiveSessionTitle(event.target.value.trim() || "Blank Workout")
                  }
                  placeholder="Blank Workout"
                  className="mt-3 h-auto border-0 bg-transparent p-0 text-4xl font-semibold tracking-tight text-white shadow-none placeholder:text-white focus-visible:ring-0"
                  aria-label="Workout title"
                />
              ) : (
                <h1 className="mt-3 text-4xl font-semibold tracking-tight">{workoutTitle}</h1>
              )}
              <p className="mt-2 text-sm text-zinc-500">
                {new Intl.DateTimeFormat("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                }).format(new Date(activeSession.startedAt))}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setFinishDialogOpen(true)}>
              Finish
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {activeExercise && activeSet ? (
              <div className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs uppercase tracking-[0.22em] text-zinc-400">
                {activeExercise.exerciseName} / Set {activeSet.setNumber}
              </div>
            ) : null}
            {profile.bodyWeight == null &&
            activeSession.exercises.some((exercise) => exercise.tag === "assisted") ? (
              <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-xs uppercase tracking-[0.22em] text-amber-100">
                Set body weight
              </div>
            ) : null}
          </div>
        </section>

        {activeSession.exercises.length === 0 ? (
          <Card className="ios-card border-dashed border-white/12 bg-white/[0.03] text-white">
            <CardContent className="space-y-4 p-5">
              <p className="text-2xl font-semibold">Add your first exercise</p>
              <Button
                className="bg-lime-300 text-zinc-950 hover:bg-lime-200"
                onClick={() => setLibraryOpen(true)}
              >
                <Plus className="size-4" />
                Add Exercise
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {activeSession.exercises.map((exercise) => {
              const catalogExercise = catalogBySlug.get(exercise.exerciseSlug);
              const muscleTag =
                catalogExercise?.anatomyLabel ??
                catalogExercise?.primaryMuscles[0] ??
                "Full body";
              const previousSession = history.find((session) =>
                session.exercises.some((entry) => entry.exerciseSlug === exercise.exerciseSlug),
              );
              const estimatedOneRepMax = calculateExerciseEstimatedOneRepMax(
                exercise,
                profile.bodyWeight,
              );

              return (
                <Card
                  key={exercise.id}
                  className="ios-card overflow-hidden rounded-[1.75rem] border-white/8 bg-white/[0.04] text-white"
                >
                  <CardContent className="p-0">
                    <div className="border-b border-white/6 px-4 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-xl font-semibold">{exercise.exerciseName}</p>
                            <Badge
                              variant="outline"
                              className="border-cyan-300/20 bg-cyan-300/10 text-cyan-200"
                            >
                              {muscleTag}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="border-white/10 bg-white/[0.03] text-zinc-300"
                            >
                              {exercise.tag.replace("_", " ")}
                            </Badge>
                          </div>
                          {previousSession ? (
                            <p className="mt-2 text-[0.68rem] uppercase tracking-[0.24em] text-lime-200/70">
                              {previousSession.title}
                            </p>
                          ) : null}
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="flex min-w-[3.5rem] flex-col items-center rounded-[1.2rem] border border-white/10 bg-black/20 px-2.5 py-1.5 text-center">
                            <p className="text-[0.5rem] font-semibold uppercase leading-none tracking-[0.24em] text-zinc-500">
                              Est
                            </p>
                            <p className="mt-0.5 text-[0.5rem] font-semibold uppercase leading-none tracking-[0.24em] text-zinc-500">
                              1RM
                            </p>
                            <p className="mt-1 text-[0.78rem] font-semibold leading-none text-sky-300">
                              {estimatedOneRepMax > 0 ? estimatedOneRepMax : "--"}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleFavorite(exercise.exerciseSlug)}
                            className={cn(
                              "flex size-10 shrink-0 items-center justify-center rounded-2xl border transition",
                              settings.favoriteExerciseSlugs.includes(exercise.exerciseSlug)
                                ? "border-lime-300/20 bg-lime-300/10 text-lime-300"
                                : "border-white/10 bg-black/20 text-zinc-500 hover:text-white",
                            )}
                          >
                            <Heart
                              className={cn(
                                "size-4",
                                settings.favoriteExerciseSlugs.includes(exercise.exerciseSlug) &&
                                  "fill-current",
                              )}
                            />
                            <span className="sr-only">Toggle favorite</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-[3rem_1fr_1fr_auto] gap-2 border-b border-white/6 px-4 py-2 text-[0.68rem] uppercase tracking-[0.24em] text-zinc-500">
                      <span>Set</span>
                      <span>{exercise.tag === "assisted" ? "Assist" : profile.weightUnit}</span>
                      <span>Reps</span>
                      <span />
                    </div>

                    {exercise.sets.map((set, setIndex) => {
                      const isActive = set.id === activeSession.activeSetId;
                      const isLogged = Boolean(set.completedAt);
                      const loadValue =
                        exercise.tag === "assisted" ? set.assistAmount ?? "" : set.draftWeight ?? "";

                      return (
                        <div
                          key={set.id}
                          data-set-id={set.id}
                          className={cn(
                            "mx-3 mb-3 rounded-[1.35rem] border px-3 py-3 transition",
                            isActive &&
                              "border-lime-300/50 bg-lime-300/12 shadow-[0_18px_50px_-38px_rgba(196,255,57,1)]",
                            isLogged && !isActive && "border-white/6 bg-white/[0.03]",
                            !isActive && !isLogged && "border-transparent bg-black/20",
                          )}
                          onClick={() =>
                            focusSet(exercise.id, set.id, {
                              maintainDock: isDockEditorOpen,
                            })
                          }
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                            <button
                                type="button"
                                aria-label={`Select set ${set.setNumber}`}
                                className={cn(
                                  "flex h-10 w-10 items-center justify-center rounded-xl text-base font-semibold transition",
                                  isActive
                                    ? "bg-lime-300 text-zinc-950"
                                    : "bg-white/[0.06] text-white",
                                )}
                                onClick={() =>
                                  focusSet(exercise.id, set.id, {
                                    maintainDock: isDockEditorOpen,
                                  })
                                }
                              >
                              {setIndex + 1}
                              </button>
                              {set.previousWeight != null || set.previousReps != null ? (
                                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-zinc-500">
                                  {set.previousWeight ?? "-"} {profile.weightUnit} x {set.previousReps ?? "-"}
                                </p>
                              ) : (
                                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-zinc-600">
                                  New
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                setPendingDeleteSet({
                                  exerciseId: exercise.id,
                                  setId: set.id,
                                  exerciseName: exercise.exerciseName,
                                  setNumber: set.setNumber,
                                });
                              }}
                              className="flex size-9 items-center justify-center rounded-full text-zinc-500 transition hover:bg-white/[0.05] hover:text-white"
                            >
                              <Trash2 className="size-4" />
                              <span className="sr-only">Delete set</span>
                            </button>
                          </div>

                          {prefersDockEditor ? (
                            <div className="mt-3 grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  focusSet(exercise.id, set.id, {
                                    field: "load",
                                    openDock: true,
                                  })
                                }
                                className={cn(
                                  "flex h-12 items-center rounded-2xl border px-4 text-left text-base font-medium transition",
                                  isActive
                                    ? "border-lime-300/40 bg-lime-300/10 text-white"
                                    : "border-white/10 bg-black/20 text-zinc-300",
                                )}
                              >
                                {loadValue || (exercise.tag === "assisted" ? "Assist" : "Weight")}
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  focusSet(exercise.id, set.id, {
                                    field: "reps",
                                    openDock: true,
                                  })
                                }
                                className={cn(
                                  "flex h-12 items-center rounded-2xl border px-4 text-left text-base font-medium transition",
                                  isActive
                                    ? "border-lime-300/40 bg-lime-300/10 text-white"
                                    : "border-white/10 bg-black/20 text-zinc-300",
                                )}
                              >
                                {set.draftReps ?? "Reps"}
                              </button>
                              {isActive ? (
                                <p className="col-span-2 text-[0.68rem] uppercase tracking-[0.22em] text-lime-200/70">
                                  Editing below
                                </p>
                              ) : null}
                            </div>
                          ) : (
                            <div className="mt-3 grid grid-cols-2 gap-2">
                              <Input
                                value={loadValue}
                                inputMode={exercise.tag === "assisted" ? "numeric" : "decimal"}
                                enterKeyHint="next"
                                autoComplete="off"
                                pattern="[0-9]*[.,]?[0-9]*"
                                onFocus={() =>
                                  focusSet(exercise.id, set.id, {
                                    field: "load",
                                  })
                                }
                                onChange={(event) =>
                                  updateDraft(exercise.id, set.id, {
                                    [exercise.tag === "assisted" ? "assistAmount" : "draftWeight"]:
                                      parseNumericInput(event.target.value),
                                  })
                                }
                                className={cn(
                                  "h-12 rounded-2xl border px-4 text-base font-medium text-white shadow-none transition placeholder:text-zinc-500 focus-visible:ring-0",
                                  isActive
                                    ? "border-lime-300/40 bg-lime-300/10"
                                    : "border-white/10 bg-black/20",
                                )}
                                placeholder={exercise.tag === "assisted" ? "Assist" : "Weight"}
                                aria-label={`${exercise.tag === "assisted" ? "Assist amount" : "Weight"} for set ${set.setNumber}`}
                              />
                              <Input
                                value={set.draftReps ?? ""}
                                inputMode="numeric"
                                enterKeyHint="done"
                                autoComplete="off"
                                pattern="[0-9]*"
                                onFocus={() =>
                                  focusSet(exercise.id, set.id, {
                                    field: "reps",
                                  })
                                }
                                onChange={(event) =>
                                  updateDraft(exercise.id, set.id, {
                                    draftReps: parseNumericInput(event.target.value),
                                  })
                                }
                                className={cn(
                                  "h-12 rounded-2xl border px-4 text-base font-medium text-white shadow-none transition placeholder:text-zinc-500 focus-visible:ring-0",
                                  isActive
                                    ? "border-lime-300/40 bg-lime-300/10"
                                    : "border-white/10 bg-black/20",
                                )}
                                placeholder="Reps"
                                aria-label={`Reps for set ${set.setNumber}`}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <div className="flex items-center justify-between gap-3 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                        {activeSession.activeExerciseId === exercise.id && activeSet
                          ? `${activeSet.previousWeight ?? "-"} ${profile.weightUnit} x ${activeSet.previousReps ?? "-"}`
                          : `${exercise.sets.length} sets`}
                      </p>
                      <button
                        type="button"
                        onClick={() => addSet(exercise.id)}
                        className="text-sm font-medium text-lime-200 transition hover:text-lime-100"
                      >
                        + Add set
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            <button
              type="button"
              onClick={() => setLibraryOpen(true)}
              className="lift-tap w-full rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] px-4 py-4 text-center text-sm font-medium text-zinc-400 transition hover:border-lime-300/20 hover:text-white"
            >
              + Add another exercise
            </button>
          </div>
        )}
      </div>

      {isRestTimerVisible && !isDockEditorOpen ? (
        <div
          className="fixed inset-x-0 z-30 mx-auto flex w-[min(25rem,calc(100%-1.5rem))] justify-end px-1"
          style={{ bottom: `${restTimerBottom}px` }}
        >
          <div className="flex items-center gap-3 rounded-[1.4rem] border border-lime-300/20 bg-zinc-950/95 px-4 py-3 text-white shadow-[0_20px_50px_-35px_rgba(0,0,0,0.95)] backdrop-blur">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.24em] text-lime-200/70">Rest</p>
              <p className="text-2xl font-semibold">{formatTimer(restSecondsRemaining)}</p>
            </div>
            <button
              type="button"
              onClick={() => setDismissedTimerKey(activeSession.restTimerEndsAt)}
              className="flex size-8 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              <X className="size-4" />
              <span className="sr-only">Dismiss timer</span>
            </button>
          </div>
        </div>
      ) : null}

      {isDockEditorOpen && activeExercise && activeSet ? (
        <div
          className="fixed inset-x-0 z-40 mx-auto w-[min(25rem,calc(100%-1rem))] px-1"
          style={{ bottom: `${dockEditorBottom}px` }}
        >
          <div className="rounded-[1.65rem] border border-white/10 bg-zinc-950/96 p-3 text-white shadow-[0_24px_70px_-36px_rgba(0,0,0,0.92)] backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{activeExercise.exerciseName}</p>
                <p className="mt-1 text-[0.68rem] uppercase tracking-[0.22em] text-lime-200/70">
                  Set {activeSet.setNumber}
                  {activeSet.previousWeight != null || activeSet.previousReps != null
                    ? ` / ${activeSet.previousWeight ?? "-"} ${profile.weightUnit} x ${activeSet.previousReps ?? "-"}`
                    : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  dockLoadInputRef.current?.blur();
                  dockRepsInputRef.current?.blur();
                  pendingDockFocusRef.current = null;
                }}
                className="flex size-8 items-center justify-center rounded-full text-zinc-500 transition hover:bg-white/[0.05] hover:text-white"
              >
                <X className="size-4" />
                <span className="sr-only">Dismiss keyboard</span>
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Input
                ref={dockLoadInputRef}
                value={activeLoadValue}
                inputMode={activeExercise.tag === "assisted" ? "numeric" : "decimal"}
                enterKeyHint="next"
                autoComplete="off"
                pattern="[0-9]*[.,]?[0-9]*"
                onFocus={() => {
                  dockFieldRef.current = "load";
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    dockRepsInputRef.current?.focus();
                  }
                }}
                onChange={(event) =>
                  handleActiveSetDraftUpdate("load", event.target.value)
                }
                className="h-12 rounded-2xl border-lime-300/40 bg-lime-300/10 px-4 text-base font-medium text-white shadow-none placeholder:text-zinc-500 focus-visible:ring-0"
                placeholder={activeExercise.tag === "assisted" ? "Assist" : "Weight"}
                aria-label={activeExercise.tag === "assisted" ? "Assist amount" : "Weight"}
              />
              <Input
                ref={dockRepsInputRef}
                value={activeRepsValue}
                inputMode="numeric"
                enterKeyHint="done"
                autoComplete="off"
                pattern="[0-9]*"
                onFocus={() => {
                  dockFieldRef.current = "reps";
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleLogSet();
                  }
                }}
                onChange={(event) =>
                  handleActiveSetDraftUpdate("reps", event.target.value)
                }
                className="h-12 rounded-2xl border-lime-300/40 bg-lime-300/10 px-4 text-base font-medium text-white shadow-none placeholder:text-zinc-500 focus-visible:ring-0"
                placeholder="Reps"
                aria-label="Reps"
              />
            </div>

            <Button
              size="lg"
              className="mt-3 h-12 w-full rounded-2xl bg-lime-300 text-base font-semibold text-zinc-950 shadow-[0_24px_70px_-40px_rgba(196,255,57,1)] hover:bg-lime-200 disabled:bg-zinc-800 disabled:text-zinc-500"
              disabled={!activeSetHasValues}
              onClick={handleLogSet}
            >
              Log Set
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="fixed inset-x-0 z-30 mx-auto w-[min(25rem,calc(100%-1.5rem))] px-1"
          style={{ bottom: `${actionBarBottom}px` }}
        >
          <div className="flex items-center gap-3">
            <Button
              size="icon-lg"
              variant="outline"
              className="size-14 rounded-2xl border-white/10 bg-zinc-950/95 text-white shadow-[0_24px_70px_-40px_rgba(0,0,0,0.9)] hover:bg-white/[0.06]"
              onClick={() => setLibraryOpen(true)}
            >
              <Plus className="size-5" />
              <span className="sr-only">Add exercise</span>
            </Button>
            <Button
              size="lg"
              className="h-14 flex-1 rounded-2xl bg-lime-300 text-base font-semibold text-zinc-950 shadow-[0_24px_70px_-40px_rgba(196,255,57,1)] hover:bg-lime-200 disabled:bg-zinc-800 disabled:text-zinc-500"
              disabled={!activeSetHasValues}
              onClick={handleLogSet}
            >
              Log Set
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
