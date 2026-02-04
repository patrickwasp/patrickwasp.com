// Re-export from posts-index for backward compatibility
export type { PostMeta, Post, PaginationResult } from '../posts-index';
export {
    getAllPostMeta,
    getPostBySlug,
    getAllSlugs,
    getTotalPages,
    getPostMetaPage,
} from '../posts-index';
