"use client";

import { useState } from "react";

import { signOutAction } from "@/actions/auth";
import { useWorkoutStore } from "@/components/providers/workout-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function SettingsPanel() {
  const {
    activeSession,
    bodyMetrics,
    history,
    profile,
    settings,
    updateProfile,
    updateSettings,
  } = useWorkoutStore();
  const [resetLabel, setResetLabel] = useState("Reset all user data");

  function exportData() {
    const payload = {
      exportedAt: new Date().toISOString(),
      profile,
      settings,
      bodyMetrics,
      history,
      activeSession,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "kinetic-export.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
      <Card className="border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle>Profile and recovery</CardTitle>
          <CardDescription className="text-zinc-300">
            Weight units, bodyweight, and rest timing feed the app’s assisted-load and recovery
            behavior.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="display-name">Display name</Label>
            <Input
              id="display-name"
              value={profile.displayName}
              onChange={(event) => updateProfile({ displayName: event.target.value })}
              className="border-white/10 bg-black/20 text-white"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="weight-unit">Weight unit</Label>
              <Select
                value={settings.weightUnit}
                onValueChange={(value) =>
                  updateSettings({ weightUnit: value as "lb" | "kg" })
                }
              >
                <SelectTrigger id="weight-unit" className="border-white/10 bg-black/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lb">Pounds</SelectItem>
                  <SelectItem value="kg">Kilograms</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="body-weight">Body weight</Label>
              <Input
                id="body-weight"
                value={profile.bodyWeight ?? ""}
                onChange={(event) =>
                  updateProfile({
                    bodyWeight:
                      event.target.value.trim() === "" ? null : Number(event.target.value),
                  })
                }
                className="border-white/10 bg-black/20 text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 p-4">
            <div>
              <p className="font-medium text-white">Auto-start rest timer</p>
              <p className="mt-1 text-sm text-zinc-400">
                Turning this off leaves set logging intact but stops the floating timer.
              </p>
            </div>
            <Switch
              checked={settings.restTimerEnabled}
              onCheckedChange={(checked) => updateSettings({ restTimerEnabled: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rest-timer">Default rest timer seconds</Label>
            <Input
              id="rest-timer"
              value={settings.restTimerSeconds}
              onChange={(event) =>
                updateSettings({ restTimerSeconds: Number(event.target.value || "0") })
              }
              className="border-white/10 bg-black/20 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="donation-url">Donation link</Label>
            <Input
              id="donation-url"
              value={settings.donationUrl}
              onChange={(event) => updateSettings({ donationUrl: event.target.value })}
              className="border-white/10 bg-black/20 text-white"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle>Safety and export</CardTitle>
          <CardDescription className="text-zinc-300">
            Export your data, sign out, or clear the local demo state while env wiring is still in
            progress.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
            <p className="font-medium text-white">Account status</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge className="border border-lime-300/20 bg-lime-300/10 text-lime-100">
                Email/password
              </Badge>
              <Badge className="border border-white/10 bg-white/5 text-zinc-300">
                Anonymous auth disabled
              </Badge>
            </div>
          </div>

          <Button className="w-full bg-lime-300 text-zinc-950 hover:bg-lime-200" onClick={exportData}>
            Export data
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              localStorage.removeItem("kinetic-store-v1");
              setResetLabel("Local data cleared — refresh to reseed demo state");
            }}
          >
            {resetLabel}
          </Button>

          <form action={signOutAction}>
            <Button variant="ghost" className="w-full">
              Sign out
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
