import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs } from "@/lib/posts";
import { getPostBySlug as getPostMetadataBySlug } from "@/generated/posts-index";
import { siteConfig } from "@/site.config";
import { Giscus } from "@/components/giscus";

export const dynamic = "force-static";
export const dynamicParams = false;

interface PostPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const slugs = await getAllSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostMetadataBySlug(slug);

    if (!post) {
        return {
            title: "Post Not Found"
        };
    }

    return {
        title: post.title,
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            type: "article",
            publishedTime: post.date,
            url: `${siteConfig.url}/blog/${slug}`,
            images: post.image ? [{ url: post.image }] : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.description,
            images: post.image ? [post.image] : undefined,
        },
    };
}

export default async function PostPage({ params }: PostPageProps) {
    const { slug } = await params;
    const post = getPostMetadataBySlug(slug);

    if (!post) {
        notFound();
    }

    // Dynamically import the MDX module from generated/posts
    const { default: Post } = await import(
        `@/generated/posts/${slug}/index.mdx`
    );

    return (
        <article className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
            <header className="mb-12">
                {post.image && (
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-auto rounded-lg mb-8 aspect-video object-cover"
                    />
                )}

                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-balance">
                    {post.title}
                </h1>

                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                    <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </time>
                    <span>•</span>
                    <span>{post.readingTime}</span>
                </div>

                {post.description && (
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                        {post.description}
                    </p>
                )}

                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                        {post.tags.map((tag) => (
                            <Link
                                key={tag.slug}
                                href={`/tag/${tag.slug}`}
                                className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-700 dark:text-gray-300 transition-colors"
                            >
                                {tag.display}
                            </Link>
                        ))}
                    </div>
                )}
            </header>

            <div className="prose prose-lg dark:prose-invert max-w-none">
                <Post />
            </div>

            <hr className="my-12 border-gray-200 dark:border-gray-700" />
            <Giscus />
        </article>
    );
}
