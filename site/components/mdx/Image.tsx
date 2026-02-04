"use client";

interface ImageProps {
    src: string;
    alt: string;
    title?: string;
    scale?: number;
}

export function Image({ src, alt, title, scale = 100 }: ImageProps) {
    const caption = title || alt;

    return (
        <span className="not-prose block my-8 text-center">
            <img
                src={src}
                alt={alt}
                title={title}
                style={{ width: `${scale}%` }}
                data-scale={scale}
                className="rounded-lg mx-auto max-w-full h-auto"
            />
            {caption && (
                <span className="block text-sm text-gray-600 dark:text-gray-400 italic">
                    {caption}
                </span>
            )}
        </span>
    );
}
