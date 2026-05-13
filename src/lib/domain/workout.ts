import type {
  ActiveWorkoutSession,
  CompletedWorkoutSession,
  ExerciseCatalogItem,
  ExerciseTag,
  PreviousPerformance,
  SessionExercise,
  SplitDay,
  UserProfile,
  UserSettings,
  WorkoutSet,
} from "@/types/kinetic";

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function renumberSets(sets: WorkoutSet[]) {
  return sets.map((set, index) => ({
    ...set,
    setNumber: index + 1,
  }));
}

export function findPreviousPerformance(
  history: CompletedWorkoutSession[],
  exerciseSlug: string,
): PreviousPerformance {
  const sessions = [...history].sort((a, b) =>
    b.finishedAt.localeCompare(a.finishedAt),
  );

  for (const session of sessions) {
    const exercise = session.exercises.find(
      (entry) => entry.exerciseSlug === exerciseSlug,
    );

    if (!exercise) {
      continue;
    }

    const completedSet = [...exercise.sets]
      .filter((set) => set.completedAt)
      .sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""))[0];

    if (completedSet) {
      return {
        weight: completedSet.completedWeight,
        reps: completedSet.completedReps,
        completedAt: completedSet.completedAt,
      };
    }
  }

  return {
    weight: null,
    reps: null,
    completedAt: null,
  };
}

export function calculateEffectiveLoad(
  set: WorkoutSet,
  tag: ExerciseTag,
  bodyWeight: number | null,
) {
  const completedWeight = set.completedWeight ?? set.draftWeight ?? 0;

  if (tag === "assisted") {
    if (bodyWeight == null || set.assistAmount == null) {
      return completedWeight;
    }

    return Math.max(bodyWeight - set.assistAmount, 0);
  }

  return completedWeight;
}

export function createDraftSets(
  previous: PreviousPerformance,
  setCount = 3,
): WorkoutSet[] {
  return Array.from({ length: setCount }, (_, index) => ({
    id: createId("set"),
    setNumber: index + 1,
    previousWeight: previous.weight,
    previousReps: previous.reps,
    draftWeight: previous.weight,
    draftReps: previous.reps,
    assistAmount: null,
    completedWeight: null,
    completedReps: null,
    completedAt: null,
  }));
}

export function createSessionExercise(
  exercise: ExerciseCatalogItem,
  history: CompletedWorkoutSession[],
  overrides: Partial<
    Pick<SessionExercise, "tag" | "notes" | "targetWeight" | "targetReps">
  > & {
    setCount?: number;
  } = {},
): SessionExercise {
  const previous = findPreviousPerformance(history, exercise.slug);

  return {
    id: createId("exercise"),
    exerciseSlug: exercise.slug,
    exerciseName: exercise.name,
    order: 0,
    tag: overrides.tag ?? "standard",
    notes: overrides.notes ?? "",
    targetWeight: overrides.targetWeight ?? null,
    targetReps: overrides.targetReps ?? null,
    sets: createDraftSets(previous, overrides.setCount ?? 3),
  };
}

function setActivePointer(session: ActiveWorkoutSession) {
  const nextExercise = session.exercises.find((exercise) =>
    exercise.sets.some((set) => !set.completedAt),
  );
  const nextSet = nextExercise?.sets.find((set) => !set.completedAt) ?? null;

  return {
    ...session,
    activeExerciseId: nextExercise?.id ?? null,
    activeSetId: nextSet?.id ?? null,
  };
}

function resolveExerciseOrder(session: ActiveWorkoutSession) {
  return {
    ...session,
    exercises: session.exercises.map((exercise, index) => ({
      ...exercise,
      order: index,
    })),
  };
}

export function startBlankWorkout(_settings: UserSettings) {
  void _settings;

  return {
    id: createId("session"),
    title: "Blank Workout",
    entryPoint: "blank" as const,
    splitId: null,
    splitDayId: null,
    startedAt: new Date().toISOString(),
    notes: "",
    exercises: [],
    activeExerciseId: null,
    activeSetId: null,
    restTimerEndsAt: null,
  };
}

export function startWorkoutFromSplitDay(
  day: SplitDay,
  catalog: ExerciseCatalogItem[],
  history: CompletedWorkoutSession[],
  _settings: UserSettings,
  splitId: string,
) {
  void _settings;

  const exercises = day.exercises
    .map((plan) => {
      const exercise = catalog.find((entry) => entry.slug === plan.exerciseSlug);

      if (!exercise) {
        return null;
      }

      return createSessionExercise(exercise, history, {
        tag: plan.tag,
        notes: plan.notes,
        targetReps: plan.targetReps,
        targetWeight: plan.targetWeight,
        setCount: plan.setCount,
      });
    })
    .filter(Boolean) as SessionExercise[];

  return setActivePointer(
    resolveExerciseOrder({
      id: createId("session"),
      title: day.name,
      entryPoint: "split_day",
      splitId,
      splitDayId: day.id,
      startedAt: new Date().toISOString(),
      notes: "",
      exercises,
      activeExerciseId: exercises[0]?.id ?? null,
      activeSetId: exercises[0]?.sets[0]?.id ?? null,
      restTimerEndsAt: null,
    }),
  );
}

