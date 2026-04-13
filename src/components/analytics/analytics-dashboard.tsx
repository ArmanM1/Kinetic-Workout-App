"use client";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useWorkoutStore } from "@/components/providers/workout-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  buildBodyWeightTrend,
  buildDashboardStats,
  buildFrequencyBreakdown,
  buildOneRmProgression,
  buildPersonalRecords,
  buildVolumeSeries,
} from "@/lib/domain/analytics";
import { useHydrated } from "@/lib/hooks/use-hydrated";

function ChartFallback() {
  return <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03]" />;
}

export function AnalyticsDashboard() {
  const { bodyMetrics, history, profile } = useWorkoutStore();
  const isHydrated = useHydrated();

  const stats = buildDashboardStats(history, profile);
  const volumeSeries = buildVolumeSeries(history, profile);
  const bodyWeightTrend = buildBodyWeightTrend(bodyMetrics);
  const focusExercise = history[0]?.exercises[0]?.exerciseSlug ?? "";
  const oneRmSeries = buildOneRmProgression(history, focusExercise, profile);
  const breakdown = buildFrequencyBreakdown(history);
  const personalRecords = buildPersonalRecords(history, profile);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardDescription className="text-zinc-400">{stat.label}</CardDescription>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-zinc-400">{stat.hint}</CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Volume over time</CardTitle>
            <CardDescription className="text-zinc-300">
              Session volume uses resolved load, so assisted work and filled-forward sets still read
              correctly.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            {isHydrated ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={volumeSeries}>
                  <defs>
                    <linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c4ff39" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#c4ff39" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="label" stroke="#71717a" />
                  <YAxis stroke="#71717a" />
                  <Tooltip contentStyle={{ background: "#09090b", border: "1px solid rgba(255,255,255,0.08)" }} />
                  <Area type="monotone" dataKey="volume" stroke="#c4ff39" fill="url(#volumeFill)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <ChartFallback />
            )}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Estimated 1RM progression</CardTitle>
            <CardDescription className="text-zinc-300">
              Best set per session for your most recent highlighted lift.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            {isHydrated ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={oneRmSeries}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="label" stroke="#71717a" />
                  <YAxis stroke="#71717a" />
                  <Tooltip contentStyle={{ background: "#09090b", border: "1px solid rgba(255,255,255,0.08)" }} />
                  <Line type="monotone" dataKey="value" stroke="#ffffff" strokeWidth={3} dot={{ fill: "#c4ff39" }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <ChartFallback />
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Bodyweight trend</CardTitle>
            <CardDescription className="text-zinc-300">
              Optional body metrics tie directly into assisted exercise analytics.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            {isHydrated ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bodyWeightTrend}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="label" stroke="#71717a" />
                  <YAxis stroke="#71717a" />
                  <Tooltip contentStyle={{ background: "#09090b", border: "1px solid rgba(255,255,255,0.08)" }} />
                  <Line type="monotone" dataKey="value" stroke="#c4ff39" strokeWidth={3} dot={{ fill: "#c4ff39" }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <ChartFallback />
            )}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Frequency breakdown</CardTitle>
            <CardDescription className="text-zinc-300">
              Split consistency, exercise frequency, and muscle group exposure at a glance.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-[0.7fr_0.3fr]">
            <div className="h-72">
              {isHydrated ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={breakdown.exercises.map(([name, value]) => ({ name, value }))}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                    <XAxis dataKey="name" stroke="#71717a" hide />
                    <YAxis stroke="#71717a" />
                    <Tooltip contentStyle={{ background: "#09090b", border: "1px solid rgba(255,255,255,0.08)" }} />
                    <Bar dataKey="value" fill="#c4ff39" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ChartFallback />
              )}
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-white">Split consistency</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {breakdown.splits.map(([name, value]) => (
                    <Badge key={name} className="border border-white/10 bg-white/5 text-zinc-300">
                      {name}: {value}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Muscle frequency</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {breakdown.muscles.map(([name, value]) => (
                    <Badge key={name} className="border border-lime-300/15 bg-lime-300/10 text-lime-100">
                      {name}: {value}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Personal records</CardTitle>
            <CardDescription className="text-zinc-300">
              Max weight and best estimated 1RM are tracked separately for each movement.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {personalRecords.map((record) => (
              <div key={record.name} className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <p className="font-medium text-white">{record.name}</p>
                <p className="mt-3 text-sm text-zinc-400">
                  Max weight: <span className="text-white">{Math.round(record.maxWeight)} {profile.weightUnit}</span>
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  Best est. 1RM: <span className="text-white">{Math.round(record.bestEstimatedOneRm)} {profile.weightUnit}</span>
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
