"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Check, ChevronRight, Settings2, Trash2 } from "lucide-react";

import { useWorkoutStore } from "@/components/providers/workout-provider";
import { Logo } from "@/components/branding/logo";
import { BottomNav } from "@/components/app/bottom-nav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
  isDemoMode,
}: {
  children: React.ReactNode;
  isDemoMode: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { activeSession, clearActiveSession, finishActiveSession } = useWorkoutStore();
  const isWorkoutRoute = pathname === "/app/active-workout";
  const isExerciseRoute = pathname.startsWith("/app/exercises");
  const showFloatingWorkout = Boolean(activeSession && !isWorkoutRoute);
  const workoutTitle = activeSession?.title.trim() ? activeSession.title : "Blank Workout";

  return (
    <div className="min-h-screen bg-[#020304] text-white sm:p-3">
      <div
        className={cn(
          "mobile-app-shell relative mx-auto min-h-screen max-w-[28rem] overflow-x-hidden",
          isExerciseRoute
            ? "bg-[linear-gradient(180deg,_#090b0c_0%,_#050607_48%,_#020303_100%)]"
            : "bg-[radial-gradient(circle_at_top,_rgba(196,255,57,0.16),_transparent_32%),linear-gradient(180deg,_#090b0c_0%,_#050607_48%,_#020303_100%)]",
        )}
      >
      <header className="sticky top-0 z-30 bg-zinc-950/65 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[27rem] items-center justify-between gap-4 px-4 pb-3 pt-5">
          <div className="flex items-center gap-3">
            <Logo showWordmark={false} />
            <p className="text-xl font-semibold uppercase tracking-[0.18em] text-lime-300">
              Kinetic
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon">
              <Link href="/app/settings">
                <Settings2 className="size-4" />
                <span className="sr-only">Open settings</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {isDemoMode ? (
        <div className="px-4 pb-2">
          <div className="mx-auto w-full max-w-[27rem] rounded-2xl border border-amber-400/15 bg-amber-400/8 px-4 py-3 text-sm text-amber-100/90">
            Running in demo mode until live Supabase keys are attached.
          </div>
        </div>
      ) : null}

      <main
        className={cn(
          "mx-auto flex w-full max-w-[27rem] flex-col px-4 pt-2",
          showFloatingWorkout ? "pb-44" : "pb-28",
        )}
      >
        {children}
      </main>

      {showFloatingWorkout ? (
        <div className="fixed inset-x-0 bottom-28 z-30 mx-auto w-[min(27rem,calc(100%-1.5rem))] px-4">
          <div className="flex items-center gap-2 rounded-[1.5rem] border border-white/10 bg-zinc-950/95 p-2 text-white shadow-[0_24px_70px_-40px_rgba(0,0,0,0.92)] backdrop-blur">
            <button
              type="button"
              onClick={() => router.push("/app/active-workout")}
              className="flex min-w-0 flex-1 items-center gap-3 rounded-[1.15rem] px-2 py-2 text-left transition hover:bg-white/[0.05]"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-lime-200/70">
                  Active workout
                </p>
                <p className="truncate text-sm font-medium text-white">{workoutTitle}</p>
              </div>
              <ChevronRight className="size-4 shrink-0 text-zinc-500" />
            </button>
            <Button
              size="icon-sm"
              variant="outline"
              className="border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06] hover:text-white"
              onClick={() => clearActiveSession()}
            >
              <Trash2 className="size-4" />
              <span className="sr-only">Discard workout</span>
            </Button>
            <Button
              size="icon-sm"
              className="bg-lime-300 text-zinc-950 hover:bg-lime-200"
              onClick={() => finishActiveSession("")}
            >
              <Check className="size-4" />
              <span className="sr-only">End workout</span>
            </Button>
          </div>
        </div>
      ) : null}

      <BottomNav />
      </div>
    </div>
  );
}
