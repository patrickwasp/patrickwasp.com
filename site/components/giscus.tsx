"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { siteConfig } from "@/site.config";

export function Giscus() {
    const ref = useRef<HTMLDivElement>(null);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        if (!siteConfig.giscus.enabled) return;
        const container = ref.current;
        if (!container) return;

        const scriptElement = document.createElement("script");
        scriptElement.src = "https://giscus.app/client.js";
        scriptElement.async = true;
        scriptElement.crossOrigin = "anonymous";

        scriptElement.setAttribute("data-repo", siteConfig.giscus.repo);
        scriptElement.setAttribute("data-repo-id", siteConfig.giscus.repoId);
        scriptElement.setAttribute("data-category", siteConfig.giscus.category);
        scriptElement.setAttribute("data-category-id", siteConfig.giscus.categoryId);
        scriptElement.setAttribute("data-mapping", siteConfig.giscus.mapping);
        scriptElement.setAttribute(
            "data-reactions-enabled",
            siteConfig.giscus.reactionsEnabled ? "1" : "0"
        );
        scriptElement.setAttribute(
            "data-emit-metadata",
            siteConfig.giscus.emitMetadata ? "1" : "0"
        );
        scriptElement.setAttribute("data-input-position", siteConfig.giscus.inputPosition);
        scriptElement.setAttribute(
            "data-theme",
            resolvedTheme === "dark" ? "dark" : "light"
        );
        scriptElement.setAttribute("data-lang", siteConfig.giscus.lang);

        container.appendChild(scriptElement);

        return () => {
            container.innerHTML = "";
        };
    }, []);

    useEffect(() => {
        const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
        if (!iframe) return;

        iframe.contentWindow?.postMessage(
            {
                giscus: {
                    setConfig: {
                        theme: resolvedTheme === "dark" ? "dark" : "light",
                    },
                },
            },
            "https://giscus.app"
        );
    }, [resolvedTheme]);

    if (!siteConfig.giscus.enabled) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Comments are not configured yet.</p>
            </div>
        );
    }

    return (
        <section aria-label="Comments">
            <h2 className="text-lg font-medium mb-4">Comments</h2>
            <div ref={ref} />
        </section>
    );
}
