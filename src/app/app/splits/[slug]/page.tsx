import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SplitDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="space-y-4">
      <Button asChild variant="ghost">
        <Link href="/app/splits">
          <ArrowLeft className="size-4" />
          Back to splits
        </Link>
      </Button>
      <Card className="border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle>{slug.replace(/-/g, " ")}</CardTitle>
          <CardDescription className="text-zinc-300">
            Split editing is centered in the main split browser for this build, but deep links are
            reserved here for richer per-split editing next.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-zinc-400">
          Launch this split from the split browser to preload its day template into the active
          workout flow.
        </CardContent>
      </Card>
    </div>
  );
}
