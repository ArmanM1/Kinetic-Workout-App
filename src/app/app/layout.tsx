import { redirect } from "next/navigation";

import { AppShell } from "@/components/app/app-shell";
import { isSupabaseConfigured } from "@/lib/env";
import { getServerSessionUser } from "@/lib/supabase/server";

export default async function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerSessionUser();

  if (isSupabaseConfigured && !user) {
    redirect("/auth/login");
  }

  return <AppShell isDemoMode={!isSupabaseConfigured}>{children}</AppShell>;
}
