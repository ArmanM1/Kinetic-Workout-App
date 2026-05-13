"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  Dumbbell,
  Flame,
  Medal,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";

import { useWorkoutStore } from "@/components/providers/workout-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { calculateEffectiveLoad, getSessionVolume } from "@/lib/domain/workout";
import { estimateOneRepMax } from "@/lib/domain/analytics";
import type { CompletedWorkoutSession, SessionExercise } from "@/types/kinetic";
import { cn } from "@/lib/utils";

function formatNumber(value: number) {
  return Math.round(value).toLocaleString();
}

function getCompletedSetCount(session: CompletedWorkoutSession) {
  return session.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);
}

function getExerciseVolume(
  exercise: SessionExercise,
  bodyWeight: number | null,
) {
  return exercise.sets.reduce((sum, set) => {
    const reps = set.completedReps ?? 0;

    return sum + calculateEffectiveLoad(set, exercise.tag, bodyWeight) * reps;
  }, 0);
}

function getBestEstimatedOneRepMax(
  exercise: SessionExercise,
  bodyWeight: number | null,
) {
  return exercise.sets.reduce((best, set) => {
    if (!set.completedReps) {
      return best;
    }

    return Math.max(
      best,
      estimateOneRepMax(
        calculateEffectiveLoad(set, exercise.tag, bodyWeight),
        set.completedReps,
      ),
    );
  }, 0);
}

function getPreviousExerciseBest(
  history: CompletedWorkoutSession[],
  session: CompletedWorkoutSession,
  exerciseSlug: string,
  bodyWeight: number | null,
) {
  const previousExercise = history
    .filter((entry) => entry.finishedAt < session.finishedAt)
    .sort((a, b) => b.finishedAt.localeCompare(a.finishedAt))
    .flatMap((entry) => entry.exercises)
    .find((exercise) => exercise.exerciseSlug === exerciseSlug);

  return previousExercise ? getBestEstimatedOneRepMax(previousExercise, bodyWeight) : 0;
}

