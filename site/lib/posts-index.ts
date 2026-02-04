/**
 * Post metadata index - imports from generated artifacts
 * This is the single source of truth for post metadata in the app
 */

import type { PostMetadata } from "@/generated/posts-index";
import { postsIndex, getPostBySlug as getPostMetadataBySlug } from "@/generated/posts-index";

// Legacy interface - still used by some existing components
export interface PostMeta {
    slug: string;
    title: string;
    date: string;
    description: string;
    image?: string;
    tags?: string[];
    readingTime: string;
}

export interface Post {
    meta: PostMeta;
    content: string; // Not used - content comes from MDX import
}

export interface PaginationResult {
    items: PostMetadata[];
    totalPages: number;
    currentPage: number;
    hasNext: boolean;
    hasPrev: boolean;
}

const PAGE_SIZE = 20;

/**
 * Get all post metadata (already sorted by date descending)
 */
export async function getAllPostMeta(): Promise<PostMetadata[]> {
    return postsIndex;
}

/**
 * Get post metadata by slug
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
    const metadata = getPostMetadataBySlug(slug);
    if (!metadata) return null;

    // Convert to legacy format for backward compatibility
    const legacyMeta: PostMeta = {
        ...metadata,
        tags: metadata.tags?.map(t => t.display)
    };

    return {
        meta: legacyMeta,
        content: "", // Content is accessed via MDX import in the page component
    };
}

/**
 * Get all slugs for static generation
 */
export async function getAllSlugs(): Promise<string[]> {
    return postsIndex.map((post) => post.slug);
}

/**
 * Get total number of pages for pagination
 */
export async function getTotalPages(pageSize: number = PAGE_SIZE): Promise<number> {
    return Math.ceil(postsIndex.length / pageSize);
}

/**
 * Get paginated post metadata
 */
export async function getPostMetaPage(
    page: number,
    pageSize: number = PAGE_SIZE
): Promise<PaginationResult> {
    const totalPages = Math.ceil(postsIndex.length / pageSize);

    // Validate page number
    if (page < 1 || page > totalPages) {
        return {
            items: [],
            totalPages,
            currentPage: page,
            hasNext: false,
            hasPrev: false,
        };
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = postsIndex.slice(startIndex, endIndex);

    return {
        items,
        totalPages,
        currentPage: page,
        hasNext: page < totalPages,
        hasPrev: page > 1,
    };
}
