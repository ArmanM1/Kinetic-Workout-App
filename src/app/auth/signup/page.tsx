import Link from "next/link";

import { signUpAction } from "@/actions/auth";
import { Logo } from "@/components/branding/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function SignupPage({
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
                Free forever core
              </Badge>
              <CardTitle as="h1" className="text-3xl">Create your Kinetic account</CardTitle>
              <CardDescription className="text-zinc-300">
                Set up email/password access, then head straight into onboarding, home, and fast
                workout logging.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle as="h2">Sign up</CardTitle>
            <CardDescription className="text-zinc-300">
              Accounts are persistent and anonymous auth is disabled by design.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {params.message ? (
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-100">
                {params.message}
              </div>
            ) : null}
            <form action={signUpAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required className="border-white/10 bg-black/20 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required className="border-white/10 bg-black/20 text-white" />
              </div>
              <Button className="w-full bg-lime-300 text-zinc-950 hover:bg-lime-200">
                Create account
              </Button>
            </form>
            <p className="text-sm text-zinc-400">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-lime-200 hover:text-lime-100">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
