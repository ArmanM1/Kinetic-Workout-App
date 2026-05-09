"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { ChevronRight, Clock3, FolderHeart, Plus, Search, Sparkles, Star } from "lucide-react";

import { useWorkoutStore } from "@/components/providers/workout-provider";
import { CustomExerciseDialog } from "@/components/exercises/custom-exercise-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchExercises } from "@/lib/data/catalog";
import { cn } from "@/lib/utils";
import type { ExerciseCatalogItem } from "@/types/kinetic";

const muscleGroups = [
  { id: "all", label: "All" },
  { id: "chest", label: "Chest" },
  { id: "back", label: "Back" },
  { id: "shoulders", label: "Shoulders" },
  { id: "biceps", label: "Biceps" },
  { id: "triceps", label: "Triceps" },
  { id: "quads", label: "Quads" },
  { id: "hamstrings", label: "Hamstrings" },
  { id: "glutes", label: "Glutes" },
  { id: "core", label: "Core" },
] as const;

const sortModes = [
  { id: "alpha", label: "A-Z" },
  { id: "favorites", label: "Favorites" },
  { id: "recent", label: "Recent" },
] as const;

function matchesMuscleGroup(exercise: ExerciseCatalogItem, selectedGroup: string) {
  if (selectedGroup === "all") {
    return true;
  }

  const muscles = [
    exercise.anatomyLabel,
    ...exercise.primaryMuscles,
    ...exercise.secondaryMuscles,
  ]
    .filter(Boolean)
    .map((muscle) => muscle.toLowerCase());

  const muscleAliases: Record<string, string[]> = {
    chest: ["chest", "pectorals"],
    back: ["back", "lats", "middle back", "lower back", "traps"],
    shoulders: ["shoulders", "delts", "front deltoid", "side deltoid", "rear deltoid"],
    biceps: ["biceps"],
    triceps: ["triceps"],
    quads: ["quads", "quadriceps"],
    hamstrings: ["hamstrings"],
    glutes: ["glutes", "gluteus"],
    core: ["abs", "abdominals", "core", "obliques", "lower back"],
  };

  return (muscleAliases[selectedGroup] ?? [selectedGroup]).some((alias) =>
    muscles.some((muscle) => muscle.includes(alias)),
  );
}

