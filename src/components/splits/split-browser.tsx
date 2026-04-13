"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, PlusCircle } from "lucide-react";

import { useWorkoutStore } from "@/components/providers/workout-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SplitBrowser() {
  const router = useRouter();
  const { createSplit, splits, startSplitDaySession } = useWorkoutStore();
  const [name, setName] = useState("");
  const [focus, setFocus] = useState("");

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle>Create split</CardTitle>
          <CardDescription className="text-zinc-300">
            This quick creator seeds a starter day from your favorites so you can edit and launch
            something usable immediately.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <div className="space-y-2">
            <Label htmlFor="split-name">Split name</Label>
            <Input
              id="split-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="border-white/10 bg-black/20 text-white"
              placeholder="Upper / Lower Rotation"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="split-focus">Focus</Label>
            <Input
              id="split-focus"
              value={focus}
              onChange={(event) => setFocus(event.target.value)}
              className="border-white/10 bg-black/20 text-white"
              placeholder="Heavy pressing with fast accessories"
            />
          </div>
          <Button
            className="bg-lime-300 text-zinc-950 hover:bg-lime-200"
            onClick={() => {
              if (!name.trim() || !focus.trim()) {
                return;
              }

              createSplit(name.trim(), focus.trim());
              setName("");
              setFocus("");
            }}
          >
            <PlusCircle className="size-4" />
            Create split
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {splits.map((split) => (
          <Card key={split.id} className="border-white/10 bg-white/5 text-white">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>{split.name}</CardTitle>
                  <CardDescription className="mt-2 text-zinc-300">
                    {split.description}
                  </CardDescription>
                </div>
                {split.isDefault ? (
                  <Badge className="border border-lime-300/20 bg-lime-300/10 text-lime-100">
                    Default
                  </Badge>
                ) : null}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {split.days.map((day) => (
                <div
                  key={day.id}
                  className="rounded-2xl border border-white/8 bg-black/20 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-white">{day.name}</p>
                      <p className="mt-1 text-sm text-zinc-400">{day.focus}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {day.exercises.map((exercise) => (
                          <Badge
                            key={exercise.id}
                            variant="outline"
                            className="border-white/10 bg-white/5 text-zinc-300"
                          >
                            {exercise.setCount}x {exercise.exerciseSlug.replace(/-/g, " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        startSplitDaySession(split.id, day.id);
                        router.push("/app/active-workout");
                      }}
                    >
                      Start
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
