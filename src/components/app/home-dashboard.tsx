"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Play, Plus } from "lucide-react";

import { OnboardingFlow } from "@/components/app/onboarding-flow";
import { useWorkoutStore } from "@/components/providers/workout-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toSplitSlug } from "@/lib/splits";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good Morning";
  }

  if (hour < 18) {
    return "Good Afternoon";
  }

  return "Good Evening";
}

export function HomeDashboard() {
  const router = useRouter();
  const {
    activeSession,
    completeOnboarding,
    defaultSplit,
    hasCompletedOnboarding,
    hydrated,
    splits,
    profile,
    startBlankSession,
  } = useWorkoutStore();
  const [dismissedProfileId, setDismissedProfileId] = useState<string | null>(null);

  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date());

  const initials = profile.displayName
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => token.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const routines = [...splits].sort((left, right) => {
    if (left.isDefault === right.isDefault) {
      return 0;
    }

    return left.isDefault ? -1 : 1;
  });

  const primaryRoutine = defaultSplit ?? routines[0] ?? null;
  const secondaryRoutines = routines
    .filter((split) => split.id !== primaryRoutine?.id)
    .slice(0, 2);

  const primaryRoutineHref = primaryRoutine ? `/app/splits/${toSplitSlug(primaryRoutine.name)}` : "/app/splits";
  const shouldShowOnboarding =
    hydrated &&
    !activeSession &&
    !hasCompletedOnboarding &&
    dismissedProfileId !== profile.id;

  return (
    <>
      <OnboardingFlow
        key={profile.id}
        open={shouldShowOnboarding}
        displayName={profile.displayName}
        initialWeight={profile.bodyWeight}
        onOpenChange={(open) => {
          if (!open) {
            setDismissedProfileId(profile.id);
          }
        }}
        onSkip={() => {
          completeOnboarding(profile.bodyWeight);
          setDismissedProfileId(profile.id);
        }}
        onComplete={(bodyWeight) => {
          completeOnboarding(bodyWeight);
          setDismissedProfileId(profile.id);
        }}
      />

      <div className="space-y-6">
        <section className="space-y-4 rounded-[2rem] border border-white/6 bg-white/[0.03] p-5 shadow-[0_30px_80px_-45px_rgba(0,0,0,0.9)]">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-zinc-500">
              {today}
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white">{getGreeting()}</h1>
          </div>
          <div className="flex size-14 items-center justify-center rounded-2xl border border-lime-300/30 bg-lime-300/10 text-lg font-semibold text-lime-200">
            {initials || "K"}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (activeSession) {
              router.push("/app/active-workout");
              return;
            }

            startBlankSession();
            router.push("/app/active-workout");
          }}
          className="flex w-full items-center gap-4 rounded-[1.75rem] border border-lime-300/40 bg-lime-300 px-4 py-4 text-left text-zinc-950 shadow-[0_20px_60px_-38px_rgba(196,255,57,1)] transition hover:bg-lime-200"
        >
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-black/10">
            {activeSession ? <Play className="size-6" /> : <Plus className="size-6" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-2xl font-semibold leading-tight">
              {activeSession ? "Resume Workout" : "Start Empty Workout"}
            </p>
            {activeSession ? (
              <p className="mt-1 text-sm text-zinc-900/70">{activeSession.title}</p>
            ) : null}
          </div>
          <ArrowRight className="size-5 shrink-0" />
        </button>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/app/exercises"
            className="rounded-[1.5rem] border border-white/8 bg-black/30 px-4 py-4 transition hover:border-lime-300/20 hover:bg-white/[0.04]"
          >
            <p className="text-sm font-medium text-white">Browse Exercises</p>
            <p className="mt-2 text-xs uppercase tracking-[0.22em] text-zinc-500">Library</p>
          </Link>
          <Link
            href="/app/splits"
            className="rounded-[1.5rem] border border-white/8 bg-black/30 px-4 py-4 transition hover:border-lime-300/20 hover:bg-white/[0.04]"
          >
            <p className="text-sm font-medium text-white">Open Splits</p>
            <p className="mt-2 text-xs uppercase tracking-[0.22em] text-zinc-500">Routines</p>
          </Link>
        </div>
        </section>

        <section className="space-y-3">
        <div className="flex items-center justify-between gap-3 px-1">
          <h2 className="text-2xl font-semibold tracking-tight text-white">My Routines</h2>
          <Button asChild variant="ghost" size="sm" className="text-lime-200 hover:text-lime-100">
            <Link href="/app/splits">
              Create New
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {primaryRoutine ? (
          <Card className="border-white/8 bg-white/[0.04] text-white">
            <CardContent className="space-y-4 p-5">
              <Link href={primaryRoutineHref} className="block">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                    {primaryRoutine.days[0]?.focus ?? "Default split"}
                  </p>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-3xl font-semibold tracking-tight">{primaryRoutine.name}</p>
                      <p className="mt-2 text-sm text-zinc-400">
                        {primaryRoutine.days.length} day
                        {primaryRoutine.days.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <ArrowRight className="mt-1 size-5 shrink-0 text-lime-200" />
                  </div>
                </div>
              </Link>
              <div className="flex flex-wrap gap-2">
                {primaryRoutine.days.slice(0, 3).map((day) => (
                  <Link
                    key={day.id}
                    href={primaryRoutineHref}
                    className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-sm text-zinc-300 transition hover:border-lime-300/20 hover:text-white"
                  >
                    {day.name}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-white/8 bg-white/[0.04] text-white">
            <CardContent className="space-y-4 p-5">
              <p className="text-lg font-semibold">No routines yet</p>
              <Button asChild className="bg-lime-300 text-zinc-950 hover:bg-lime-200">
                <Link href="/app/splits">Build first routine</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {secondaryRoutines.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {secondaryRoutines.map((split) => (
              <Link
                key={split.id}
                href={`/app/splits/${toSplitSlug(split.name)}`}
                className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4 text-left transition hover:border-lime-300/20 hover:bg-white/[0.05]"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                  {split.days[0]?.focus ?? "Routine"}
                </p>
                <p className="mt-2 text-xl font-semibold text-white">{split.name}</p>
                <p className="mt-3 text-sm text-zinc-400">{split.days.length} day{split.days.length === 1 ? "" : "s"}</p>
              </Link>
            ))}
          </div>
        ) : null}
        </section>
      </div>
    </>
  );
}
