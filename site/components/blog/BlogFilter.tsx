"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { PostMetadata } from "@/generated/posts-index";

interface BlogFilterProps {
  allPosts: PostMetadata[];
  allTags: Array<{ slug: string; display: string; count: number }>;
  topTagCount?: number;
  excludeTags?: string[];
  minTagCount?: number;
}

function normalizeQuery(query: string): string {
  return query.toLowerCase().trim().replace(/\s+/g, " ");
}

function searchPosts(posts: PostMetadata[], query: string): PostMetadata[] {
  if (!query) return posts;

  const normalizedQuery = normalizeQuery(query);
  const tokens = normalizedQuery.split(" ").filter(Boolean);

  if (tokens.length === 0) return posts;

  return posts.filter((post) => {
    const allTokensMatch = tokens.every((token) =>
      post.searchText.includes(token)
    );
    return allTokensMatch;
  });
}

export function BlogFilter({
  allPosts,
  allTags,
  topTagCount = 7,
  excludeTags = ["placeholder", "testing"],
  minTagCount = 1,
}: BlogFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const morePanelRef = useRef<HTMLDivElement>(null);

  const PAGE_SIZE = 10;

  // Get state from URL
  const activeTag = searchParams.get("tag") || "all";
  const searchQuery = searchParams.get("q") || "";
  const currentPage = parseInt(searchParams.get("page") || "1");
  const [inputValue, setInputValue] = useState(searchQuery);

  // Update input when URL changes
  useEffect(() => {
    setInputValue(searchParams.get("q") || "");
  }, [searchParams]);

  // Filter eligible tags
  const eligibleTags = useMemo(
    () =>
      allTags.filter(
        (tag) =>
          tag.count >= minTagCount && !excludeTags.includes(tag.slug)
      ),
    [allTags, minTagCount, excludeTags]
  );

  // Get top tags for main row
  const topTags = useMemo(
    () => eligibleTags.slice(0, topTagCount),
    [eligibleTags, topTagCount]
  );

  // Filter posts by tag
  const tagFilteredPosts = useMemo(() => {
    if (activeTag === "all") return allPosts;
    return allPosts.filter((post) =>
      post.tags?.some((t) => t.slug === activeTag)
    );
  }, [allPosts, activeTag]);

  // Apply search filter
  const filteredPosts = useMemo(
    () => searchPosts(tagFilteredPosts, searchQuery),
    [tagFilteredPosts, searchQuery]
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / PAGE_SIZE);
  const validPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const startIndex = (validPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  // Filter tags for "More" panel
  const filteredTagsForPanel = useMemo(() => {
    if (!tagSearchQuery) return eligibleTags;
    const query = normalizeQuery(tagSearchQuery);
    return eligibleTags.filter(
      (tag) =>
        tag.display.toLowerCase().includes(query) ||
        tag.slug.includes(query)
    );
  }, [eligibleTags, tagSearchQuery]);

  // Update URL when filters change
  const updateFilters = (newTag?: string, newQuery?: string, newPage?: number) => {
    const params = new URLSearchParams();
    const tag = newTag !== undefined ? newTag : activeTag;
    const query = newQuery !== undefined ? newQuery : searchQuery;
    const page = newPage !== undefined ? newPage : validPage;

    if (tag && tag !== "all") {
      params.set("tag", tag);
    }
    if (query) {
      params.set("q", query);
    }
    if (page > 1) {
      params.set("page", page.toString());
    }

    const newUrl = params.toString() ? `/blog?${params.toString()}` : "/blog";
    router.replace(newUrl, { scroll: false });
  };

  // Handle tag selection
  const handleTagClick = (tagSlug: string) => {
    updateFilters(tagSlug, undefined, 1);
    setIsMoreOpen(false);
  };

  // Handle search with debounce
  useEffect(() => {
    // Only update if input value differs from current search query
    if (inputValue.trim() === searchQuery) return;

    const timeoutId = setTimeout(() => {
      updateFilters(undefined, inputValue.trim(), 1);
    }, 300);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  // Close panel on outside click
  useEffect(() => {
    if (!isMoreOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        morePanelRef.current &&
        !morePanelRef.current.contains(event.target as Node) &&
        moreButtonRef.current &&
        !moreButtonRef.current.contains(event.target as Node)
      ) {
        setIsMoreOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMoreOpen]);

  // Handle ESC key
  useEffect(() => {
    if (!isMoreOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMoreOpen(false);
        moreButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMoreOpen]);

  // Trap focus in panel when open
  useEffect(() => {
    if (!isMoreOpen || !morePanelRef.current) return;

    const panel = morePanelRef.current;
    const focusableElements = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    panel.addEventListener("keydown", handleTab);
    firstElement?.focus();

    return () => panel.removeEventListener("keydown", handleTab);
  }, [isMoreOpen]);

  return (
    <>
      {/* Filter Row */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        {/* Tag Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleTagClick("all")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTag === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:bg-muted"
              }`}
            aria-pressed={activeTag === "all"}
          >
            All
          </button>

          {topTags.map((tag) => (
            <button
              key={tag.slug}
              onClick={() => handleTagClick(tag.slug)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTag === tag.slug
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-muted"
                }`}
              aria-pressed={activeTag === tag.slug}
            >
              {tag.display}
            </button>
          ))}

          {eligibleTags.length > topTagCount && (
            <div className="relative">
              <button
                ref={moreButtonRef}
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
                aria-expanded={isMoreOpen}
                aria-label="Show all tags"
              >
                More
                <svg
                  className={`w-4 h-4 transition-transform ${isMoreOpen ? "rotate-180" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* More Panel */}
              {isMoreOpen && (
                <>
                  {/* Mobile backdrop */}
                  <div className="fixed inset-0 bg-black/50 z-40 sm:hidden" />

                  {/* Panel */}
                  <div
                    ref={morePanelRef}
                    className="fixed sm:absolute bottom-0 left-0 right-0 sm:bottom-auto sm:left-auto sm:right-auto sm:top-full sm:mt-2 sm:min-w-[300px] sm:max-w-md bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-lg shadow-2xl z-50 max-h-[70vh] sm:max-h-96 flex flex-col"
                    role="dialog"
                    aria-label="All tags"
                  >
                    {/* Mobile handle */}
                    <div className="sm:hidden w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mt-3 mb-2" />

                    {/* Header with search */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          All Tags
                        </h3>
                        <button
                          onClick={() => setIsMoreOpen(false)}
                          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1"
                          aria-label="Close"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <input
                        type="search"
                        value={tagSearchQuery}
                        onChange={(e) => setTagSearchQuery(e.target.value)}
                        placeholder="Search tags..."
                        className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        aria-label="Search tags"
                      />
                    </div>

                    {/* Tag list */}
                    <div className="overflow-y-auto p-4">
                      {filteredTagsForPanel.length === 0 ? (
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
                          No tags found
                        </p>
                      ) : (
                        <div className="space-y-1">
                          {filteredTagsForPanel.map((tag) => (
                            <button
                              key={tag.slug}
                              onClick={() => handleTagClick(tag.slug)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${activeTag === tag.slug
                                ? "bg-secondary text-secondary-foreground font-medium"
                                : "hover:bg-muted text-muted-foreground"
                                }`}
                            >
                              <span>{tag.display}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {tag.count}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <input
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search posts..."
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Search posts"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Results summary */}
      {(activeTag !== "all" || searchQuery) && (
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>
            {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
          </span>
          {(activeTag !== "all" || searchQuery) && (
            <button
              onClick={() => {
                updateFilters("all", "", 1);
                setInputValue("");
              }}
              className="text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Pass paginated posts to children */}
      <div className="blog-filter-results">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No posts found matching your filters.
            </p>
            <button
              onClick={() => {
                updateFilters("all", "", 1);
                setInputValue("");
              }}
              className="text-primary hover:underline font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="filtered-posts" data-posts={JSON.stringify(paginatedPosts)} />
        )}
      </div>
    </>
  );
}

// Pagination component
interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function BlogPagination({ currentPage, totalPages, onPageChange }: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Previous page"
      >
        Previous
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          const showPage =
            page === 1 ||
            page === totalPages ||
            Math.abs(page - currentPage) <= 1;

          const showEllipsis =
            (page === currentPage - 2 && currentPage > 3) ||
            (page === currentPage + 2 && currentPage < totalPages - 2);

          if (showEllipsis) {
            return (
              <span
                key={page}
                className="px-2 text-gray-400 dark:text-gray-600"
              >
                …
              </span>
            );
          }

          if (!showPage) return null;

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[2.5rem] px-3 py-2 rounded-lg text-sm font-medium transition-colors ${page === currentPage
                ? "bg-primary text-primary-foreground"
                : "border border-border hover:bg-muted"
                }`}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
}
