const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const POSTS_DIR = path.join(process.cwd(), "content/posts");
const GENERATED_DIR = path.join(process.cwd(), "generated");
const GENERATED_POSTS_DIR = path.join(GENERATED_DIR, "posts");
const METADATA_INDEX_PATH = path.join(GENERATED_DIR, "posts-index.ts");

function isDirectory(dirPath) {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}

function getPostSlugs() {
    if (!fs.existsSync(POSTS_DIR)) return [];
    return fs
        .readdirSync(POSTS_DIR)
        .filter((name) => isDirectory(path.join(POSTS_DIR, name)))
        .filter((name) => fs.existsSync(path.join(POSTS_DIR, name, "index.mdx")));
}

function slugifyTag(tag) {
    return tag
        .trim()
        .toLowerCase()
        .replace(/[\s_]+/g, "-")          // spaces and underscores to hyphens
        .replace(/[^\w\-]+/g, "")         // remove punctuation except hyphens
        .replace(/-+/g, "-")              // collapse multiple hyphens
        .replace(/^-|-$/g, "");           // trim leading/trailing hyphens
}

function calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
    return `${minutes} min read`;
}

function generateSearchText(content, frontmatter) {
    // Remove import/export lines
    let text = content.replace(/^(import|export)\s+.+$/gm, "");

    // Remove JSX tags while preserving inner text
    text = text.replace(/<[^>]+>/g, " ");

    // Remove code blocks
    text = text.replace(/```[\s\S]*?```/g, " ");
    text = text.replace(/`[^`]+`/g, " ");

    // Remove markdown links but keep text
    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

    // Remove markdown headings markers
    text = text.replace(/^#{1,6}\s+/gm, "");

    // Remove list markers
    text = text.replace(/^[\*\-]\s+/gm, "");
    text = text.replace(/^\d+\.\s+/gm, "");

    // Collapse whitespace
    text = text.replace(/\s+/g, " ").trim();

    // Extract tag display names
    const tagNames = frontmatter.tags ? frontmatter.tags.map(t => t.display).join(" ") : "";

    // Combine with frontmatter fields
    const parts = [
        frontmatter.title,
        frontmatter.description,
        tagNames,
        text
    ];

    return parts.join(" ").toLowerCase();
}

function normalizeDate(dateString) {
    // Ensure consistent date format YYYY-MM-DD
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error(`Invalid date: ${dateString}`);
    }
    return date.toISOString().split('T')[0];
}

function parsePostFrontmatter(data, slug) {
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
            `Post '${slug}' is missing required frontmatter fields: ${missing.join(", ")}`
        );
    }

    const image = typeof data.image === "string" ? data.image.trim() : undefined;

    // Normalize tags with both display name and slug
    const rawTags = Array.isArray(data.tags)
        ? data.tags.filter((t) => typeof t === "string" && t.trim())
        : [];

    const tags = rawTags.map((tag) => ({
        display: tag.trim(),
        slug: slugifyTag(tag)
    }));

    const draft = typeof data.draft === "boolean" ? data.draft : false;

    return {
        title,
        date: normalizeDate(date),
        description,
        image,
        tags: tags.length > 0 ? tags : undefined,
        draft,
    };
}

function rewriteRelativeImports(content, slug) {
    // Rewrite relative imports to absolute paths back to content/posts
    // Matches: import { X } from './path' or import X from '../path'
    return content.replace(
        /^(import\s+(?:[\w\s{},*]+\s+from\s+)?['"])(\.\/?(?:\.\.\/)?[\w\-./]+)(['"];?)$/gm,
        (match, prefix, relativePath, suffix) => {
            // Convert ./components/X to @/content/posts/<slug>/components/X
            const cleanPath = relativePath.replace(/^\.\//, "");
            return `${prefix}@/content/posts/${slug}/${cleanPath}${suffix}`;
        }
    );
}

function processPost(slug) {
    const sourcePath = path.join(POSTS_DIR, slug, "index.mdx");
    const raw = fs.readFileSync(sourcePath, "utf8");
    const { data, content } = matter(raw);

    const frontmatter = parsePostFrontmatter(data, slug);
    const readingTime = calculateReadingTime(content);
    const searchText = generateSearchText(content, frontmatter);

    // Rewrite relative imports to absolute paths
    const contentWithAbsoluteImports = rewriteRelativeImports(content, slug);

    // Write body-only MDX to generated/posts/<slug>/index.mdx
    const outputDir = path.join(GENERATED_POSTS_DIR, slug);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, "index.mdx");
    const finalContent = contentWithAbsoluteImports.endsWith("\n")
        ? contentWithAbsoluteImports
        : `${contentWithAbsoluteImports}\n`;

    let updated = false;
    if (fs.existsSync(outputPath)) {
        const existing = fs.readFileSync(outputPath, "utf8");
        if (existing !== finalContent) {
            fs.writeFileSync(outputPath, finalContent, "utf8");
            updated = true;
        }
    } else {
        fs.writeFileSync(outputPath, finalContent, "utf8");
        updated = true;
    }

    return {
        slug,
        frontmatter,
        readingTime,
        searchText,
        updated,
    };
}

function generateMetadataIndex(postsMetadata) {
    // Sort by date descending, then by title for deterministic ordering
    const sorted = postsMetadata
        .filter((post) => !post.frontmatter.draft)
        .sort((a, b) => {
            const dateComparison = new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
            if (dateComparison !== 0) return dateComparison;
            return a.frontmatter.title.localeCompare(b.frontmatter.title);
        });

    // Build tag index
    const tagMap = new Map();
    sorted.forEach(({ slug, frontmatter }) => {
        if (!frontmatter.tags) return;

        frontmatter.tags.forEach((tag) => {
            if (!tagMap.has(tag.slug)) {
                tagMap.set(tag.slug, {
                    display: tag.display,
                    count: 0,
                    posts: []
                });
            }
            const tagEntry = tagMap.get(tag.slug);
            tagEntry.count++;
            tagEntry.posts.push(slug);
        });
    });

    // Convert to plain object and sort posts array (already sorted by date)
    const tagIndex = {};
    tagMap.forEach((value, key) => {
        tagIndex[key] = value;
    });

    // Generate tags array sorted by count desc, then name asc
    const tagsArray = Array.from(tagMap.entries())
        .map(([slug, data]) => ({
            slug,
            display: data.display,
            count: data.count
        }))
        .sort((a, b) => {
            if (b.count !== a.count) return b.count - a.count;
            return a.display.localeCompare(b.display);
        });

    const indexContent = `// Auto-generated by scripts/generate-posts.js
// Do not edit manually

export interface PostTag {
  display: string;
  slug: string;
}

export interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  description: string;
  image?: string;
  tags?: PostTag[];
  readingTime: string;
  searchText: string;
}

