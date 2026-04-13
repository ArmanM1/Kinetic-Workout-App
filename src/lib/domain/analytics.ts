import { format, parseISO } from "date-fns";

import { calculateEffectiveLoad, getSessionVolume } from "@/lib/domain/workout";
import type {
  BodyMetricEntry,
  CompletedWorkoutSession,
  DashboardStat,
  ExerciseCatalogItem,
  SessionExercise,
  UserProfile,
} from "@/types/kinetic";

export type BodyRegionId =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "forearms"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "core";

export type LoggedExerciseOption = {
  slug: string;
  name: string;
  sessionCount: number;
};

export type BodyRegionSummary = {
  id: BodyRegionId;
  label: string;
  totalVolume: number;
  sessionCount: number;
  balanceScore: number;
  progressDelta: number;
  shareOfTraining: number;
};

export type BodyRegionLift = {
  slug: string;
  name: string;
  maxWeight: number;
  bestEstimatedOneRm: number;
  totalVolume: number;
};

export type BodyRegionDetail = BodyRegionSummary & {
  series: Array<{
    label: string;
    volume: number;
  }>;
  lifts: BodyRegionLift[];
};

const BODY_REGION_DEFINITIONS: Array<{
  id: BodyRegionId;
  label: string;
  muscles: string[];
}> = [
  { id: "chest", label: "Chest", muscles: ["chest"] },
  {
    id: "back",
    label: "Back",
    muscles: ["lats", "middle back", "traps", "lower back"],
  },
  { id: "shoulders", label: "Shoulders", muscles: ["shoulders"] },
  { id: "biceps", label: "Biceps", muscles: ["biceps"] },
  { id: "triceps", label: "Triceps", muscles: ["triceps"] },
  { id: "forearms", label: "Forearms", muscles: ["forearms"] },
  { id: "quads", label: "Quads", muscles: ["quadriceps"] },
  { id: "hamstrings", label: "Hamstrings", muscles: ["hamstrings"] },
  { id: "glutes", label: "Glutes", muscles: ["glutes", "adductors", "abductors"] },
  { id: "calves", label: "Calves", muscles: ["calves"] },
  { id: "core", label: "Core", muscles: ["abdominals"] },
];

const bodyRegionOptions = BODY_REGION_DEFINITIONS.map(({ id, label }) => ({ id, label }));
const bodyRegionLookup = new Map(
  BODY_REGION_DEFINITIONS.flatMap((region) =>
    region.muscles.map((muscle) => [muscle, region.id] as const),
  ),
);

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function normalizeMuscle(value: string) {
  return value.trim().toLowerCase();
}

function buildCatalogMap(catalog: ExerciseCatalogItem[]) {
  return new Map(catalog.map((exercise) => [exercise.slug, exercise]));
}

function getExerciseRegions(
  exercise: Pick<SessionExercise, "exerciseSlug" | "exerciseName">,
  catalogMap: Map<string, ExerciseCatalogItem>,
) {
  const match = catalogMap.get(exercise.exerciseSlug);

  if (!match) {
    return [];
  }

  const primary = Array.from(
    new Set(
      match.primaryMuscles
        .map(normalizeMuscle)
        .map((muscle) => bodyRegionLookup.get(muscle))
        .filter(Boolean) as BodyRegionId[],
    ),
  );
  const secondary = Array.from(
    new Set(
      match.secondaryMuscles
        .map(normalizeMuscle)
        .map((muscle) => bodyRegionLookup.get(muscle))
        .filter((region): region is BodyRegionId => Boolean(region))
        .filter((region) => !primary.includes(region)),
    ),
  );

  if (primary.length > 0 && secondary.length > 0) {
    const primaryShare = 0.7 / primary.length;
    const secondaryShare = 0.3 / secondary.length;

    return [
      ...primary.map((id) => ({ id, share: primaryShare })),
      ...secondary.map((id) => ({ id, share: secondaryShare })),
    ];
  }

  if (primary.length > 0) {
    return primary.map((id) => ({ id, share: 1 / primary.length }));
  }

  if (secondary.length > 0) {
    return secondary.map((id) => ({ id, share: 1 / secondary.length }));
  }

  return [];
}

