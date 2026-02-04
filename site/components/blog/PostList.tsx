import Link from 'next/link';
import type { PostMetadata } from '@/generated/posts-index';

interface PostListProps {
    posts: PostMetadata[];
}

export function PostList({ posts }: PostListProps) {
    if (posts.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">No posts found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {posts.map((post) => (
                <article key={post.slug} className="border-b border-gray-200 dark:border-gray-700 pb-8">
                    <div className="flex gap-6">
                        {post.image && (
                            <Link href={`/blog/${post.slug}`} className="flex-shrink-0">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-48 h-32 object-cover rounded-lg"
                                />
                            </Link>
                        )}
                        <div className="flex-1 min-w-0">
                            <header className="mb-4">
                                <h2 className="text-2xl font-bold mb-2">
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="text-foreground hover:text-primary transition-colors"
                                    >
                                        {post.title}
                                    </Link>
                                </h2>
                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                    <time dateTime={post.date}>
                                        {new Date(post.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </time>
                                    {post.tags && post.tags.length > 0 && (
                                        <div className="flex gap-2">
                                            {post.tags.map((tag) => (
                                                <Link
                                                    key={tag.slug}
                                                    href={`/tag/${tag.slug}`}
                                                    className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1 rounded-full text-xs text-gray-700 dark:text-gray-300 transition-colors"
                                                >
                                                    {tag.display}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </header>

                            {post.description && (
                                <p className="text-gray-700 dark:text-gray-300 mb-4">
                                    {post.description}
                                </p>
                            )}

                            <Link
                                href={`/blog/${post.slug}`}
                                className="text-primary hover:underline font-medium"
                            >
                                Read more →
                            </Link>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}