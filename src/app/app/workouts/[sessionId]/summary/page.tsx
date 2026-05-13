import { WorkoutSummaryClient } from "@/components/workout/workout-summary-client";

export default async function WorkoutSummaryPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  return <WorkoutSummaryClient sessionId={sessionId} />;
}
