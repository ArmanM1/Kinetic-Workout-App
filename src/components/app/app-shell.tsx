"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Check,
  ChevronRight,
  Expand,
  Minimize,
  Settings2,
  Trash2,
} from "lucide-react";

import { useWorkoutStore } from "@/components/providers/workout-provider";
import { Logo } from "@/components/branding/logo";
import { BottomNav } from "@/components/app/bottom-nav";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { activeSession, clearActiveSession, finishActiveSession } = useWorkoutStore();
  const [supportsFullscreen, setSupportsFullscreen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [discardAlertOpen, setDiscardAlertOpen] = useState(false);
  const isWorkoutRoute = pathname === "/app/active-workout";
  const isExerciseRoute = pathname.startsWith("/app/exercises");
  const showFloatingWorkout = Boolean(activeSession && !isWorkoutRoute);
  const workoutTitle = activeSession?.title.trim() ? activeSession.title : "Blank Workout";

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const syncFullscreenState = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
      setSupportsFullscreen(Boolean(document.fullscreenEnabled));
    };

    syncFullscreenState();
    document.addEventListener("fullscreenchange", syncFullscreenState);

    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreenState);
    };
  }, []);

  async function handleFullscreenToggle() {
    if (typeof document === "undefined" || !document.fullscreenEnabled) {
      return;
    }

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      setSupportsFullscreen(false);
    }
  }

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
            {supportsFullscreen ? (
              <Button variant="ghost" size="icon" onClick={handleFullscreenToggle}>
                {isFullscreen ? <Minimize className="size-4" /> : <Expand className="size-4" />}
                <span className="sr-only">
                  {isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                </span>
              </Button>
            ) : null}
            <Button asChild variant="ghost" size="icon">
              <Link href="/app/settings">
                <Settings2 className="size-4" />
                <span className="sr-only">Open settings</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

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
              onClick={() => setDiscardAlertOpen(true)}
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

      <AlertDialog open={discardAlertOpen} onOpenChange={setDiscardAlertOpen}>
        <AlertDialogContent className="border border-rose-400/20 bg-zinc-950 text-white">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-rose-500/12 text-rose-300">
              <AlertTriangle className="size-5" />
            </AlertDialogMedia>
            <AlertDialogTitle>Discard active workout?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              This removes the live session and clears the floating return bar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="border-white/10 bg-white/[0.03]">
            <AlertDialogCancel className="border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]">
              Keep workout
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                clearActiveSession();
                router.push("/app");
              }}
            >
              Discard workout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav />
      </div>
    </div>
  );
}
