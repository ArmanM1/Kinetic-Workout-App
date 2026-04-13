"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, BarChart3, Home } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/app", label: "Home", icon: Home },
  { href: "/app/active-workout", label: "Active", icon: Activity },
  { href: "/app/analytics", label: "Analytics", icon: BarChart3 },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-4 z-40 mx-auto flex w-[min(26rem,calc(100%-1.5rem))] items-center justify-between rounded-full border border-white/10 bg-zinc-950/90 p-2 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.85)] backdrop-blur">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || (item.href !== "/app" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex min-w-0 flex-1 items-center justify-center gap-2 rounded-full px-3 py-3 text-sm font-medium text-zinc-400 transition",
              isActive
                ? "bg-lime-300 text-zinc-950 shadow-[0_12px_40px_-20px_rgba(196,255,57,1)]"
                : "hover:bg-white/5 hover:text-white",
            )}
          >
            <Icon className="size-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