export function ExerciseBrowser() {
  const {
    catalog,
    recentExerciseSlugs,
    settings,
    toggleFavorite,
  } = useWorkoutStore();
  const [query, setQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<(typeof muscleGroups)[number]["id"]>("all");
  const [sortMode, setSortMode] = useState<(typeof sortModes)[number]["id"]>("alpha");
  const deferredQuery = useDeferredValue(query);

  const favorites = settings.favoriteExerciseSlugs;
  const archived = settings.archivedExerciseSlugs;
  const customExercises = catalog.filter((exercise) => exercise.source === "custom").length;

  const exercises = searchExercises(
    catalog.filter((exercise) => !archived.includes(exercise.slug)),
    deferredQuery,
  ).filter((exercise) => matchesMuscleGroup(exercise, selectedGroup));

  const sortedExercises = [...exercises].sort((left, right) => {
    if (sortMode === "favorites") {
      const favoriteScore =
        Number(favorites.includes(right.slug)) - Number(favorites.includes(left.slug));

      if (favoriteScore !== 0) {
        return favoriteScore;
      }
    }

    if (sortMode === "recent") {
      const leftIndex = recentExerciseSlugs.indexOf(left.slug);
      const rightIndex = recentExerciseSlugs.indexOf(right.slug);
      const normalizedLeft = leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex;
      const normalizedRight = rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex;

      if (normalizedLeft !== normalizedRight) {
        return normalizedLeft - normalizedRight;
      }
    }

    return left.name.localeCompare(right.name);
  });

  const groupedExercises = sortedExercises.reduce<Record<string, ExerciseCatalogItem[]>>(
    (groups, exercise) => {
      const key = exercise.name.charAt(0).toUpperCase();

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(exercise);
      return groups;
    },
    {},
  );

  return (
    <div className="ios-page space-y-5">
      <section className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-white">Exercises</h1>
          <p className="mt-1 text-sm text-zinc-500">Find it fast, favorite it, and move on.</p>
        </div>
        <CustomExerciseDialog
          onCreated={({ name }) => setQuery(name)}
          trigger={
            <Button
              size="icon-lg"
              className="lift-tap rounded-2xl bg-lime-300 text-zinc-950 hover:bg-lime-200"
            >
              <Plus className="size-5" />
              <span className="sr-only">Create exercise</span>
            </Button>
          }
        />
      </section>

      <section className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => {
              setSortMode("favorites");
              setSelectedGroup("all");
            }}
            className={cn(
              "lift-tap ios-card rounded-[1.6rem] p-4 text-left transition",
              sortMode === "favorites" && "border-lime-300/30 bg-lime-300/10",
            )}
          >
            <FolderHeart className="size-5 text-lime-300" />
            <p className="mt-5 text-sm font-medium text-white">Favorites</p>
            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-zinc-500">
              {favorites.length} saved
            </p>
          </button>
          <button
            type="button"
            onClick={() => {
              setSortMode("recent");
              setSelectedGroup("all");
            }}
            className={cn(
              "lift-tap ios-card rounded-[1.6rem] p-4 text-left transition",
              sortMode === "recent" && "border-sky-300/30 bg-sky-300/10",
            )}
          >
            <Clock3 className="size-5 text-sky-300" />
            <p className="mt-5 text-sm font-medium text-white">Recent</p>
            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-zinc-500">
              {recentExerciseSlugs.length} used
            </p>
          </button>
          <CustomExerciseDialog
            onCreated={({ name }) => setQuery(name)}
            trigger={
              <button
                type="button"
                className="lift-tap ios-card rounded-[1.6rem] p-4 text-left transition"
              >
                <Sparkles className="size-5 text-cyan-300" />
                <p className="mt-5 text-sm font-medium text-white">Custom</p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-zinc-500">
                  {customExercises} built
                </p>
              </button>
            }
          />
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <Input
            type="search"
            aria-label="Search exercises"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search exercises..."
            className="h-12 rounded-2xl border-white/8 bg-white/[0.03] pl-11 text-white placeholder:text-zinc-500"
          />
        </div>

        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {muscleGroups.map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() => setSelectedGroup(group.id)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
                selectedGroup === group.id
                  ? "bg-lime-300 text-zinc-950"
                  : "bg-white/[0.06] text-zinc-400 hover:bg-white/[0.1] hover:text-white",
              )}
            >
              {group.label}
            </button>
          ))}
        </div>

        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {sortModes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setSortMode(mode.id)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.22em] transition",
                sortMode === mode.id
                  ? "border-lime-300/30 bg-lime-300/10 text-lime-200"
                  : "border-white/8 bg-transparent text-zinc-500 hover:text-white",
              )}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <p className="px-1 text-sm text-zinc-500">
          {sortedExercises.length} exercise{sortedExercises.length === 1 ? "" : "s"}
        </p>
      </section>

      {sortMode === "alpha" ? (
        <div className="ios-stagger space-y-5">
          {Object.entries(groupedExercises).map(([letter, group]) => (
            <section key={letter} className="space-y-3">
              <p className="px-1 text-sm font-medium text-zinc-500">{letter}</p>
              <div className="ios-card overflow-hidden rounded-[1.75rem] border border-white/8 bg-white/[0.03]">
                {group.map((exercise, index) => {
                  const favorite = favorites.includes(exercise.slug);

                  return (
                    <div
                      key={exercise.slug}
                      className={cn(
                        "flex items-center gap-3 px-4 py-4",
                        index !== group.length - 1 && "border-b border-white/6",
                      )}
                    >
                      <Link href={`/app/exercises/${exercise.slug}`} className="min-w-0 flex-1">
                        <p className="truncate text-lg font-medium text-white">{exercise.name}</p>
                        <p className="mt-1 truncate text-sm text-zinc-400">
                          {exercise.anatomyLabel} / {exercise.equipment ?? "Bodyweight"}
                        </p>
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(exercise.slug)}
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-full transition",
                          favorite
                            ? "bg-lime-300/12 text-lime-300"
                            : "text-zinc-500 hover:bg-white/[0.05] hover:text-white",
                        )}
                      >
                        <Star className={cn("size-4", favorite && "fill-current")} />
                        <span className="sr-only">
                          {favorite ? "Remove favorite" : "Add favorite"}
                        </span>
                      </button>
                      <Link
                        href={`/app/exercises/${exercise.slug}`}
                        className="flex size-9 shrink-0 items-center justify-center rounded-full text-zinc-500 transition hover:bg-white/[0.05] hover:text-white"
                      >
                        <ChevronRight className="size-4" />
                        <span className="sr-only">Open exercise</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="ios-card overflow-hidden rounded-[1.75rem] border border-white/8 bg-white/[0.03]">
          {sortedExercises.map((exercise, index) => {
            const favorite = favorites.includes(exercise.slug);

            return (
              <div
                key={exercise.slug}
                className={cn(
                  "flex items-center gap-3 px-4 py-4",
                  index !== sortedExercises.length - 1 && "border-b border-white/6",
                )}
              >
                <Link href={`/app/exercises/${exercise.slug}`} className="min-w-0 flex-1">
                  <p className="truncate text-lg font-medium text-white">{exercise.name}</p>
                  <p className="mt-1 truncate text-sm text-zinc-400">
                    {exercise.anatomyLabel} / {exercise.equipment ?? "Bodyweight"}
                  </p>
                </Link>
                <button
                  type="button"
                  onClick={() => toggleFavorite(exercise.slug)}
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full transition",
                    favorite
                      ? "bg-lime-300/12 text-lime-300"
                      : "text-zinc-500 hover:bg-white/[0.05] hover:text-white",
                  )}
                >
                  <Star className={cn("size-4", favorite && "fill-current")} />
                  <span className="sr-only">
                    {favorite ? "Remove favorite" : "Add favorite"}
                  </span>
                </button>
                <Link
                  href={`/app/exercises/${exercise.slug}`}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-zinc-500 transition hover:bg-white/[0.05] hover:text-white"
                >
                  <ChevronRight className="size-4" />
                  <span className="sr-only">Open exercise</span>
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {sortedExercises.length === 0 ? (
        <div className="ios-card rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-center text-sm text-zinc-400">
          No exercises match that search yet.
        </div>
      ) : null}
    </div>
  );
}
