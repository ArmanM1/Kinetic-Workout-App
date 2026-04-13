"use client";

import { useWorkoutStore } from "@/components/providers/workout-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildPersonalRecords } from "@/lib/domain/analytics";

export function ExerciseDetail({ slug }: { slug: string }) {
  const { catalog, history, profile } = useWorkoutStore();
  const exercise = catalog.find((entry) => entry.slug === slug) ?? null;

  if (!exercise) {
    return (
      <Card className="border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle>Exercise not found</CardTitle>
          <CardDescription className="text-zinc-300">
            The requested exercise is not in the current catalog or custom library.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const usage = history.filter((session) =>
    session.exercises.some((entry) => entry.exerciseSlug === slug),
  );
  const prs = buildPersonalRecords(history, profile).find((record) => record.name === exercise.name);

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/5 text-white">
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border border-lime-300/20 bg-lime-300/10 text-lime-100">
              {exercise.source}
            </Badge>
            <Badge variant="outline" className="border-white/10 text-zinc-300">
              {exercise.anatomyLabel}
            </Badge>
          </div>
          <div>
            <CardTitle className="text-3xl">{exercise.name}</CardTitle>
            <CardDescription className="mt-2 text-zinc-300">
              {exercise.mechanic ?? "Flexible"} • {exercise.level ?? "all levels"} •{" "}
              {exercise.equipment ?? "bodyweight"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {exercise.primaryMuscles.map((muscle) => (
              <Badge key={muscle} variant="outline" className="border-white/10 bg-white/5 text-zinc-300">
                {muscle}
              </Badge>
            ))}
          </div>
          <ol className="space-y-3 text-sm leading-7 text-zinc-300">
            {exercise.instructions.slice(0, 5).map((step, index) => (
              <li key={`${exercise.slug}-${index}`} className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <span className="font-medium text-white">{index + 1}.</span> {step}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Usage snapshot</CardTitle>
            <CardDescription className="text-zinc-300">
              History, frequency, and PRs for the selected movement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-zinc-300">
            <p>Logged sessions: <span className="text-white">{usage.length}</span></p>
            <p>
              Max weight:{" "}
              <span className="text-white">
                {prs ? Math.round(prs.maxWeight) : 0} {profile.weightUnit}
              </span>
            </p>
            <p>
              Best estimated 1RM:{" "}
              <span className="text-white">
                {prs ? Math.round(prs.bestEstimatedOneRm) : 0} {profile.weightUnit}
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>History</CardTitle>
            <CardDescription className="text-zinc-300">
              Previous sessions for this movement, newest first.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {usage.length > 0 ? (
              usage.map((session) => (
                <div key={session.id} className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <p className="font-medium text-white">{session.title}</p>
                  <p className="mt-1 text-sm text-zinc-400">
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                    }).format(new Date(session.finishedAt))}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/12 p-4 text-sm text-zinc-400">
                No history for this movement yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
