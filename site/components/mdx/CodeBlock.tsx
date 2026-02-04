"use client";

import React from "react";

type CodeBlockProps = React.HTMLAttributes<HTMLPreElement> & {
    children: React.ReactNode;
};

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
    const [copied, setCopied] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const handleCopy = async () => {
        const codeElement = containerRef.current?.querySelector("code");
        const text = (codeElement?.textContent ?? containerRef.current?.textContent)?.trim();

        if (!text) return;

        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
        } catch {
            // Silently fail if clipboard access is denied
        }
    };

    return (
        <div ref={containerRef} className="relative group my-6">
            <pre
                {...props}
                className={`overflow-x-auto rounded-lg border bg-gray-50 p-4 text-sm dark:border-gray-800 dark:bg-gray-900/40 ${className ?? ""}`}
            >
                {children}
            </pre>

            <button
                type="button"
                onClick={handleCopy}
                className="absolute top-2 right-2 rounded border bg-white/80 px-2 py-1 text-xs text-gray-700 opacity-0 transition group-hover:opacity-100 dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-200"
                aria-label={copied ? "Copied" : "Copy code"}
            >
                {copied ? "Copied" : "Copy"}
            </button>
        </div>
    );
}