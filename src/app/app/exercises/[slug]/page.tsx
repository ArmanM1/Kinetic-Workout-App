import { ExerciseDetail } from "@/components/app/exercise-detail";

export default async function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <ExerciseDetail slug={slug} />;
}
