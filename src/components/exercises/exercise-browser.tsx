"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { ChevronRight, Plus, Search, Star } from "lucide-react";

import { useWorkoutStore } from "@/components/providers/workout-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    createCustomExercise,
  } = useWorkoutStore();
  const [query, setQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<(typeof muscleGroups)[number]["id"]>("all");
  const [sortMode, setSortMode] = useState<(typeof sortModes)[number]["id"]>("alpha");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customEquipment, setCustomEquipment] = useState("");
  const [customPrimaryMuscles, setCustomPrimaryMuscles] = useState("");
  const deferredQuery = useDeferredValue(query);

  const favorites = settings.favoriteExerciseSlugs;
  const archived = settings.archivedExerciseSlugs;

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
    <div className="space-y-5">
      <section className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-white">Exercises</h1>
          <p className="mt-1 text-sm text-zinc-500">Find it fast, favorite it, and move on.</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon-lg"
              className="rounded-2xl bg-lime-300 text-zinc-950 hover:bg-lime-200"
            >
              <Plus className="size-5" />
              <span className="sr-only">Create exercise</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="border border-white/10 bg-zinc-950 text-white">
            <DialogHeader>
              <DialogTitle>Create custom exercise</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Add a movement that feels native inside your library.
              </DialogDescription>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();

                const trimmedName = customName.trim();
                const primaryMuscles = customPrimaryMuscles
                  .split(",")
                  .map((token) => token.trim())
                  .filter(Boolean);

                if (!trimmedName || primaryMuscles.length === 0) {
                  return;
                }

                createCustomExercise({
                  name: trimmedName,
                  equipment: customEquipment.trim() || "custom",
                  primaryMuscles,
                });
                setCustomName("");
                setCustomEquipment("");
                setCustomPrimaryMuscles("");
                setQuery(trimmedName);
                setDialogOpen(false);
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="exercise-name">Exercise name</Label>
                <Input
                  id="exercise-name"
                  value={customName}
                  onChange={(event) => setCustomName(event.target.value)}
                  placeholder="Standing cable crunch"
                  className="h-11 rounded-2xl border-white/10 bg-white/[0.03] px-4 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exercise-equipment">Equipment</Label>
                <Input
                  id="exercise-equipment"
                  value={customEquipment}
                  onChange={(event) => setCustomEquipment(event.target.value)}
                  placeholder="Cable"
                  className="h-11 rounded-2xl border-white/10 bg-white/[0.03] px-4 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exercise-muscles">Primary muscles</Label>
                <Input
                  id="exercise-muscles"
                  value={customPrimaryMuscles}
                  onChange={(event) => setCustomPrimaryMuscles(event.target.value)}
                  placeholder="Abs, Obliques"
                  className="h-11 rounded-2xl border-white/10 bg-white/[0.03] px-4 text-white"
                />
              </div>
              <Button className="h-11 w-full rounded-2xl bg-lime-300 text-zinc-950 hover:bg-lime-200">
                Save exercise
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </section>

      <section className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <Input
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
        <div className="space-y-5">
          {Object.entries(groupedExercises).map(([letter, group]) => (
            <section key={letter} className="space-y-3">
              <p className="px-1 text-sm font-medium text-zinc-500">{letter}</p>
              <div className="overflow-hidden rounded-[1.5rem] border border-white/8 bg-white/[0.03]">
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
        <div className="overflow-hidden rounded-[1.5rem] border border-white/8 bg-white/[0.03]">
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
        <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-center text-sm text-zinc-400">
          No exercises match that search yet.
        </div>
      ) : null}
    </div>
  );
}
