"use client";

import { ThemeProvider } from "next-themes";

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/components/providers/query-provider";
import { WorkoutProvider } from "@/components/providers/workout-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryProvider>
        <TooltipProvider>
          <WorkoutProvider>{children}</WorkoutProvider>
        </TooltipProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