export interface TagInfo {
  display: string;
  count: number;
  posts: string[];
}

export interface TagSummary {
  slug: string;
  display: string;
  count: number;
}

export const postsIndex: PostMetadata[] = ${JSON.stringify(
        sorted.map(({ slug, frontmatter, readingTime, searchText }) => ({
            slug,
            title: frontmatter.title,
            date: frontmatter.date,
            description: frontmatter.description,
            image: frontmatter.image,
            tags: frontmatter.tags,
            readingTime,
            searchText,
        })),
        null,
        2
    )};

export const tagIndex: Record<string, TagInfo> = ${JSON.stringify(tagIndex, null, 2)};

export const tags: TagSummary[] = ${JSON.stringify(tagsArray, null, 2)};

export const postsBySlug = new Map(
  postsIndex.map((post) => [post.slug, post])
);

export function getAllPosts(): PostMetadata[] {
  return postsIndex;
}

export function getPostBySlug(slug: string): PostMetadata | undefined {
  return postsBySlug.get(slug);
}

export function getPostsByTag(tagSlug: string): PostMetadata[] {
  const tagInfo = tagIndex[tagSlug];
  if (!tagInfo) return [];
  return tagInfo.posts
    .map(slug => postsBySlug.get(slug))
    .filter((post): post is PostMetadata => post !== undefined);
}

export function getTagBySlug(tagSlug: string): TagInfo | undefined {
  return tagIndex[tagSlug];
}

export function getAllTags(): TagSummary[] {
  return tags;
}
`;

    fs.writeFileSync(METADATA_INDEX_PATH, indexContent, "utf8");
}

function generateAll() {
    // Ensure generated directory exists
    if (!fs.existsSync(GENERATED_DIR)) {
        fs.mkdirSync(GENERATED_DIR, { recursive: true });
    }

    const slugs = getPostSlugs();
    const postsMetadata = [];
    let updatedCount = 0;

    console.log(`Processing ${slugs.length} posts...`);

    for (const slug of slugs) {
        try {
            const result = processPost(slug);
            postsMetadata.push(result);
            if (result.updated) {
                updatedCount++;
            }
        } catch (error) {
            console.error(`Error processing post '${slug}':`, error.message);
            return false;
        }
    }

    // Generate metadata index
    generateMetadataIndex(postsMetadata);

    console.log(`✓ Generated ${postsMetadata.length} posts (${updatedCount} updated)`);
    console.log(`✓ Generated metadata index at ${path.relative(process.cwd(), METADATA_INDEX_PATH)}`);
    return true;
}

function watchMode() {
    console.log("\n👀 Watching for changes in content/posts...\n");

    let timeout;
    const debounce = (fn, delay) => {
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
        };
    };

    const regenerate = debounce(() => {
        console.log(`\n[${new Date().toLocaleTimeString()}] Changes detected, regenerating...`);
        generateAll();
    }, 300);

    fs.watch(POSTS_DIR, { recursive: true }, (eventType, filename) => {
        if (filename && filename.endsWith(".mdx")) {
            regenerate();
        }
    });

    // Keep process alive
    process.stdin.resume();
}

function main() {
    const args = process.argv.slice(2);
    const isWatch = args.includes("--watch") || args.includes("-w");

    const success = generateAll();

    if (!success) {
        process.exit(1);
    }

    if (isWatch) {
        watchMode();
    }
}

main();