export function addExerciseToSession(
  session: ActiveWorkoutSession,
  exercise: ExerciseCatalogItem,
  history: CompletedWorkoutSession[],
) {
  const nextExercise = createSessionExercise(exercise, history);

  const updated = resolveExerciseOrder({
    ...session,
    exercises: [...session.exercises, nextExercise],
    activeExerciseId: session.activeExerciseId ?? nextExercise.id,
    activeSetId: session.activeSetId ?? nextExercise.sets[0]?.id ?? null,
  });

  return setActivePointer(updated);
}

export function updateSetDraft(
  session: ActiveWorkoutSession,
  exerciseId: string,
  setId: string,
  patch: Partial<Pick<WorkoutSet, "draftWeight" | "draftReps" | "assistAmount">>,
) {
  return {
    ...session,
    exercises: session.exercises.map((exercise) => {
      if (exercise.id !== exerciseId) {
        return exercise;
      }

      return {
        ...exercise,
        sets: exercise.sets.map((set) =>
          set.id === setId
            ? {
                ...set,
                ...patch,
              }
            : set,
        ),
      };
    }),
  };
}

export function selectActiveSet(
  session: ActiveWorkoutSession,
  exerciseId: string | null,
  setId: string | null,
) {
  return {
    ...session,
    activeExerciseId: exerciseId,
    activeSetId: setId,
  };
}

export function addSetToExercise(
  session: ActiveWorkoutSession,
  exerciseId: string,
  history: CompletedWorkoutSession[],
) {
  const updated = {
    ...session,
    exercises: session.exercises.map((exercise) => {
      if (exercise.id !== exerciseId) {
        return exercise;
      }

      const previous = findPreviousPerformance(history, exercise.exerciseSlug);
      const nextSet = createDraftSets(previous, 1)[0];

      return {
        ...exercise,
        sets: renumberSets([...exercise.sets, nextSet]),
      };
    }),
  };

  return setActivePointer(updated);
}

export function deleteSetFromExercise(
  session: ActiveWorkoutSession,
  exerciseId: string,
  setId: string,
) {
  const updated = {
    ...session,
    exercises: session.exercises.map((exercise) => {
      if (exercise.id !== exerciseId) {
        return exercise;
      }

      return {
        ...exercise,
        sets: renumberSets(exercise.sets.filter((set) => set.id !== setId)),
      };
    }),
  };

  return setActivePointer(updated);
}

export function removeSessionExercise(
  session: ActiveWorkoutSession,
  exerciseId: string,
) {
  const updated = resolveExerciseOrder({
    ...session,
    exercises: session.exercises.filter((exercise) => exercise.id !== exerciseId),
  });

  return setActivePointer(updated);
}

export function moveSessionExercise(
  session: ActiveWorkoutSession,
  fromIndex: number,
  toIndex: number,
) {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= session.exercises.length ||
    toIndex >= session.exercises.length
  ) {
    return session;
  }

  const nextExercises = [...session.exercises];
  const [item] = nextExercises.splice(fromIndex, 1);

  if (!item) {
    return session;
  }

  nextExercises.splice(toIndex, 0, item);

  return resolveExerciseOrder({
    ...session,
    exercises: nextExercises,
  });
}

export function logActiveSet(
  session: ActiveWorkoutSession,
  settings: UserSettings,
) {
  if (!session.activeExerciseId || !session.activeSetId) {
    return session;
  }

  const updated = {
    ...session,
    restTimerEndsAt: settings.restTimerEnabled
      ? new Date(Date.now() + settings.restTimerSeconds * 1000).toISOString()
      : null,
    exercises: session.exercises.map((exercise) => {
      if (exercise.id !== session.activeExerciseId) {
        return exercise;
      }

      return {
        ...exercise,
        sets: exercise.sets.map((set) => {
          if (set.id !== session.activeSetId) {
            return set;
          }

          const resolvedWeight = set.draftWeight ?? set.previousWeight;
          const resolvedReps = set.draftReps ?? set.previousReps;

          if (resolvedWeight == null && resolvedReps == null) {
            return set;
          }

          return {
            ...set,
            completedWeight: resolvedWeight,
            completedReps: resolvedReps,
            completedAt: new Date().toISOString(),
          };
        }),
      };
    }),
  };

  return setActivePointer(updated);
}

export function finishWorkout(
  session: ActiveWorkoutSession,
  notes: string,
  title?: string,
): CompletedWorkoutSession {
  const completedExercises = session.exercises
    .map((exercise) => ({
      ...exercise,
      sets: exercise.sets.filter((set) => set.completedAt),
    }))
    .filter((exercise) => exercise.sets.length > 0);

  return {
    ...session,
    title: title?.trim() || session.title.trim() || "Blank Workout",
    notes,
    exercises: completedExercises,
    activeExerciseId: null,
    activeSetId: null,
    restTimerEndsAt: null,
    finishedAt: new Date().toISOString(),
  };
}

export function getSessionVolume(
  session: CompletedWorkoutSession,
  profile: UserProfile,
) {
  return session.exercises.reduce((sessionTotal, exercise) => {
    const exerciseTotal = exercise.sets.reduce((setTotal, set) => {
      const reps = set.completedReps ?? 0;

      return (
        setTotal +
        calculateEffectiveLoad(set, exercise.tag, profile.bodyWeight) * reps
      );
    }, 0);

    return sessionTotal + exerciseTotal;
  }, 0);
}
