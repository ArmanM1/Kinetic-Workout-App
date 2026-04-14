"use server";

import { redirect } from "next/navigation";

import { env, missingSupabaseEnv } from "@/lib/env";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";

function withMessage(path: string, message: string): never {
  const params = new URLSearchParams({
    message,
  });

  redirect(`${path}?${params.toString()}`);
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (missingSupabaseEnv.length > 0) {
    withMessage(
      "/auth/login",
      `Missing environment variables: ${missingSupabaseEnv.join(", ")}`,
    );
  }

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    withMessage("/auth/login", "Supabase is not configured yet.");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    withMessage("/auth/login", error.message);
  }

  redirect("/app");
}

export async function signUpAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (missingSupabaseEnv.length > 0) {
    withMessage(
      "/auth/signup",
      `Missing environment variables: ${missingSupabaseEnv.join(", ")}`,
    );
  }

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    withMessage("/auth/signup", "Supabase is not configured yet.");
  }

  const adminSupabase = getSupabaseAdminClient();

  if (adminSupabase) {
    const { error } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      withMessage("/auth/signup", error.message);
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      withMessage("/auth/login", signInError.message);
    }

    redirect("/app");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: env.NEXT_PUBLIC_SITE_URL
        ? `${env.NEXT_PUBLIC_SITE_URL}/auth/callback`
        : undefined,
    },
  });

  if (error) {
    withMessage("/auth/signup", error.message);
  }

  if (!data.session) {
    withMessage(
      "/auth/login",
      "Account created. Log in to finish your quick setup inside Kinetic.",
    );
  }

  redirect("/app");
}

export async function signOutAction() {
  const supabase = await getSupabaseServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/");
}
