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
  const [customPrimaryMuscles, setCustomPrimaryMuscles] = useState("");

  function resetForm() {
    setCustomName("");
    setCustomEquipment("");
    setCustomPrimaryMuscles("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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
            <Input
              id="custom-exercise-muscles"
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
  );
}
