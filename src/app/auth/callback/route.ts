import { NextResponse } from "next/server";

import { missingSupabaseEnv } from "@/lib/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/app";

  if (!code) {
    return NextResponse.redirect(new URL("/auth/login?message=Missing+auth+code", url.origin));
  }

  if (missingSupabaseEnv.length > 0) {
    return NextResponse.redirect(
      new URL(
        `/auth/login?message=Missing+environment+variables:+${missingSupabaseEnv.join(",+")}`,
        url.origin,
      ),
    );
  }

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return NextResponse.redirect(
      new URL("/auth/login?message=Supabase+is+not+configured", url.origin),
    );
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/login?message=${encodeURIComponent(error.message)}`, url.origin),
    );
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
