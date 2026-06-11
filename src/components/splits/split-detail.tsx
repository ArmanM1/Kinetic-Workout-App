"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";

import { useWorkoutStore } from "@/components/providers/workout-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSessionReplacementGuard } from "@/components/workout/use-session-replacement-guard";
import { findSplitBySlug } from "@/lib/splits";

export function SplitDetail({ slug }: { slug: string }) {
  const router = useRouter();
  const { splits, startSplitDaySession } = useWorkoutStore();
  const { runOrConfirm, dialog } = useSessionReplacementGuard();
  const split = findSplitBySlug(splits, slug);

  if (!split) {
    return (
      <div className="space-y-4">
        <Button asChild variant="ghost" className="w-fit">
          <Link href="/app/splits">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <Card className="border-white/10 bg-white/[0.04] text-white">
          <CardContent className="space-y-2 p-5">
            <p className="text-2xl font-semibold">Split not found</p>
            <p className="text-sm text-zinc-400">
              This routine does not exist in the current library.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-6">
      {dialog}

      <Button asChild variant="ghost" className="w-fit">
        <Link href="/app/splits">
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </Button>

      <section className="space-y-3 rounded-[2rem] border border-white/8 bg-white/[0.04] p-5 text-white">
        <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
          {split.days.length} day{split.days.length === 1 ? "" : "s"} ready
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">{split.name}</h1>
        <p className="text-sm text-zinc-400">{split.description}</p>
      </section>

      <div className="space-y-3">
        {split.days.map((day) => (
          <Card key={day.id} className="border-white/8 bg-white/[0.04] text-white">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                    {day.focus}
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{day.name}</p>
                  <p className="mt-2 text-sm text-zinc-400">
                    {day.exercises.length} exercise{day.exercises.length === 1 ? "" : "s"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    runOrConfirm(() => {
                      startSplitDaySession(split.id, day.id);
                      router.push("/app/active-workout");
                    }, day.name)
                  }
                  className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-lime-300 text-zinc-950 transition hover:bg-lime-200"
                >
                  <Play className="size-5 fill-current" />
                  <span className="sr-only">Start {day.name}</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {day.exercises.map((exercise) => (
                  <span
                    key={exercise.id}
                    className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-sm text-zinc-300"
                  >
                    {exercise.exerciseSlug.replace(/-/g, " ")}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  runOrConfirm(() => {
                    startSplitDaySession(split.id, day.id);
                    router.push("/app/active-workout");
                  }, day.name)
                }
                className="flex items-center gap-2 text-sm font-medium text-lime-200 transition hover:text-lime-100"
              >
                Start {day.name}
                <ArrowRight className="size-4" />
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
