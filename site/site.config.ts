export const siteConfig = {
    name: "patrickwasp",
    description: "Personal tech articles and thoughts",
    url: "https://patrickwasp.com",
    author: {
        name: "Patrick Wasp",
        email: "patrick@patrickwasp.com",
        github: "https://github.com/patrickwasp",
    },
    links: {
        github: "https://github.com/patrickwasp",
        linkedin: "https://www.linkedin.com/in/patrick-wspanialy",
    },
    giscus: {
        enabled: true,
        repo: "patrickwasp/patrickwasp.com" as `${string}/${string}`,
        repoId: "R_kgDOREJpFQ",
        category: "Announcements",
        categoryId: "DIC_kwDOREJpFc4C1yl7",
        mapping: "pathname" as const,
        reactionsEnabled: true,
        emitMetadata: true,
        inputPosition: "top" as const,
        lang: "en",
    },
} as const;

export type SiteConfig = typeof siteConfig;
