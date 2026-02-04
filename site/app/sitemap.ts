import type { MetadataRoute } from "next";
import { getAllPostMeta, getTotalPages } from "@/lib/posts";
import { getAllTags } from "@/generated/posts-index";
import { siteConfig } from "@/site.config";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const posts = await getAllPostMeta();
    const totalPages = await getTotalPages();
    const tags = getAllTags();

    const blogPosts = posts.map((post) => ({
        url: `${siteConfig.url}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly" as const,
        priority: 0.8,
    }));

    // Add pagination pages
    const paginationPages = [];
    for (let i = 2; i <= totalPages; i++) {
        paginationPages.push({
            url: `${siteConfig.url}/blog/page/${i}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7,
        });
    }

    // Add tag pages
    const tagPages = tags.map((tag) => ({
        url: `${siteConfig.url}/tag/${tag.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
    }));

    const routes = [
        {
            url: siteConfig.url,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 1,
        },
        {
            url: `${siteConfig.url}/blog`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.9,
        },
        {
            url: `${siteConfig.url}/tags`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7,
        },
        {
            url: `${siteConfig.url}/search`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.5,
        },
        {
            url: `${siteConfig.url}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.5,
        },
    ];

    return [...routes, ...blogPosts, ...paginationPages, ...tagPages];
}
