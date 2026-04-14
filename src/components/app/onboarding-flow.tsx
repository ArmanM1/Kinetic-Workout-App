"use client";

import { useState } from "react";
import { Activity, ArrowRight, BarChart3, Search, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type OnboardingFlowProps = {
  displayName: string;
  initialWeight: number | null;
  open: boolean;
  onComplete: (bodyWeight: number | null) => void;
  onOpenChange: (open: boolean) => void;
  onSkip: () => void;
};

export function OnboardingFlow({
  displayName,
  initialWeight,
  open,
  onComplete,
  onOpenChange,
  onSkip,
}: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [weight, setWeight] = useState(initialWeight?.toString() ?? "");

  const parsedWeight =
    weight.trim() === "" || Number.isNaN(Number(weight)) ? null : Number(weight);
  const nextLabel = step === 0 ? "Continue" : "Finish";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="border border-white/10 bg-zinc-950 text-white sm:max-w-md"
        showCloseButton={false}
      >
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-lime-100">
              Step {step + 1} / 2
            </div>
            <button
              type="button"
              onClick={onSkip}
              className="text-sm font-medium text-zinc-400 transition hover:text-white"
            >
              Skip
            </button>
          </div>
          <DialogTitle className="text-2xl">
            {step === 0
              ? `Welcome${displayName ? `, ${displayName}` : ""}`
              : "Quick walkthrough"}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {step === 0
              ? "Add your bodyweight now so assisted movements and analytics start from the right baseline."
              : "A quick pass through the app so first-time users know where everything lives."}
          </DialogDescription>
        </DialogHeader>

        {step === 0 ? (
          <div className="space-y-4">
            <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-4">
              <Label htmlFor="onboarding-weight" className="text-sm text-zinc-300">
                Body weight
              </Label>
              <Input
                id="onboarding-weight"
                value={weight}
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                onChange={(event) => setWeight(event.target.value)}
                className="mt-3 h-12 rounded-2xl border-white/10 bg-black/20 text-white"
                placeholder="Optional"
              />
              <p className="mt-2 text-xs text-zinc-500">
                You can change this later in Settings.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {[
              {
                icon: Activity,
                title: "Home",
                detail: "Start blank workouts fast and jump back into any live session.",
              },
              {
                icon: Search,
                title: "Exercises",
                detail: "Browse, favorite, and add custom movements without leaving the flow.",
              },
              {
                icon: BarChart3,
                title: "Analytics",
                detail: "Track volume, E1RM, and body-part trends once sessions start stacking up.",
              },
              {
                icon: Smartphone,
                title: "Add to iPhone home screen",
                detail:
                  "In Safari, tap Share, then Add to Home Screen for the cleanest full-screen feel.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-[1.3rem] border border-white/8 bg-white/[0.04] p-4"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-lime-300/10 text-lime-300">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-zinc-400">{item.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-2 border-t border-white/8 pt-4">
          {step === 1 ? (
            <Button
              variant="outline"
              className="flex-1 border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
              onClick={() => setStep(0)}
            >
              Back
            </Button>
          ) : null}
          <Button
            className="flex-1 bg-lime-300 text-zinc-950 hover:bg-lime-200"
            onClick={() => {
              if (step === 0) {
                setStep(1);
                return;
              }

              onComplete(parsedWeight);
            }}
          >
            {nextLabel}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