function getExerciseBestStats(
  exercise: Pick<SessionExercise, "sets" | "tag">,
  bodyWeight: number | null,
) {
  return exercise.sets.reduce(
    (top, set) => {
      if (!set.completedReps) {
        return top;
      }

      const effectiveLoad = calculateEffectiveLoad(set, exercise.tag, bodyWeight);
      const candidateOneRm = estimateOneRepMax(effectiveLoad, set.completedReps);

      return {
        maxWeight: Math.max(top.maxWeight, effectiveLoad),
        bestEstimatedOneRm: Math.max(top.bestEstimatedOneRm, candidateOneRm),
      };
    },
    { maxWeight: 0, bestEstimatedOneRm: 0 },
  );
}

function getExerciseProgressDelta(series: Array<{ label: string; volume: number }>) {
  const meaningfulSeries = series
    .map((entry) => entry.volume)
    .filter((volume) => volume > 0);

  if (meaningfulSeries.length < 2) {
    return 0;
  }

  const recent = meaningfulSeries.slice(-2);
  const previous = meaningfulSeries.slice(-4, -2);

  if (previous.length === 0) {
    return ((recent.at(-1) ?? 0) - recent[0]) / Math.max(recent[0], 1);
  }

  const recentAverage = recent.reduce((sum, value) => sum + value, 0) / recent.length;
  const previousAverage =
    previous.reduce((sum, value) => sum + value, 0) / previous.length;

  return (recentAverage - previousAverage) / Math.max(previousAverage, 1);
}

export function estimateOneRepMax(weight: number, reps: number) {
  if (weight <= 0 || reps <= 0) {
    return 0;
  }

  return weight * (1 + reps / 30);
}

export function calculateExerciseEstimatedOneRepMax(
  exercise: Pick<SessionExercise, "sets" | "tag">,
  bodyWeight: number | null,
) {
  return Math.round(
    exercise.sets.reduce((top, set) => {
      if (!set.completedReps) {
        return top;
      }

      const candidate = estimateOneRepMax(
        calculateEffectiveLoad(set, exercise.tag, bodyWeight),
        set.completedReps,
      );

      return Math.max(top, candidate);
    }, 0),
  );
}