export function WorkoutSummaryClient({ sessionId }: { sessionId: string }) {
  const { history, profile } = useWorkoutStore();
  const session = history.find((entry) => entry.id === sessionId) ?? null;

  if (!session) {
    return (
      <div className="ios-page space-y-4 pb-28">
        <Card className="ios-card border-white/10 bg-white/[0.04] text-white">
          <CardContent className="space-y-4 p-5">
            <Badge className="border border-amber-300/20 bg-amber-300/10 text-amber-100">
              Summary loading
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight">Workout summary not found</h1>
            <p className="text-sm leading-6 text-zinc-400">
              The workout may still be syncing. Return home and reopen analytics once the session appears in your history.
            </p>
            <Button asChild className="bg-lime-300 text-zinc-950 hover:bg-lime-200">
              <Link href="/app">Back to dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalVolume = getSessionVolume(session, profile);
  const completedSets = getCompletedSetCount(session);
  const previousSameTitle = history
    .filter((entry) => entry.id !== session.id && entry.title === session.title)
    .sort((a, b) => b.finishedAt.localeCompare(a.finishedAt))[0];
  const previousVolume = previousSameTitle ? getSessionVolume(previousSameTitle, profile) : 0;
  const volumeDelta = previousVolume > 0 ? (totalVolume - previousVolume) / previousVolume : null;
  const totalReps = session.exercises.reduce(
    (sum, exercise) =>
      sum + exercise.sets.reduce((setSum, set) => setSum + (set.completedReps ?? 0), 0),
    0,
  );
  const exerciseSummaries = session.exercises
    .map((exercise) => {
      const volume = getExerciseVolume(exercise, profile.bodyWeight);
      const bestOneRm = getBestEstimatedOneRepMax(exercise, profile.bodyWeight);
      const previousBest = getPreviousExerciseBest(
        history,
        session,
        exercise.exerciseSlug,
        profile.bodyWeight,
      );
      const isProgress = previousBest > 0 && bestOneRm > previousBest;

      return {
        id: exercise.id,
        name: exercise.exerciseName,
        sets: exercise.sets.length,
        volume,
        bestOneRm,
        previousBest,
        isProgress,
      };
    })
    .sort((a, b) => b.volume - a.volume);
  const topExerciseVolume = Math.max(...exerciseSummaries.map((exercise) => exercise.volume), 1);
  const progressCount = exerciseSummaries.filter((exercise) => exercise.isProgress).length;
  const topExercise = exerciseSummaries[0] ?? null;
  const workoutMinutes = Math.max(
    1,
    Math.round(
      (new Date(session.finishedAt).getTime() - new Date(session.startedAt).getTime()) /
        60000,
    ),
  );
  const volumePerMinute = totalVolume / workoutMinutes;
  const celebrationLine =
    progressCount > 0
      ? `${progressCount} progress signal${progressCount === 1 ? "" : "s"} unlocked.`
      : totalVolume > 0
        ? "New baseline banked. Future you has a target."
        : "Workout saved. Next one starts stronger.";
  const finishedTime = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(session.finishedAt));

  return (
    <div className="ios-page space-y-4 pb-28 text-white">
      <section className="ios-card relative overflow-hidden rounded-[2rem] border border-lime-300/20 bg-[radial-gradient(circle_at_top_left,rgba(196,255,57,0.24),transparent_34%),linear-gradient(135deg,rgba(24,24,27,0.98),rgba(9,9,11,0.98))] p-5">
        <div className="absolute -right-12 -top-12 size-40 rounded-full bg-lime-300/10 blur-3xl" />
        <div className="relative space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge className="border border-lime-300/30 bg-lime-300/15 text-lime-100">
                <Trophy className="size-3.5" />
                Workout complete
              </Badge>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight">{session.title}</h1>
              <p className="mt-2 text-sm text-zinc-400">Finished {finishedTime}</p>
              <p className="mt-3 max-w-[16rem] text-sm leading-6 text-lime-100/80">
                {celebrationLine}
              </p>
            </div>
            <div className="flex size-14 shrink-0 items-center justify-center rounded-[1.4rem] bg-lime-300 text-zinc-950 shadow-[0_0_45px_rgba(196,255,57,0.35)]">
              <CheckCircle2 className="size-7" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-lime-200/70">Volume</p>
              <p className="mt-2 text-3xl font-semibold">{formatNumber(totalVolume)}</p>
              <p className="text-xs text-zinc-500">{profile.weightUnit} lifted</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-lime-200/70">Work</p>
              <p className="mt-2 text-3xl font-semibold">{completedSets}</p>
              <p className="text-xs text-zinc-500">sets / {totalReps} reps</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-[1.25rem] border border-lime-300/15 bg-lime-300/10 p-3">
              <p className="text-[0.62rem] uppercase tracking-[0.2em] text-lime-100/70">Time</p>
              <p className="mt-1 text-xl font-semibold">{workoutMinutes}m</p>
            </div>
            <div className="rounded-[1.25rem] border border-cyan-300/15 bg-cyan-300/10 p-3">
              <p className="text-[0.62rem] uppercase tracking-[0.2em] text-cyan-100/70">Pace</p>
              <p className="mt-1 text-xl font-semibold">{formatNumber(volumePerMinute)}</p>
            </div>
            <div className="rounded-[1.25rem] border border-fuchsia-300/15 bg-fuchsia-300/10 p-3">
              <p className="text-[0.62rem] uppercase tracking-[0.2em] text-fuchsia-100/70">PRs</p>
              <p className="mt-1 text-xl font-semibold">{progressCount}</p>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-lime-300/15 text-lime-200">
                <Flame className="size-5" />
              </div>
              <div>
                <p className="font-semibold">
                  {volumeDelta == null
                    ? "First saved data point for this workout name."
                    : volumeDelta >= 0
                      ? `${Math.round(volumeDelta * 100)}% more volume than last ${session.title}.`
                      : `${Math.abs(Math.round(volumeDelta * 100))}% lighter than last ${session.title}.`}
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  {progressCount > 0
                    ? `${progressCount} exercise${progressCount === 1 ? "" : "s"} beat prior estimated 1RM data.`
                    : "Log this workout again to unlock richer progress callouts."}
                </p>
              </div>
            </div>
          </div>

          {topExercise ? (
            <div className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-cyan-300/15 text-cyan-100">
                  <Target className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[0.68rem] uppercase tracking-[0.24em] text-cyan-100/70">Top lift</p>
                  <p className="truncate font-semibold">{topExercise.name}</p>
                  <p className="mt-1 text-sm text-zinc-400">
                    {formatNumber(topExercise.volume)} {profile.weightUnit} total volume
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="ios-card rounded-[2rem] border border-white/8 bg-white/[0.04] p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-lime-200/70">Exercise breakdown</p>
            <h2 className="mt-1 text-2xl font-semibold">Victory breakdown</h2>
          </div>
          <Dumbbell className="size-6 text-lime-300" />
        </div>

        <div className="mt-5 space-y-3">
          {exerciseSummaries.map((exercise, index) => (
            <div
              key={exercise.id}
              className="rounded-[1.5rem] border border-white/8 bg-black/25 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-xl bg-white/[0.06] text-xs text-zinc-400">
                      {index + 1}
                    </span>
                    <p className="truncate font-semibold">{exercise.name}</p>
                  </div>
                  <p className="mt-2 text-sm text-zinc-500">
                    {exercise.sets} sets / {formatNumber(exercise.volume)} {profile.weightUnit}
                  </p>
                </div>
                {exercise.isProgress ? (
                  <Badge className="shrink-0 border border-lime-300/30 bg-lime-300/15 text-lime-100">
                    <ArrowUpRight className="size-3.5" />
                    Progress
                  </Badge>
                ) : null}
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className={cn(
                    "h-full rounded-full",
                    exercise.isProgress
                      ? "bg-lime-300 shadow-[0_0_20px_rgba(196,255,57,0.5)]"
                      : "bg-cyan-300/70",
                  )}
                  style={{ width: `${Math.max(8, (exercise.volume / topExerciseVolume) * 100)}%` }}
                />
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.22em] text-zinc-500">
                Best est. 1RM {formatNumber(exercise.bestOneRm)} {profile.weightUnit}
                {exercise.previousBest > 0
                  ? ` / previous ${formatNumber(exercise.previousBest)} ${profile.weightUnit}`
                  : " / new baseline"}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="ios-card rounded-[2rem] border border-white/8 bg-white/[0.04] p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-cyan-300/12 text-cyan-200">
            <Medal className="size-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Locked in. Go be proud.</h2>
            <p className="text-sm text-zinc-500">
              Your summary is saved to history and will sync through Supabase for this account.
            </p>
          </div>
        </div>
        {session.notes ? (
          <p className="mt-4 rounded-[1.25rem] border border-white/8 bg-black/20 p-4 text-sm leading-6 text-zinc-300">
            {session.notes}
          </p>
        ) : null}
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Button asChild className="bg-lime-300 text-zinc-950 hover:bg-lime-200">
            <Link href="/app/active-workout">
              <Sparkles className="size-4" />
              Start next workout
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/app/analytics">View analytics</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
