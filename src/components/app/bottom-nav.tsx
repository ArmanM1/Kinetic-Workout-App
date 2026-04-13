"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Dumbbell, FolderKanban, Home, Settings2 } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/app", label: "Home", icon: Home },
  { href: "/app/exercises", label: "Exercises", icon: Dumbbell },
  { href: "/app/splits", label: "Splits", icon: FolderKanban },
  { href: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/app/settings", label: "Settings", icon: Settings2 },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-4 z-40 mx-auto flex w-[min(27rem,calc(100%-1.5rem))] items-center justify-between rounded-[1.75rem] border border-white/8 bg-black/85 p-2 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.88)] backdrop-blur">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || (item.href !== "/app" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[0.68rem] font-medium text-zinc-500 transition",
              isActive
                ? "bg-lime-300/14 text-lime-300 shadow-[0_0_28px_-18px_rgba(196,255,57,0.95)]"
                : "hover:bg-white/5 hover:text-white",
            )}
          >
            <Icon className={cn("size-4", isActive ? "text-lime-300" : "text-zinc-400")} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
