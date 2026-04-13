import Link from "next/link";

import { signInAction } from "@/actions/auth";
import { Logo } from "@/components/branding/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader className="space-y-4">
            <Logo />
            <div className="space-y-3">
              <Badge className="w-fit border border-lime-300/20 bg-lime-300/10 text-lime-100">
                Email/password only
              </Badge>
              <CardTitle as="h1" className="text-3xl">Welcome back</CardTitle>
              <CardDescription className="text-zinc-300">
                Log in to reopen your active workout, browse splits, and keep your progression data
                structured instead of buried in notes.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle as="h2">Log in</CardTitle>
            <CardDescription className="text-zinc-300">
              No magic-link-first flow, no anonymous sessions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {params.message ? (
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-100">
                {params.message}
              </div>
            ) : null}
            <form action={signInAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required className="border-white/10 bg-black/20 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required className="border-white/10 bg-black/20 text-white" />
              </div>
              <Button className="w-full bg-lime-300 text-zinc-950 hover:bg-lime-200">
                Log in
              </Button>
            </form>
            <p className="text-sm text-zinc-400">
              New here?{" "}
              <Link href="/auth/signup" className="text-lime-200 hover:text-lime-100">
                Create an account
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
