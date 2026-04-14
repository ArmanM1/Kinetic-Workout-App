import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, TimerReset } from "lucide-react";

import { Logo } from "@/components/branding/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const featureCards = [
  {
    title: "Fast logging, not friction",
    description:
      "Start blank or from a split day, keep one active workout alive, and surface prior values where you need them.",
    icon: TimerReset,
  },
  {
    title: "Built for serious lifters",
    description:
      "Track structured sets, supersets, drop sets, assisted work, and progression without paywall-style friction.",
    icon: Sparkles,
  },
  {
    title: "Ready for real accounts",
    description:
      "Supabase email/password auth, protected routes, RLS-first schema, and Vercel deployment wiring are baked into the repo.",
    icon: ShieldCheck,
  },
];

const launchHighlights = [
  "Email/password accounts with protected app routes",
  "Clean first-run state with no sample workouts or seeded fake history",
  "Mobile-first logging, routines, analytics, and exercise browsing in one flow",
] as const;

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(196,255,57,0.18),_transparent_28%),linear-gradient(180deg,_#111415_0%,_#060708_52%,_#020303_100%)] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6">
        <header className="flex items-center justify-between gap-4 py-4">
          <Logo />
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link href="/auth/login">Log in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/auth/signup">Create account</Link>
            </Button>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-10 py-10">
          <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-6">
              <Badge className="border border-lime-300/25 bg-lime-300/10 text-lime-200">
                Free • No in-app purchases • Donation link only
              </Badge>
              <div className="space-y-4">
                <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                  The premium-feeling workout tracker that stays out of your way.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-zinc-300">
                  Kinetic is mobile-first by default: fast blank workouts, split launches,
                  inline previous-performance guidance, and a recovery-safe active session that
                  stays with you while you move through the app.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-lime-300 text-zinc-950 hover:bg-lime-200">
                  <Link href="/auth/signup">
                    Start free
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/app">Open app</Link>
                </Button>
              </div>
            </div>

            <Card className="border-white/10 bg-white/5 text-white backdrop-blur">
              <CardHeader>
                <CardTitle>Built for launch</CardTitle>
                <CardDescription className="text-zinc-300">
                  Kinetic opens like a product now, not an internal preview build.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {launchHighlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/8 bg-black/20 p-3"
                  >
                    <div className="flex items-start gap-3">
                      <Badge className="border border-lime-300/20 bg-lime-300/10 text-lime-100">
                        Ready
                      </Badge>
                      <p className="text-sm text-zinc-300">{item}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {featureCards.map((card) => {
              const Icon = card.icon;

              return (
                <Card
                  key={card.title}
                  className="border-white/10 bg-white/5 text-white backdrop-blur"
                >
                  <CardHeader className="space-y-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-lime-300/10 text-lime-300">
                      <Icon className="size-5" />
                    </div>
                    <div className="space-y-2">
                      <CardTitle>{card.title}</CardTitle>
                      <CardDescription className="text-zinc-300">
                        {card.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </section>
        </main>
      </div>
    </div>
  );
}
