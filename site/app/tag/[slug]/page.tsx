import { redirect } from "next/navigation";
import { getAllTags } from "@/generated/posts-index";

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({
    slug: tag.slug,
  }));
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  redirect(`/blog?tag=${slug}`);
}
