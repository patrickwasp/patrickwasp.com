import { redirect } from "next/navigation";
import { getAllTags } from "@/generated/posts-index";

interface PageParams {
    page: string;
}

interface PageProps {
    params: Promise<PageParams>;
}

// Generate some params for static export compatibility
export async function generateStaticParams() {
    return [
        { page: "2" },
        { page: "3" },
    ];
}

export default async function BlogPagePaginated({ params }: PageProps) {
    // All paginated routes now redirect to main blog page
    redirect("/blog");
}