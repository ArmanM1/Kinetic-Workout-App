"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Heart,
  PauseCircle,
  PlayCircle,
  PlusCircle,
  Search,
  Trash2,
} from "lucide-react";

import { useWorkoutStore } from "@/components/providers/workout-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { searchExercises } from "@/lib/data/catalog";

function parseNumericInput(value: string) {
  if (value.trim() === "") {
    return null;
  }

  const numeric = Number(value);

  return Number.isNaN(numeric) ? null : numeric;
}

export function ActiveWorkoutClient() {
  const router = useRouter();
  const {
    activeSession,
    catalog,
    history,
    profile,
    settings,
    addExercise,
    addSet,
    clearActiveSession,
    deleteSet,
    finishActiveSession,
    logFocusedSet,
    moveExercise,
    selectSet,
    startBlankSession,
    toggleFavorite,
    updateDraft,
  } = useWorkoutStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showLibrary, setShowLibrary] = useState(false);
  const [finishNotes, setFinishNotes] = useState("");
  const [restNow, setRestNow] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRestNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const filteredExercises = searchExercises(
    catalog.filter(
      (exercise) => !settings.archivedExerciseSlugs.includes(exercise.slug),
    ),
    searchQuery,
    {
      source: "all",
    },
  ).slice(0, 10);

  if (!activeSession) {
    return (
      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Ready for a fast log?</CardTitle>
            <CardDescription className="text-zinc-300">
              Blank workouts jump you straight into the active session builder, and split launches
              preload the movements you already care about.
            </CardDescription>
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
            <Button asChild variant="outline" size="lg">
              <Link href="/app/splits">Start From Split Day</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>No active workout yet</CardTitle>
            <CardDescription className="text-zinc-300">
              Once you begin a workout, this screen becomes your live session with active-set
              highlighting, rest timing, and previous-value defaults.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const activeExercise =
    activeSession.exercises.find((exercise) => exercise.id === activeSession.activeExerciseId) ??
    null;
  const activeSet =
    activeExercise?.sets.find((set) => set.id === activeSession.activeSetId) ?? null;
  const activeSetHasValues = Boolean(
    activeSet &&
      (activeSet.draftWeight != null ||
        activeSet.draftReps != null ||
        activeSet.previousWeight != null ||
        activeSet.previousReps != null),
  );
  const restSecondsRemaining = activeSession.restTimerEndsAt
    ? Math.max(
        0,
        Math.ceil(
          (new Date(activeSession.restTimerEndsAt).getTime() - restNow) / 1000,
        ),
      )
    : 0;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Badge className="border border-lime-300/20 bg-lime-300/10 text-lime-100">
                  {activeSession.entryPoint === "blank" ? "Blank workout" : "Split day launch"}
                </Badge>
                <CardTitle className="mt-3 text-3xl">{activeSession.title}</CardTitle>
                <CardDescription className="mt-2 text-zinc-300">
                  Started{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  }).format(new Date(activeSession.startedAt))}
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowLibrary((current) => !current)}
                >
                  <Search className="size-4" />
                  {activeSession.exercises.length === 0 ? "Add First Movement" : "Add Movement"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    clearActiveSession();
                    setFinishNotes("");
                  }}
                >
                  <PauseCircle className="size-4" />
                  Clear Session
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Floating rest timer</CardTitle>
            <CardDescription className="text-zinc-300">
              Logging the highlighted set auto-starts the timer. It keeps running while you bounce
              between sections.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-3xl border border-lime-300/15 bg-lime-300/10 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-lime-100/70">Time until go</p>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-4xl font-semibold">
                  {Math.floor(restSecondsRemaining / 60)
                    .toString()
                    .padStart(2, "0")}
                </span>
                <span className="pb-1 text-4xl font-semibold">:</span>
                <span className="text-4xl font-semibold">
                  {(restSecondsRemaining % 60).toString().padStart(2, "0")}
                </span>
              </div>
              <p className="mt-3 text-sm text-zinc-200/80">
                {restSecondsRemaining > 0
                  ? "Timer is running from the last completed set."
                  : "Ready when you are. Logging a set will restart the timer."}
              </p>
            </div>
            {profile.bodyWeight == null &&
            activeSession.exercises.some((exercise) => exercise.tag === "assisted") ? (
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-100">
                Assisted exercise analytics need body weight to calculate effective load correctly.
              </div>
            ) : null}
          </CardContent>
        </Card>
      </section>

      {showLibrary ? (
        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Exercise library</CardTitle>
            <CardDescription className="text-zinc-300">
              Search built-in and custom exercises by name, equipment, or muscle group.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-12 border-white/10 bg-black/20 pl-11 text-white placeholder:text-zinc-500"
                placeholder="Search incline dumbbell press, machine chest press, assisted pull-up..."
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredExercises.map((exercise) => (
                <button
                  key={exercise.slug}
                  type="button"
                  onClick={() => {
                    addExercise(exercise.slug);
                    setSearchQuery("");
                    setShowLibrary(false);
                  }}
                  className="rounded-2xl border border-white/8 bg-black/20 p-4 text-left transition hover:border-lime-300/25 hover:bg-lime-300/5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{exercise.name}</p>
                      <p className="mt-1 text-sm text-zinc-400">{exercise.anatomyLabel}</p>
                    </div>
                    <Badge variant="outline" className="border-white/10 text-zinc-300">
                      {exercise.source}
                    </Badge>
                  </div>
                  <p className="mt-3 text-xs uppercase tracking-[0.24em] text-zinc-500">
                    {exercise.equipment ?? "bodyweight"} • {exercise.category ?? "general"}
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {activeSession.exercises.length === 0 ? (
        <Card className="border-dashed border-white/12 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Add your first movement</CardTitle>
            <CardDescription className="text-zinc-300">
              Search the library to create a fast draft with three default sets and previous values
              preloaded when Kinetic has history for the movement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              size="lg"
              className="bg-lime-300 text-zinc-950 hover:bg-lime-200"
              onClick={() => setShowLibrary(true)}
            >
              <PlusCircle className="size-4" />
              Add First Movement
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="space-y-4">
        {activeSession.exercises.map((exercise, exerciseIndex) => {
          const previousSession = history.find((session) =>
            session.exercises.some((entry) => entry.exerciseSlug === exercise.exerciseSlug),
          );

          return (
            <Card key={exercise.id} className="border-white/10 bg-white/5 text-white">
              <CardHeader className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle>{exercise.exerciseName}</CardTitle>
                      <Badge
                        variant="outline"
                        className="border-white/10 bg-white/5 text-zinc-300"
                      >
                        {exercise.tag.replace("_", " ")}
                      </Badge>
                    </div>
                    <CardDescription className="mt-2 text-zinc-300">
                      {exercise.notes || "No movement note yet."}
                    </CardDescription>
                    {previousSession ? (
                      <p className="mt-2 text-xs uppercase tracking-[0.24em] text-lime-200/75">
                        Last used in {previousSession.title}
                      </p>
                    ) : (
                      <p className="mt-2 text-xs uppercase tracking-[0.24em] text-zinc-500">
                        New movement for this account
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="icon-sm"
                      variant="outline"
                      onClick={() => toggleFavorite(exercise.exerciseSlug)}
                    >
                      <Heart
                        className={
                          settings.favoriteExerciseSlugs.includes(exercise.exerciseSlug)
                            ? "size-4 fill-current text-lime-300"
                            : "size-4"
                        }
                      />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="outline"
                      disabled={exerciseIndex === 0}
                      onClick={() => moveExercise(exerciseIndex, exerciseIndex - 1)}
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="outline"
                      disabled={exerciseIndex === activeSession.exercises.length - 1}
                      onClick={() => moveExercise(exerciseIndex, exerciseIndex + 1)}
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {exercise.sets.map((set, setIndex) => {
                  const isActive = set.id === activeSession.activeSetId;
                  const previousText =
                    set.previousWeight != null || set.previousReps != null
                      ? `${set.previousWeight ?? "-"} ${profile.weightUnit} x ${set.previousReps ?? "-"}`
                      : "No history";

                  return (
                    <div
                      key={set.id}
                      className={`rounded-2xl border p-3 transition ${
                        isActive
                          ? "border-lime-300/40 bg-lime-300/10"
                          : "border-white/8 bg-black/20"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <button
                          type="button"
                          className="text-left"
                          onClick={() => selectSet(exercise.id, set.id)}
                        >
                          <p className="font-medium text-white">Set {setIndex + 1}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.24em] text-zinc-500">
                            Previous {previousText}
                          </p>
                        </button>
                        <div className="flex items-center gap-2">
                          {set.completedAt ? (
                            <Badge className="border border-lime-300/20 bg-lime-300/10 text-lime-100">
                              Logged
                            </Badge>
                          ) : isActive ? (
                            <Badge className="border border-white/10 bg-white/10 text-white">
                              Active
                            </Badge>
                          ) : null}
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => deleteSet(exercise.id, set.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        <Input
                          value={set.draftWeight ?? ""}
                          onChange={(event) =>
                            updateDraft(exercise.id, set.id, {
                              draftWeight: parseNumericInput(event.target.value),
                            })
                          }
                          className="border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
                          placeholder={`Weight (${profile.weightUnit})`}
                        />
                        <Input
                          value={set.draftReps ?? ""}
                          onChange={(event) =>
                            updateDraft(exercise.id, set.id, {
                              draftReps: parseNumericInput(event.target.value),
                            })
                          }
                          className="border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
                          placeholder="Reps"
                        />
                        {exercise.tag === "assisted" ? (
                          <Input
                            value={set.assistAmount ?? ""}
                            onChange={(event) =>
                              updateDraft(exercise.id, set.id, {
                                assistAmount: parseNumericInput(event.target.value),
                              })
                            }
                            className="border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
                            placeholder={`Assist (${profile.weightUnit})`}
                          />
                        ) : (
                          <div className="flex items-center rounded-xl border border-dashed border-white/10 px-3 text-sm text-zinc-500">
                            {set.completedAt
                              ? `${set.completedWeight ?? 0} ${profile.weightUnit} x ${set.completedReps ?? 0}`
                              : "Tap the row to make it active"}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button variant="outline" onClick={() => addSet(exercise.id)}>
                    <PlusCircle className="size-4" />
                    Add Another Set
                  </Button>
                  {exerciseIndex < activeSession.exercises.length - 1 ? (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const nextExercise = activeSession.exercises[exerciseIndex + 1];
                        const nextOpenSet =
                          nextExercise.sets.find((set) => !set.completedAt) ??
                          nextExercise.sets[nextExercise.sets.length - 1];

                        if (nextOpenSet) {
                          selectSet(nextExercise.id, nextOpenSet.id);
                        }
                      }}
                    >
                      <ArrowRight className="size-4" />
                      Move To Next Exercise
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Set controls</CardTitle>
            <CardDescription className="text-zinc-300">
              Logging the highlighted row will use edited values first, then previous values
              automatically when available.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
              <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Active target</p>
              <p className="mt-2 text-xl font-semibold">
                {activeExercise ? activeExercise.exerciseName : "No set selected"}
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                {activeSet ? `Set ${activeSet.setNumber}` : "Choose a set row to make it active."}
              </p>
            </div>
            <Button
              size="lg"
              className="w-full bg-lime-300 text-zinc-950 hover:bg-lime-200 disabled:bg-zinc-800 disabled:text-zinc-500"
              disabled={!activeSetHasValues}
              onClick={() => logFocusedSet()}
            >
              <PlayCircle className="size-4" />
              Log Set
            </Button>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Finish workout</CardTitle>
            <CardDescription className="text-zinc-300">
              Unfinished sets will be ignored. Notes stay attached to the completed summary.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={finishNotes}
              onChange={(event) => setFinishNotes(event.target.value)}
              className="min-h-28 border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
              placeholder="Optional notes about the session, recovery, or what to change next time."
            />
            <Button
              size="lg"
              className="w-full bg-white text-zinc-950 hover:bg-zinc-200"
              onClick={() => {
                finishActiveSession(finishNotes);
                setFinishNotes("");
                router.push("/app");
              }}
            >
              Finish Workout
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
