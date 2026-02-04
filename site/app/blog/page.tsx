"use client";

import { Suspense } from "react";
import { postsIndex, getAllTags } from "@/generated/posts-index";
import { PostList } from "@/components/blog/PostList";
import { BlogFilter, BlogPagination } from "@/components/blog/BlogFilter";
import { useSearchParams, useRouter } from "next/navigation";

function BlogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const allTags = getAllTags();
  const activeTag = searchParams.get("tag") || "all";
  const searchQuery = searchParams.get("q") || "";
  const currentPage = parseInt(searchParams.get("page") || "1");
  const PAGE_SIZE = 10;

  // Filter posts by tag
  let filteredPosts = postsIndex;
  if (activeTag !== "all") {
    filteredPosts = postsIndex.filter((post) =>
      post.tags?.some((t) => t.slug === activeTag)
    );
  }

  // Apply search filter
  if (searchQuery) {
    const normalizedQuery = searchQuery.toLowerCase().trim();
    const tokens = normalizedQuery.split(" ").filter(Boolean);

    filteredPosts = filteredPosts.filter((post) => {
      return tokens.every((token) => post.searchText.includes(token));
    });
  }

  // Apply pagination
  const totalPages = Math.ceil(filteredPosts.length / PAGE_SIZE);
  const validPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const startIndex = (validPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage > 1) {
      params.set("page", newPage.toString());
    } else {
      params.delete("page");
    }
    const newUrl = params.toString() ? `/blog?${params.toString()}` : "/blog";
    router.push(newUrl, { scroll: false });
  };

  return (
    <>
      <BlogFilter
        allPosts={postsIndex}
        allTags={allTags}
        topTagCount={3}
        excludeTags={["placeholder", "testing"]}
        minTagCount={1}
      />
      <PostList posts={paginatedPosts} />
      <BlogPagination
        currentPage={validPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
      <Suspense
        fallback={
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        }
      >
        <BlogContent />
      </Suspense>
    </div>
  );
}
