import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "@/components/mdx/CodeBlock";
import { Image } from "@/components/mdx/Image";

// Export Image so it can be used in MDX files
export { Image } from "@/components/mdx/Image";

// Custom components are now imported locally within each post
// This file can be used for global MDX customizations if needed
export function useMDXComponents(
    providedComponents: MDXComponents = {}
): MDXComponents {
    return {
        pre: CodeBlock,
        img: Image,
        Image,
        ...providedComponents,
    };
}
