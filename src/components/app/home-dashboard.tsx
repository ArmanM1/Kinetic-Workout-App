"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock3, History, PlusCircle, Sparkles } from "lucide-react";

import { useWorkoutStore } from "@/components/providers/workout-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function HomeDashboard() {
  const router = useRouter();
  const {
    activeSession,
    defaultSplit,
    history,
    settings,
    catalog,
    startBlankSession,
    startSplitDaySession,
  } = useWorkoutStore();

  const favoriteExercises = catalog.filter((exercise) =>
    settings.favoriteExerciseSlugs.includes(exercise.slug),
  );

  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader className="space-y-4">
            <Badge className="w-fit border border-lime-300/20 bg-lime-300/10 text-lime-100">
              {today}
            </Badge>
            <div className="space-y-2">
              <CardTitle className="text-3xl">Move fast, lift with context.</CardTitle>
              <CardDescription className="max-w-2xl text-base text-zinc-300">
                Blank workouts stay one tap away, previous performance remains inline, and your
                current session can be resumed from anywhere.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className="bg-lime-300 text-zinc-950 hover:bg-lime-200"
              onClick={() => {
                startBlankSession();
                router.push("/app/active-workout");
              }}
            >
              <PlusCircle className="size-4" />
              Start Blank Workout
            </Button>
            {activeSession ? (
              <Button asChild size="lg" variant="outline">
                <Link href="/app/active-workout">
                  Resume Active Workout
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : null}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Active session recovery</CardTitle>
            <CardDescription className="text-zinc-300">
              One active workout lives at a time, and unfinished drafts stay available if you leave
              and come back later.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeSession ? (
              <>
                <div className="rounded-2xl border border-lime-300/20 bg-lime-300/10 p-4">
                  <p className="text-sm uppercase tracking-[0.28em] text-lime-100/70">
                    In progress
                  </p>
                  <p className="mt-2 text-xl font-semibold">{activeSession.title}</p>
                  <p className="mt-1 text-sm text-zinc-300">
                    {activeSession.exercises.length} movement
                    {activeSession.exercises.length === 1 ? "" : "s"} staged
                  </p>
                </div>
                <Button asChild className="w-full bg-white text-zinc-950 hover:bg-zinc-200">
                  <Link href="/app/active-workout">Jump back in</Link>
                </Button>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/12 p-4 text-sm text-zinc-400">
                No active workout yet. The next session you start will stay pinned here until you
                finish it.
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Default split</CardTitle>
                <CardDescription className="text-zinc-300">
                  Launch straight from your preferred split day.
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/app/splits">Browse all</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {defaultSplit ? (
              <>
                <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold">{defaultSplit.name}</p>
                      <p className="mt-1 text-sm text-zinc-400">
                        {defaultSplit.description}
                      </p>
                    </div>
                    <Badge className="border border-lime-300/20 bg-lime-300/10 text-lime-100">
                      Default
                    </Badge>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {defaultSplit.days.map((day) => (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => {
                        startSplitDaySession(defaultSplit.id, day.id);
                        router.push("/app/active-workout");
                      }}
                      className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-left transition hover:border-lime-300/25 hover:bg-lime-300/5"
                    >
                      <p className="font-medium text-white">{day.name}</p>
                      <p className="mt-1 text-sm text-zinc-400">{day.focus}</p>
                      <p className="mt-3 text-xs uppercase tracking-[0.28em] text-lime-200/70">
                        {day.exercises.length} movements
                      </p>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/12 p-4 text-sm text-zinc-400">
                Create a split to keep a launch-ready default day on the home screen.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Favorite movements</CardTitle>
            <CardDescription className="text-zinc-300">
              Quick access to the exercises you tap most on mobile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {favoriteExercises.length > 0 ? (
              favoriteExercises.slice(0, 6).map((exercise) => (
                <Link
                  key={exercise.slug}
                  href={`/app/exercises/${exercise.slug}`}
                  className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm transition hover:border-lime-300/20 hover:text-lime-100"
                >
                  <div>
                    <p className="font-medium text-white">{exercise.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.24em] text-zinc-500">
                      {exercise.anatomyLabel}
                    </p>
                  </div>
                  <Sparkles className="size-4 text-lime-300" />
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/12 p-4 text-sm text-zinc-400">
                Favorite an exercise from the workout builder or split browser to pin it here.
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Recent workouts</CardTitle>
                <CardDescription className="text-zinc-300">
                  Previous sessions stay close so the next decision is easy.
                </CardDescription>
              </div>
              <History className="size-4 text-zinc-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {history.length > 0 ? (
              history.slice(0, 4).map((session) => (
                <div
                  key={session.id}
                  className="rounded-2xl border border-white/8 bg-black/20 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{session.title}</p>
                      <p className="mt-1 text-sm text-zinc-400">
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                        }).format(new Date(session.finishedAt))}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-white/10 text-zinc-300">
                      {session.exercises.length} exercises
                    </Badge>
                  </div>
                  <Separator className="my-3 bg-white/8" />
                  <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
                    {session.exercises.map((exercise) => (
                      <Badge
                        key={exercise.id}
                        variant="outline"
                        className="border-white/10 bg-white/5 text-zinc-300"
                      >
                        {exercise.exerciseName}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/12 p-4 text-sm text-zinc-400">
                No data to show yet. Start a blank workout to create your first history snapshot.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Rest timer defaults</CardTitle>
            <CardDescription className="text-zinc-300">
              The floating rest timer auto-starts every time you log a set.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-white">Default duration</p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Adjust the timer from Settings when you want longer work sets or shorter pump
                    work.
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-lime-300/10 px-3 py-2 text-sm font-medium text-lime-100">
                  <Clock3 className="size-4" />
                  {Math.round(settings.restTimerSeconds / 60)} min
                </div>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href="/app/settings">Edit timer and profile settings</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
