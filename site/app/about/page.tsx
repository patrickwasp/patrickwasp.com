import { siteConfig } from "@/site.config";

export const metadata = {
    title: "About",
};

export default function AboutPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                About
            </h1>

            <div className="mt-6 prose prose-zinc dark:prose-invert">
                <p>
                    Hi, I'm Patrick. I like building things that blend hardware, software, and AI.
                    From circuit boards and firmware, to web apps and embedded systems, to AI automation.
                    With a focus on making products accessible and intuitive.
                </p>

                <p>
                    If you’re interested in collaborating, hiring, or just
                    talking tech, feel free to reach out.
                </p>
            </div>
        </div>
    );
}