export function calculateCurrentAndLongestStreak(history: CompletedWorkoutSession[]) {
  const uniqueDays = Array.from(
    new Set(history.map((session) => session.finishedAt.slice(0, 10))),
  ).sort();

  if (uniqueDays.length === 0) {
    return {
      current: 0,
      longest: 0,
    };
  }

  let longest = 1;
  let current = 1;
  let running = 1;

  for (let index = 1; index < uniqueDays.length; index += 1) {
    const previous = parseISO(`${uniqueDays[index - 1]}T00:00:00.000Z`);
    const next = parseISO(`${uniqueDays[index]}T00:00:00.000Z`);
    const difference = Math.round(
      (next.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24),
    );

    running = difference === 1 ? running + 1 : 1;
    longest = Math.max(longest, running);
  }

  for (let index = uniqueDays.length - 1; index > 0; index -= 1) {
    const previous = parseISO(`${uniqueDays[index - 1]}T00:00:00.000Z`);
    const next = parseISO(`${uniqueDays[index]}T00:00:00.000Z`);
    const difference = Math.round(
      (next.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (difference === 1) {
      current += 1;
    } else {
      break;
    }
  }

  return {
    current,
    longest,
  };
}

export function buildDashboardStats(
  history: CompletedWorkoutSession[],
  profile: UserProfile,
) {
  const totalVolume = history.reduce(
    (sum, session) => sum + getSessionVolume(session, profile),
    0,
  );
  const streaks = calculateCurrentAndLongestStreak(history);

  return [
    {
      label: "Logged sessions",
      value: String(history.length),
      hint: "Completed workouts saved in this build.",
    },
    {
      label: "Current streak",
      value: `${streaks.current} days`,
      hint: `Longest streak: ${streaks.longest} days`,
    },
    {
      label: "Total volume",
      value: `${Math.round(totalVolume).toLocaleString()} ${profile.weightUnit}`,
      hint: "Completed reps x resolved load across workout history.",
    },
  ] satisfies DashboardStat[];
}

export function buildVolumeSeries(
  history: CompletedWorkoutSession[],
  profile: UserProfile,
) {
  return history
    .slice()
    .sort((a, b) => a.finishedAt.localeCompare(b.finishedAt))
    .map((session) => ({
      label: format(parseISO(session.finishedAt), "MMM d"),
      volume: Math.round(getSessionVolume(session, profile)),
    }));
}

export function buildBodyWeightTrend(bodyMetrics: BodyMetricEntry[]) {
  return bodyMetrics
    .slice()
    .sort((a, b) => a.measuredAt.localeCompare(b.measuredAt))
    .map((entry) => ({
      label: format(parseISO(entry.measuredAt), "MMM d"),
      value: entry.weight,
    }));
}

export function buildOneRmProgression(
  history: CompletedWorkoutSession[],
  exerciseSlug: string,
  profile: UserProfile,
) {
  return history
    .slice()
    .sort((a, b) => a.finishedAt.localeCompare(b.finishedAt))
    .flatMap((session) => {
      const exercise = session.exercises.find((entry) => entry.exerciseSlug === exerciseSlug);

      if (!exercise) {
        return [];
      }

      const best = exercise.sets.reduce((top, set) => {
        if (!set.completedReps) {
          return top;
        }

        const candidate = estimateOneRepMax(
          calculateEffectiveLoad(set, exercise.tag, profile.bodyWeight),
          set.completedReps,
        );

        return Math.max(top, candidate);
      }, 0);

      return [
        {
          label: format(parseISO(session.finishedAt), "MMM d"),
          value: Math.round(best),
        },
      ];
    });
}

export function buildLoggedExerciseOptions(history: CompletedWorkoutSession[]) {
  const exerciseMap = new Map<string, LoggedExerciseOption>();

  history.forEach((session) => {
    session.exercises.forEach((exercise) => {
      const current = exerciseMap.get(exercise.exerciseSlug);

      exerciseMap.set(exercise.exerciseSlug, {
        slug: exercise.exerciseSlug,
        name: exercise.exerciseName,
        sessionCount: (current?.sessionCount ?? 0) + 1,
      });
    });
  });

  return Array.from(exerciseMap.values()).sort((a, b) => {
    if (b.sessionCount !== a.sessionCount) {
      return b.sessionCount - a.sessionCount;
    }

    return a.name.localeCompare(b.name);
  });
}

export function buildFrequencyBreakdown(
  history: CompletedWorkoutSession[],
  catalog: ExerciseCatalogItem[],
) {
  const exerciseCounts = new Map<string, number>();
  const muscleCounts = new Map<string, number>();
  const splitCounts = new Map<string, number>();
  const catalogMap = buildCatalogMap(catalog);

  history.forEach((session) => {
    splitCounts.set(session.title, (splitCounts.get(session.title) ?? 0) + 1);

    session.exercises.forEach((exercise) => {
      exerciseCounts.set(
        exercise.exerciseName,
        (exerciseCounts.get(exercise.exerciseName) ?? 0) + 1,
      );

      const catalogExercise = catalogMap.get(exercise.exerciseSlug);

      catalogExercise?.primaryMuscles.forEach((muscle) => {
        muscleCounts.set(muscle, (muscleCounts.get(muscle) ?? 0) + 1);
      });
    });
  });

  return {
    exercises: Array.from(exerciseCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6),
    muscles: Array.from(muscleCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6),
    splits: Array.from(splitCounts.entries()).sort((a, b) => b[1] - a[1]),
  };
}

export function buildBodyRegionAnalytics(
  history: CompletedWorkoutSession[],
  profile: UserProfile,
  catalog: ExerciseCatalogItem[],
) {
  const catalogMap = buildCatalogMap(catalog);
  const sortedHistory = history
    .slice()
    .sort((a, b) => a.finishedAt.localeCompare(b.finishedAt));
  const totalVolumeByRegion = new Map<BodyRegionId, number>(
    bodyRegionOptions.map(({ id }) => [id, 0]),
  );
  const sessionCountByRegion = new Map<BodyRegionId, number>(
    bodyRegionOptions.map(({ id }) => [id, 0]),
  );
  const seriesByRegion = new Map<BodyRegionId, Array<{ label: string; volume: number }>>(
    bodyRegionOptions.map(({ id }) => [id, []]),
  );
  const liftsByRegion = new Map<BodyRegionId, Map<string, BodyRegionLift>>(
    bodyRegionOptions.map(({ id }) => [id, new Map()]),
  );

  sortedHistory.forEach((session) => {
    const label = format(parseISO(session.finishedAt), "MMM d");
    const sessionVolumeByRegion = new Map<BodyRegionId, number>();
    const sessionHitRegions = new Set<BodyRegionId>();

    session.exercises.forEach((exercise) => {
      const regionWeights = getExerciseRegions(exercise, catalogMap);

      if (regionWeights.length === 0) {
        return;
      }

      const exerciseVolume = exercise.sets.reduce((sum, set) => {
        if (!set.completedReps) {
          return sum;
        }

        const effectiveLoad = calculateEffectiveLoad(set, exercise.tag, profile.bodyWeight);

        return sum + effectiveLoad * set.completedReps;
      }, 0);
      const bestStats = getExerciseBestStats(exercise, profile.bodyWeight);

      regionWeights.forEach(({ id, share }) => {
        const allocatedVolume = exerciseVolume * share;
        const currentLift = liftsByRegion.get(id)?.get(exercise.exerciseSlug);

        totalVolumeByRegion.set(
          id,
          (totalVolumeByRegion.get(id) ?? 0) + allocatedVolume,
        );
        sessionVolumeByRegion.set(
          id,
          (sessionVolumeByRegion.get(id) ?? 0) + allocatedVolume,
        );
        sessionHitRegions.add(id);

        liftsByRegion.get(id)?.set(exercise.exerciseSlug, {
          slug: exercise.exerciseSlug,
          name: exercise.exerciseName,
          maxWeight: Math.max(currentLift?.maxWeight ?? 0, bestStats.maxWeight),
          bestEstimatedOneRm: Math.max(
            currentLift?.bestEstimatedOneRm ?? 0,
            bestStats.bestEstimatedOneRm,
          ),
          totalVolume: (currentLift?.totalVolume ?? 0) + allocatedVolume,
        });
      });
    });

    bodyRegionOptions.forEach(({ id }) => {
      seriesByRegion.get(id)?.push({
        label,
        volume: Math.round(sessionVolumeByRegion.get(id) ?? 0),
      });
    });

    sessionHitRegions.forEach((id) => {
      sessionCountByRegion.set(id, (sessionCountByRegion.get(id) ?? 0) + 1);
    });
  });

  const activeRegions = bodyRegionOptions.filter(
    ({ id }) => (totalVolumeByRegion.get(id) ?? 0) > 0,
  );
  const totalTrackedVolume = activeRegions.reduce(
    (sum, { id }) => sum + (totalVolumeByRegion.get(id) ?? 0),
    0,
  );
  const idealShare = activeRegions.length > 0 ? 1 / activeRegions.length : 0;

  const details = bodyRegionOptions.map(({ id, label }) => {
    const totalVolume = Math.round(totalVolumeByRegion.get(id) ?? 0);
    const shareOfTraining =
      totalTrackedVolume > 0 ? totalVolume / totalTrackedVolume : 0;
    const progressDelta = getExerciseProgressDelta(seriesByRegion.get(id) ?? []);
    const balanceScore = clamp(
      Math.round(
        100 -
          (idealShare > 0
            ? Math.abs(shareOfTraining - idealShare) / idealShare
            : 1) *
            100,
      ),
      0,
      100,
    );

    return {
      id,
      label,
      totalVolume,
      sessionCount: sessionCountByRegion.get(id) ?? 0,
      balanceScore,
      progressDelta,
      shareOfTraining,
      series: seriesByRegion.get(id) ?? [],
      lifts: Array.from(liftsByRegion.get(id)?.values() ?? [])
        .sort((a, b) => {
          if (b.maxWeight !== a.maxWeight) {
            return b.maxWeight - a.maxWeight;
          }

          return b.bestEstimatedOneRm - a.bestEstimatedOneRm;
        })
        .slice(0, 6),
    } satisfies BodyRegionDetail;
  });

  return {
    bodyRegions: bodyRegionOptions,
    summaries: details,
    details,
  };
}

export function buildPersonalRecords(
  history: CompletedWorkoutSession[],
  profile: UserProfile,
) {
  const records = new Map<
    string,
    {
      name: string;
      maxWeight: number;
      bestEstimatedOneRm: number;
    }
  >();

  history.forEach((session) => {
    session.exercises.forEach((exercise) => {
      const current = records.get(exercise.exerciseSlug) ?? {
        name: exercise.exerciseName,
        maxWeight: 0,
        bestEstimatedOneRm: 0,
      };

      exercise.sets.forEach((set) => {
        if (!set.completedReps) {
          return;
        }

        const effectiveLoad = calculateEffectiveLoad(
          set,
          exercise.tag,
          profile.bodyWeight,
        );

        current.maxWeight = Math.max(current.maxWeight, effectiveLoad);
        current.bestEstimatedOneRm = Math.max(
          current.bestEstimatedOneRm,
          estimateOneRepMax(effectiveLoad, set.completedReps),
        );
      });

      records.set(exercise.exerciseSlug, current);
    });
  });

  return Array.from(records.values())
    .sort((a, b) => b.bestEstimatedOneRm - a.bestEstimatedOneRm)
    .slice(0, 6);
}
