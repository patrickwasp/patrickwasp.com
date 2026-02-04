interface YouTubeEmbedProps {
    src: string;
    title?: string;
    className?: string;
    allow?: string;
}

export function YouTubeEmbed({
    src,
    title = 'YouTube video player',
    className,
    allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
}: YouTubeEmbedProps) {
    return (
        <div className={`my-8 overflow-hidden rounded-lg border border-border ${className ?? ''}`}>
            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                <iframe
                    className="absolute inset-0 h-full w-full"
                    src={src}
                    title={title}
                    frameBorder={0}
                    allow={allow}
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    loading="lazy"
                />
            </div>
        </div>
    );
}
