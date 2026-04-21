"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

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

const muscleTagOptions = [
  "Chest",
  "Lats",
  "Middle Back",
  "Lower Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Forearms",
  "Quadriceps",
  "Hamstrings",
  "Glutes",
  "Calves",
  "Abdominals",
  "Obliques",
  "Traps",
];

function toCustomExerciseSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type CustomExerciseDialogProps = {
  description?: string;
  onCreated?: (exercise: { name: string; slug: string }) => void;
  title?: string;
  trigger?: React.ReactNode;
};

export function CustomExerciseDialog({
  description = "Add a movement that feels native inside your library.",
  onCreated,
  title = "Create custom exercise",
  trigger,
}: CustomExerciseDialogProps) {
  const { createCustomExercise } = useWorkoutStore();
  const [open, setOpen] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customEquipment, setCustomEquipment] = useState("");
  const [customPrimaryMuscles, setCustomPrimaryMuscles] = useState<string[]>([]);
  const [customSecondaryMuscles, setCustomSecondaryMuscles] = useState<string[]>([]);

  function resetForm() {
    setCustomName("");
    setCustomEquipment("");
    setCustomPrimaryMuscles([]);
    setCustomSecondaryMuscles([]);
  }

  function togglePrimaryMuscle(muscle: string) {
    setCustomPrimaryMuscles((current) => {
      if (current.includes(muscle)) {
        return current.filter((entry) => entry !== muscle);
      }

      return [...current, muscle];
    });

    setCustomSecondaryMuscles((current) =>
      current.filter((entry) => entry !== muscle),
    );
  }

  function toggleSecondaryMuscle(muscle: string) {
    setCustomSecondaryMuscles((current) => {
      if (current.includes(muscle)) {
        return current.filter((entry) => entry !== muscle);
      }

      return [...current, muscle];
    });

    setCustomPrimaryMuscles((current) =>
      current.filter((entry) => entry !== muscle),
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = customName.trim();
    const primaryMuscles = customPrimaryMuscles;

    if (!trimmedName || primaryMuscles.length === 0) {
      return;
    }

    createCustomExercise({
      name: trimmedName,
      equipment: customEquipment.trim() || "custom",
      primaryMuscles,
      secondaryMuscles: customSecondaryMuscles,
    });

    const created = {
      name: trimmedName,
      slug: toCustomExerciseSlug(trimmedName),
    };

    resetForm();
    setOpen(false);
    onCreated?.(created);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (!nextOpen) {
          resetForm();
        }
      }}
    >
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button
            size="icon-lg"
            className="rounded-2xl bg-lime-300 text-zinc-950 hover:bg-lime-200"
          >
            <Plus className="size-5" />
            <span className="sr-only">Create exercise</span>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="border border-white/10 bg-zinc-950 text-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-zinc-400">{description}</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="custom-exercise-name">Exercise name</Label>
            <Input
              id="custom-exercise-name"
              value={customName}
              onChange={(event) => setCustomName(event.target.value)}
              placeholder="Standing cable crunch"
              className="h-11 rounded-2xl border-white/10 bg-white/[0.03] px-4 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="custom-exercise-equipment">Equipment</Label>
            <Input
              id="custom-exercise-equipment"
              value={customEquipment}
              onChange={(event) => setCustomEquipment(event.target.value)}
              placeholder="Cable"
              className="h-11 rounded-2xl border-white/10 bg-white/[0.03] px-4 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="custom-exercise-muscles">Primary muscles</Label>
            <div
              id="custom-exercise-muscles"
              className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3"
            >
              {muscleTagOptions.map((muscle) => (
                <button
                  key={muscle}
                  type="button"
                  onClick={() => togglePrimaryMuscle(muscle)}
                  className={`rounded-full border px-3 py-1 text-sm transition ${
                    customPrimaryMuscles.includes(muscle)
                      ? "border-lime-300/20 bg-lime-300/10 text-lime-200"
                      : "border-white/10 bg-black/20 text-zinc-300 hover:text-white"
                  }`}
                >
                  {muscle}
                </button>
              ))}
            </div>
            <p className="text-xs text-zinc-400">
              Choose at least one primary muscle so volume maps to the right region.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="custom-exercise-secondary-muscles">Secondary muscles</Label>
            <div
              id="custom-exercise-secondary-muscles"
              className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3"
            >
              {muscleTagOptions.map((muscle) => (
                <button
                  key={`secondary-${muscle}`}
                  type="button"
                  onClick={() => toggleSecondaryMuscle(muscle)}
                  className={`rounded-full border px-3 py-1 text-sm transition ${
                    customSecondaryMuscles.includes(muscle)
                      ? "border-cyan-300/25 bg-cyan-300/10 text-cyan-200"
                      : "border-white/10 bg-black/20 text-zinc-300 hover:text-white"
                  }`}
                >
                  {muscle}
                </button>
              ))}
            </div>
          </div>
          <Button className="h-11 w-full rounded-2xl bg-lime-300 text-zinc-950 hover:bg-lime-200">
            Save exercise
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
