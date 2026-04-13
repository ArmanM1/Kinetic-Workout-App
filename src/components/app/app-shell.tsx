import Link from "next/link";
import { Settings2 } from "lucide-react";

import { Logo } from "@/components/branding/logo";
import { BottomNav } from "@/components/app/bottom-nav";
import { Button } from "@/components/ui/button";

export function AppShell({
  children,
  isDemoMode,
}: {
  children: React.ReactNode;
  isDemoMode: boolean;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(196,255,57,0.16),_transparent_32%),linear-gradient(180deg,_#090b0c_0%,_#050607_48%,_#020303_100%)] text-white">
      <header className="sticky top-0 z-30 bg-zinc-950/70 backdrop-blur">
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

      <main className="mx-auto flex w-full max-w-[27rem] flex-col px-4 pb-28 pt-2">{children}</main>
      <BottomNav />
    </div>
  );
}
