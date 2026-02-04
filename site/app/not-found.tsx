import Link from "next/link";

export default function NotFound() {
    return (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
            <h1 className="text-2xl font-semibold tracking-tight">Not found</h1>
            <p className="mt-3 text-muted-foreground">That page doesn’t exist.</p>
            <div className="mt-6">
                <Link href="/" className="text-sm hover:underline underline-offset-4">
                    Go home
                </Link>
            </div>
        </div>
    );
}
