"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, PlusCircle } from "lucide-react";

import { useWorkoutStore } from "@/components/providers/workout-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toSplitSlug } from "@/lib/splits";

export function SplitBrowser() {
  const { createSplit, splits } = useWorkoutStore();
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
            <CardHeader className="space-y-4">
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
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {split.days.map((day) => (
                  <span
                    key={day.id}
                    className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-sm text-zinc-300"
                  >
                    {day.name}
                  </span>
                ))}
              </div>
              <Button asChild className="w-full bg-lime-300 text-zinc-950 hover:bg-lime-200">
                <Link href={`/app/splits/${toSplitSlug(split.name)}`}>
                  Open Split
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
