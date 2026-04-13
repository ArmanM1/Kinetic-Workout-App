import Link from "next/link";
import { Settings2 } from "lucide-react";

import { Logo } from "@/components/branding/logo";
import { BottomNav } from "@/components/app/bottom-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { setupChecklist } from "@/lib/env";

export function AppShell({
  children,
  isDemoMode,
}: {
  children: React.ReactNode;
  isDemoMode: boolean;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(196,255,57,0.16),_transparent_32%),linear-gradient(180deg,_#090b0c_0%,_#050607_48%,_#020303_100%)] text-white">
      <header className="sticky top-0 z-30 border-b border-white/6 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-3">
            {isDemoMode ? (
              <Badge className="border border-amber-400/20 bg-amber-400/10 text-amber-200">
                Demo mode
              </Badge>
            ) : (
              <Badge className="border border-lime-300/20 bg-lime-300/10 text-lime-200">
                Synced
              </Badge>
            )}
            <Button asChild variant="outline" size="sm">
              <Link href="/app/settings">
                <Settings2 className="size-4" />
                Settings
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {isDemoMode ? (
        <div className="border-b border-white/6 bg-white/5">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-4 py-3 text-sm text-zinc-300 sm:px-6">
            <span className="font-medium text-white">
              Supabase auth and syncing are ready in code, but local env keys still need to be wired.
            </span>
            {setupChecklist
              .filter((item) => !item.done)
              .map((item) => (
                <Badge
                  key={item.label}
                  variant="outline"
                  className="border-white/10 bg-white/5 text-zinc-300"
                >
                  {item.label}
                </Badge>
              ))}
          </div>
        </div>
      ) : null}

      <main className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-28 pt-6 sm:px-6">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
