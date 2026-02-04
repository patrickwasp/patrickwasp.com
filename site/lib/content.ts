import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_PATH = path.join(process.cwd(), "content/posts");

function parseFrontmatter(fileContent: string): {
    data: Record<string, unknown>;
    content: string;
} {
    const { data, content } = matter(fileContent);
    return { data: data as Record<string, unknown>, content };
}

export interface PostFrontmatter {
    title: string;
    date: string;
    description: string;
    image?: string;
    tags?: string[];
    draft?: boolean;
}

export interface Post {
    slug: string;
    frontmatter: PostFrontmatter;
    content: string;
    readingTime: string;
}

export interface PostMeta {
    slug: string;
    frontmatter: PostFrontmatter;
    readingTime: string;
}

function parsePostFrontmatter(data: Record<string, unknown>, slug: string): PostFrontmatter {
    const title = typeof data.title === "string" ? data.title.trim() : "";
    const date = typeof data.date === "string" ? data.date.trim() : "";
    const description = typeof data.description === "string" ? data.description.trim() : "";

    if (!title || !date || !description) {
        const missing = [
            !title ? "title" : null,
            !date ? "date" : null,
            !description ? "description" : null,
        ].filter(Boolean);

        throw new Error(
            `Post '${slug}' is missing required frontmatter fields: ${missing.join(", ")}. ` +
            `Expected:\n---\ntitle: ...\ndate: YYYY-MM-DD\ndescription: ...\n---`,
        );
    }

    const image = typeof data.image === "string" ? data.image.trim() : undefined;
    const tags = Array.isArray(data.tags) ? data.tags.filter((t): t is string => typeof t === "string") : undefined;
    const draft = typeof data.draft === "boolean" ? data.draft : undefined;

    return {
        title,
        date,
        description,
        image,
        tags,
        draft,
    };
}

function calculateReadingTime(content: string): string {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
    return `${minutes} min read`;
}

export function getPostSlugs(): string[] {
    if (!fs.existsSync(POSTS_PATH)) {
        return [];
    }

    return fs.readdirSync(POSTS_PATH).filter((name) => {
        const postPath = path.join(POSTS_PATH, name);
        return fs.statSync(postPath).isDirectory() && fs.existsSync(path.join(postPath, "index.mdx"));
    });
}

export function getPostBySlug(slug: string): Post | null {
    const fullPath = path.join(POSTS_PATH, slug, "index.mdx");
    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = parseFrontmatter(fileContents);

    return {
        slug,
        frontmatter: parsePostFrontmatter(data, slug),
        content,
        readingTime: calculateReadingTime(content),
    };
}

export function getAllPosts(includeDrafts = false): PostMeta[] {
    const slugs = getPostSlugs();

    return slugs
        .map((slug) => {
            const post = getPostBySlug(slug);
            if (!post) return null;
            return {
                slug: post.slug,
                frontmatter: post.frontmatter,
                readingTime: post.readingTime,
            };
        })
        .filter((post): post is PostMeta => {
            if (!post) return false;
            if (!includeDrafts && post.frontmatter.draft) return false;
            return true;
        })
        .sort((a, b) => {
            return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
        });
}
