import { format, parseISO } from "date-fns";

import { builtInExerciseMap } from "@/lib/data/catalog";
import { calculateEffectiveLoad, getSessionVolume } from "@/lib/domain/workout";
import type {
  BodyMetricEntry,
  CompletedWorkoutSession,
  DashboardStat,
  UserProfile,
} from "@/types/kinetic";

export function estimateOneRepMax(weight: number, reps: number) {
  if (weight <= 0 || reps <= 0) {
    return 0;
  }

  return weight * (1 + reps / 30);
}

export function calculateCurrentAndLongestStreak(
  history: CompletedWorkoutSession[],
) {
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

export function buildFrequencyBreakdown(history: CompletedWorkoutSession[]) {
  const exerciseCounts = new Map<string, number>();
  const muscleCounts = new Map<string, number>();
  const splitCounts = new Map<string, number>();

  history.forEach((session) => {
    splitCounts.set(session.title, (splitCounts.get(session.title) ?? 0) + 1);

    session.exercises.forEach((exercise) => {
      exerciseCounts.set(
        exercise.exerciseName,
        (exerciseCounts.get(exercise.exerciseName) ?? 0) + 1,
      );

      const catalogExercise = builtInExerciseMap.get(exercise.exerciseSlug);

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
