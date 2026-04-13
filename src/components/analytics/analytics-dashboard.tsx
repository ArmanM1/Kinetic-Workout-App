"use client";

import { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  buildBodyRegionAnalytics,
  buildBodyWeightTrend,
  buildDashboardStats,
  buildFrequencyBreakdown,
  buildLoggedExerciseOptions,
  buildOneRmProgression,
  buildPersonalRecords,
  buildVolumeSeries,
  type BodyRegionId,
} from "@/lib/domain/analytics";
import { useHydrated } from "@/lib/hooks/use-hydrated";

function ChartFallback() {
  return <div className="h-full rounded-[1.4rem] border border-white/8 bg-white/[0.03]" />;
}

function formatDelta(value: number) {
  const rounded = Math.round(value * 100);

  if (!Number.isFinite(rounded) || rounded === 0) {
    return "0%";
  }

  return `${rounded > 0 ? "+" : ""}${rounded}%`;
}

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function AnalyticsDashboard() {
  const { bodyMetrics, catalog, history, profile } = useWorkoutStore();
  const isHydrated = useHydrated();
  const stats = buildDashboardStats(history, profile);
  const volumeSeries = buildVolumeSeries(history, profile);
  const breakdown = buildFrequencyBreakdown(history, catalog);
  const bodyWeightTrend = buildBodyWeightTrend(bodyMetrics);
  const loggedExerciseOptions = buildLoggedExerciseOptions(history);
  const bodyAnalytics = buildBodyRegionAnalytics(history, profile, catalog);
  const personalRecords = buildPersonalRecords(history, profile);
  const activeBodyDetails = bodyAnalytics.details.filter((detail) => detail.totalVolume > 0);
  const [selectedExerciseSlug, setSelectedExerciseSlug] = useState(
    loggedExerciseOptions[0]?.slug ?? "",
  );
  const [selectedBodyRegion, setSelectedBodyRegion] = useState<BodyRegionId>(
    activeBodyDetails[0]?.id ?? "chest",
  );
  const activeExerciseSlug = loggedExerciseOptions.some(
    (option) => option.slug === selectedExerciseSlug,
  )
    ? selectedExerciseSlug
    : loggedExerciseOptions[0]?.slug ?? "";
  const activeBodyRegion = activeBodyDetails.some(
    (detail) => detail.id === selectedBodyRegion,
  )
    ? selectedBodyRegion
    : activeBodyDetails[0]?.id ?? bodyAnalytics.details[0]?.id ?? "chest";

  const focusExercise = loggedExerciseOptions.find(
    (option) => option.slug === activeExerciseSlug,
  );
  const oneRmSeries = buildOneRmProgression(history, activeExerciseSlug, profile);
  const selectedBodyDetail =
    bodyAnalytics.details.find((detail) => detail.id === activeBodyRegion) ??
    activeBodyDetails[0] ??
    bodyAnalytics.details[0];

  return (
    <Tabs defaultValue="overview" className="space-y-5">
      <TabsList className="w-full rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-1">
        <TabsTrigger
          value="overview"
          className="rounded-[1rem] px-4 text-[12px] font-semibold tracking-[0.22em] uppercase data-[state=active]:bg-lime-300 data-[state=active]:text-black"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="body"
          className="rounded-[1rem] px-4 text-[12px] font-semibold tracking-[0.22em] uppercase data-[state=active]:bg-lime-300 data-[state=active]:text-black"
        >
          Body
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-5">
        <section className="grid gap-3 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="ios-card rounded-[1.6rem] border-white/8 bg-white/[0.04] text-white"
            >
              <CardHeader className="space-y-2 p-4">
                <p className="text-[11px] tracking-[0.24em] text-zinc-500 uppercase">
                  {stat.label}
                </p>
                <CardTitle className="text-[1.85rem]">{stat.value}</CardTitle>
                <p className="text-xs text-zinc-400">{stat.hint}</p>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
          <Card className="ios-card rounded-[1.75rem] border-white/8 bg-white/[0.04] text-white">
            <CardHeader className="flex flex-row items-start justify-between gap-3 p-5 pb-2">
              <div>
                <CardTitle className="text-lg">Volume</CardTitle>
                <p className="mt-1 text-xs text-zinc-400">Resolved load across completed sessions.</p>
              </div>
              <Badge className="border border-lime-300/20 bg-lime-300/10 text-lime-100">
                {volumeSeries.length} logs
              </Badge>
            </CardHeader>
            <CardContent className="h-72 p-4 pt-2">
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
                    <XAxis dataKey="label" stroke="#71717a" tickLine={false} axisLine={false} />
                    <YAxis stroke="#71717a" tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "#09090b",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "16px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="volume"
                      stroke="#c4ff39"
                      fill="url(#volumeFill)"
                      strokeWidth={2.5}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <ChartFallback />
              )}
            </CardContent>
          </Card>

          <Card className="ios-card rounded-[1.75rem] border-white/8 bg-white/[0.04] text-white">
            <CardHeader className="flex flex-row items-start justify-between gap-3 p-5 pb-2">
              <div>
                <CardTitle className="text-lg">E1RM</CardTitle>
                <p className="mt-1 text-xs text-zinc-400">
                  Best set per session for the selected movement.
                </p>
              </div>
              <Select value={activeExerciseSlug} onValueChange={setSelectedExerciseSlug}>
                <SelectTrigger
                  size="sm"
                  className="h-8 min-w-0 rounded-full border-white/8 bg-black/25 px-3 text-[11px] text-white shadow-none"
                >
                  <SelectValue placeholder="Lift" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-white/8 bg-[#090b10] text-white">
                  {loggedExerciseOptions.map((option) => (
                    <SelectItem key={option.slug} value={option.slug}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="space-y-3 p-4 pt-2">
              {focusExercise ? (
                <div className="flex items-center justify-between rounded-[1.1rem] border border-white/8 bg-black/20 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-white">{focusExercise.name}</p>
                    <p className="text-[11px] text-zinc-500">
                      {focusExercise.sessionCount} logged sessions
                    </p>
                  </div>
                  <Badge className="border border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
                    {profile.weightUnit}
                  </Badge>
                </div>
              ) : null}
              <div className="h-56">
                {isHydrated && oneRmSeries.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={oneRmSeries}>
                      <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                      <XAxis dataKey="label" stroke="#71717a" tickLine={false} axisLine={false} />
                      <YAxis stroke="#71717a" tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          background: "#09090b",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "16px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#60a5fa"
                        strokeWidth={3}
                        dot={{ fill: "#c4ff39", strokeWidth: 0, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <ChartFallback />
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="ios-card rounded-[1.75rem] border-white/8 bg-white/[0.04] text-white">
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-lg">Bodyweight</CardTitle>
              <p className="mt-1 text-xs text-zinc-400">Optional body metrics for trend context.</p>
            </CardHeader>
            <CardContent className="h-72 p-4 pt-2">
              {isHydrated && bodyWeightTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bodyWeightTrend}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                    <XAxis dataKey="label" stroke="#71717a" tickLine={false} axisLine={false} />
                    <YAxis stroke="#71717a" tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "#09090b",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "16px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#c4ff39"
                      strokeWidth={3}
                      dot={{ fill: "#c4ff39", strokeWidth: 0, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <ChartFallback />
              )}
            </CardContent>
          </Card>

          <Card className="ios-card rounded-[1.75rem] border-white/8 bg-white/[0.04] text-white">
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-lg">Frequency</CardTitle>
              <p className="mt-1 text-xs text-zinc-400">Most repeated lifts and split cadence.</p>
            </CardHeader>
            <CardContent className="grid gap-4 p-4 pt-2 lg:grid-cols-[0.72fr_0.28fr]">
              <div className="h-60">
                {isHydrated ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={breakdown.exercises.map(([name, value]) => ({ name, value }))}>
                      <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                      <XAxis dataKey="name" stroke="#71717a" hide />
                      <YAxis stroke="#71717a" tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          background: "#09090b",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "16px",
                        }}
                      />
                      <Bar dataKey="value" fill="#c4ff39" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <ChartFallback />
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] tracking-[0.24em] text-zinc-500 uppercase">Splits</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {breakdown.splits.map(([name, value]) => (
                      <Badge key={name} className="border border-white/8 bg-black/20 text-zinc-300">
                        {name}: {value}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.24em] text-zinc-500 uppercase">Muscles</p>
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
          <Card className="ios-card rounded-[1.75rem] border-white/8 bg-white/[0.04] text-white">
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-lg">Personal records</CardTitle>
              <p className="mt-1 text-xs text-zinc-400">Weight and estimated max stay separate.</p>
            </CardHeader>
            <CardContent className="grid gap-3 p-4 pt-2 md:grid-cols-2 xl:grid-cols-3">
              {personalRecords.map((record) => (
                <div
                  key={record.name}
                  className="rounded-[1.25rem] border border-white/8 bg-black/20 p-4"
                >
                  <p className="font-medium text-white">{record.name}</p>
                  <p className="mt-3 text-sm text-zinc-400">
                    Max:{" "}
                    <span className="text-white">
                      {Math.round(record.maxWeight)} {profile.weightUnit}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    E1RM:{" "}
                    <span className="text-white">
                      {Math.round(record.bestEstimatedOneRm)} {profile.weightUnit}
                    </span>
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </TabsContent>

      <TabsContent value="body" className="space-y-5">
        <section className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {activeBodyDetails.map((detail) => (
            <button
              key={detail.id}
              type="button"
              onClick={() => setSelectedBodyRegion(detail.id)}
              className={`lift-tap min-w-[8.5rem] rounded-[1.35rem] border px-4 py-3 text-left transition ${
                activeBodyRegion === detail.id
                  ? "border-lime-300/60 bg-lime-300/14 text-white shadow-[0_0_0_1px_rgba(196,255,57,0.2)]"
                  : "border-white/8 bg-white/[0.03] text-zinc-300"
              }`}
            >
              <p className="text-sm font-semibold">{detail.label}</p>
              <p className="mt-1 text-[11px] text-zinc-500">
                {detail.sessionCount} touches
              </p>
              <p className="mt-3 text-base font-semibold text-white">
                {detail.totalVolume.toLocaleString()}
              </p>
            </button>
          ))}
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="ios-card rounded-[1.6rem] border-white/8 bg-white/[0.04] text-white">
            <CardHeader className="space-y-2 p-4">
              <p className="text-[11px] tracking-[0.24em] text-zinc-500 uppercase">Total volume</p>
              <CardTitle className="text-[1.65rem]">
                {selectedBodyDetail.totalVolume.toLocaleString()} {profile.weightUnit}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="ios-card rounded-[1.6rem] border-white/8 bg-white/[0.04] text-white">
            <CardHeader className="space-y-2 p-4">
              <p className="text-[11px] tracking-[0.24em] text-zinc-500 uppercase">Balance score</p>
              <CardTitle className="text-[1.65rem]">{selectedBodyDetail.balanceScore}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="ios-card rounded-[1.6rem] border-white/8 bg-white/[0.04] text-white">
            <CardHeader className="space-y-2 p-4">
              <p className="text-[11px] tracking-[0.24em] text-zinc-500 uppercase">Progress</p>
              <CardTitle
                className={`text-[1.65rem] ${
                  selectedBodyDetail.progressDelta >= 0 ? "text-cyan-300" : "text-rose-300"
                }`}
              >
                {formatDelta(selectedBodyDetail.progressDelta)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="ios-card rounded-[1.6rem] border-white/8 bg-white/[0.04] text-white">
            <CardHeader className="space-y-2 p-4">
              <p className="text-[11px] tracking-[0.24em] text-zinc-500 uppercase">Training share</p>
              <CardTitle className="text-[1.65rem]">
                {formatPercent(selectedBodyDetail.shareOfTraining)}
              </CardTitle>
            </CardHeader>
          </Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.04fr_0.96fr]">
          <Card className="ios-card rounded-[1.75rem] border-white/8 bg-white/[0.04] text-white">
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-lg">{selectedBodyDetail.label} progress</CardTitle>
              <p className="mt-1 text-xs text-zinc-400">
                Session-by-session volume targeting this body part.
              </p>
            </CardHeader>
            <CardContent className="h-72 p-4 pt-2">
              {isHydrated ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedBodyDetail.series}>
                    <defs>
                      <linearGradient id="bodyRegionFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                    <XAxis dataKey="label" stroke="#71717a" tickLine={false} axisLine={false} />
                    <YAxis stroke="#71717a" tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "#09090b",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "16px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="volume"
                      stroke="#60a5fa"
                      fill="url(#bodyRegionFill)"
                      strokeWidth={2.5}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <ChartFallback />
              )}
            </CardContent>
          </Card>

          <Card className="ios-card rounded-[1.75rem] border-white/8 bg-white/[0.04] text-white">
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-lg">Top lifts</CardTitle>
              <p className="mt-1 text-xs text-zinc-400">
                Ranked by max logged weight for {selectedBodyDetail.label.toLowerCase()}.
              </p>
            </CardHeader>
            <CardContent className="space-y-3 p-4 pt-2">
              {selectedBodyDetail.lifts.map((lift, index) => (
                <div
                  key={lift.slug}
                  className="rounded-[1.2rem] border border-white/8 bg-black/20 px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {index + 1}. {lift.name}
                      </p>
                      <p className="mt-1 text-[11px] text-zinc-500">
                        Volume {Math.round(lift.totalVolume).toLocaleString()} {profile.weightUnit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">
                        {Math.round(lift.maxWeight)} {profile.weightUnit}
                      </p>
                      <p className="mt-1 text-[11px] text-cyan-300">
                        E1RM {Math.round(lift.bestEstimatedOneRm)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </TabsContent>
    </Tabs>
  );
}
