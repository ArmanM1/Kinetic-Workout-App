import { SplitDetail } from "@/components/splits/split-detail";

export default async function SplitDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <SplitDetail slug={slug} />;
}
