export interface PostMeta {
    slug: string;
    title: string;
    date: string;
    description?: string;
    tags?: string[];
    image?: string;
    draft?: boolean;
}

export interface Post {
    meta: PostMeta;
    content: string;
}

export interface PaginationResult {
    items: PostMeta[];
    totalPages: number;
    currentPage: number;
    hasNext: boolean;
    hasPrev: boolean;
}