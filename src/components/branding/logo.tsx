import { Activity, Dumbbell } from "lucide-react";

import { cn } from "@/lib/utils";

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative flex size-10 items-center justify-center rounded-2xl border border-lime-300/20 bg-lime-300/10 text-lime-300 shadow-[0_0_40px_-16px_rgba(196,255,57,0.9)]">
        <Dumbbell className="size-4" />
        <Activity className="absolute -right-1 -top-1 size-3 rounded-full bg-zinc-950 p-0.5 text-lime-300" />
      </div>
      {showWordmark ? (
        <div>
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.32em] text-lime-300/70">
            Kinetic
          </p>
          <p className="text-sm font-semibold tracking-tight text-white">
            Premium workout logging
          </p>
        </div>
      ) : null}
    </div>
  );
}
