"use client";

import { useState } from "react";

import { useWorkoutStore } from "@/components/providers/workout-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function useSessionReplacementGuard() {
  const { activeSession, clearActiveSession, finishActiveSession } = useWorkoutStore();
  const [open, setOpen] = useState(false);
  const [pendingLabel, setPendingLabel] = useState("start a new workout");
  const [pendingAction, setPendingAction] = useState<null | (() => void)>(null);

  function closeDialog() {
    setOpen(false);
    setPendingAction(null);
    setPendingLabel("start a new workout");
  }

  function runOrConfirm(action: () => void, label: string) {
    if (!activeSession) {
      action();
      return;
    }

    setPendingLabel(label);
    setPendingAction(() => action);
    setOpen(true);
  }

  function handleDiscard() {
    clearActiveSession();
    pendingAction?.();
    closeDialog();
  }

  function handleFinish() {
    finishActiveSession("");
    pendingAction?.();
    closeDialog();
  }

  return {
    runOrConfirm,
    dialog: (
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            closeDialog();
            return;
          }

          setOpen(true);
        }}
      >
        <DialogContent className="border border-white/10 bg-zinc-950 text-white">
          <DialogHeader>
            <DialogTitle>End current workout?</DialogTitle>
            <p className="text-sm text-zinc-400">Starting {pendingLabel} replaces your live session.</p>
          </DialogHeader>
          <div className="grid gap-2 sm:grid-cols-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              className="border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
              onClick={handleDiscard}
            >
              Discard
            </Button>
            <Button className="bg-lime-300 text-zinc-950 hover:bg-lime-200" onClick={handleFinish}>
              End Workout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    ),
  };
}
