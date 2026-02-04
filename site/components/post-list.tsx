import Link from "next/link";
import type { PostMeta } from "@/lib/posts/types";

export function PostList({ posts }: { posts: PostMeta[] }) {
    if (posts.length === 0) {
        return <p className="text-sm text-muted-foreground">No posts yet.</p>;
    }

    return (
        <ul className="space-y-6">
            {posts.map((post) => (
                <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`} className="flex gap-4 group">
                        {post.image && (
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-24 h-24 object-cover rounded flex-shrink-0"
                            />
                        )}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-medium group-hover:underline underline-offset-4">
                                {post.title}
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground leading-6">
                                {post.description}
                            </p>
                            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                                <time dateTime={post.date}>{formatDate(post.date)}</time>
                            </div>
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    );
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}
