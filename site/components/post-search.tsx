"use client";

import * as React from "react";
import type { PostMeta } from "@/lib/posts/types";
import { PostList } from "@/components/post-list";

export function PostSearch({ posts }: { posts: PostMeta[] }) {
    const [query, setQuery] = React.useState("");

    const filtered = React.useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return posts;

        return posts.filter((p) => {
            const haystack = [
                p.title,
                p.description ?? "",
                ...(p.tags ?? []),
            ]
                .join(" ")
                .toLowerCase();

            return haystack.includes(q);
        });
    }, [posts, query]);

    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="post-search" className="sr-only">
                    Search posts
                </label>
                <input
                    id="post-search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search posts…"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:-outline-offset-2"
                />
            </div>

            <PostList posts={filtered} />
        </div>
    );
}
