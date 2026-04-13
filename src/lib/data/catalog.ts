import rawCatalog from "@/lib/data/exercise-catalog.raw.json";
import type {
  CatalogSearchFilters,
  ExerciseCatalogItem,
  RawExerciseRecord,
} from "@/types/kinetic";

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toTitle(value: string) {
  return value
    .split(/[-_]/g)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ");
}

export const builtInExercises: ExerciseCatalogItem[] = (
  rawCatalog as RawExerciseRecord[]
).map((exercise) => ({
  id: exercise.id,
  slug: toSlug(exercise.id),
  name: exercise.name,
  source: "built-in",
  force: exercise.force ?? null,
  level: exercise.level ?? null,
  mechanic: exercise.mechanic ?? null,
  equipment: exercise.equipment ?? null,
  category: exercise.category ?? null,
  primaryMuscles: exercise.primaryMuscles ?? [],
  secondaryMuscles: exercise.secondaryMuscles ?? [],
  instructions: exercise.instructions ?? [],
  anatomyLabel: toTitle(exercise.primaryMuscles?.[0] ?? "full-body"),
  images: exercise.images ?? [],
}));

export const builtInExerciseMap = new Map(
  builtInExercises.map((exercise) => [exercise.slug, exercise]),
);

export function getExerciseBySlug(slug: string) {
  return builtInExerciseMap.get(slug) ?? null;
}

export function findExerciseByName(name: string) {
  const exact = builtInExercises.find(
    (exercise) => exercise.name.toLowerCase() === name.toLowerCase(),
  );

  if (exact) {
    return exact;
  }

  return (
    builtInExercises.find((exercise) =>
      exercise.name.toLowerCase().includes(name.toLowerCase()),
    ) ?? null
  );
}

export function searchExercises(
  catalog: ExerciseCatalogItem[],
  query: string,
  filters: CatalogSearchFilters = {},
) {
  const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);

  return catalog.filter((exercise) => {
    const haystack = [
      exercise.name,
      exercise.force,
      exercise.level,
      exercise.mechanic,
      exercise.equipment,
      exercise.category,
      ...exercise.primaryMuscles,
      ...exercise.secondaryMuscles,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (tokens.length > 0 && !tokens.every((token) => haystack.includes(token))) {
      return false;
    }

    if (
      filters.favoritesOnly &&
      !(filters.recentSlugs ?? []).includes(exercise.slug)
    ) {
      return false;
    }

    if (filters.source && filters.source !== "all" && exercise.source !== filters.source) {
      return false;
    }

    if (
      filters.equipment &&
      (exercise.equipment ?? "").toLowerCase() !== filters.equipment.toLowerCase()
    ) {
      return false;
    }

    if (
      filters.muscle &&
      ![...exercise.primaryMuscles, ...exercise.secondaryMuscles]
        .map((muscle) => muscle.toLowerCase())
        .includes(filters.muscle.toLowerCase())
    ) {
      return false;
    }

    return true;
  });
}
