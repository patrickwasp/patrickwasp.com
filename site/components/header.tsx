"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { siteConfig } from "@/site.config";

const ThemeToggle = dynamic(
    () => import("@/components/theme-toggle").then((mod) => mod.ThemeToggle),
    { ssr: false }
);

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
                <Link href="/" className="text-lg font-semibold text-foreground hover:text-foreground/80 transition-colors">
                    {siteConfig.name}
                </Link>

                <nav className="flex items-center gap-1">
                    <Link href="/about" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        About
                    </Link>
                    <ThemeToggle />
                </nav>
            </div>
        </header>
    );
}
