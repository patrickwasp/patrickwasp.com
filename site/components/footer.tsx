import Link from "next/link";
import { siteConfig } from "@/site.config";

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-border/60 py-8 mt-auto">
            <div className="mx-auto max-w-3xl px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <p>&copy; {year} {siteConfig.name}. All rights reserved.</p>
                    <div className="flex gap-4">
                        {siteConfig.links.github ? (
                            <Link
                                href={siteConfig.links.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-foreground transition-colors"
                            >
                                GitHub
                            </Link>
                        ) : null}
                        {siteConfig.links.linkedin ? (
                            <Link
                                href={siteConfig.links.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-foreground transition-colors"
                            >
                                LinkedIn
                            </Link>
                        ) : null}
                    </div>
                </div>
            </div>
        </footer>
    );
}
