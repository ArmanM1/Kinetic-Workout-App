import type { WorkoutSplit } from "@/types/kinetic";

export function toSplitSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function findSplitBySlug(splits: WorkoutSplit[], slug: string) {
  return splits.find((split) => toSplitSlug(split.name) === slug) ?? null;
}
