import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    basePath?: string;
}

export function Pagination({ currentPage, totalPages, basePath = '/blog' }: PaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    const getPageUrl = (page: number) => {
        if (page === 1) {
            return basePath;
        }
        return `${basePath}/page/${page}`;
    };

    const renderPageNumbers = () => {
        const pages = [];
        const showPages = 5; // Show 5 page numbers at most
        let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
        let endPage = Math.min(totalPages, startPage + showPages - 1);

        // Adjust start page if we're near the end
        if (endPage - startPage < showPages - 1) {
            startPage = Math.max(1, endPage - showPages + 1);
        }

        // First page + ellipsis if needed
        if (startPage > 1) {
            pages.push(
                <Link
                    key={1}
                    href={getPageUrl(1)}
                    className={`px-3 py-2 text-sm rounded ${1 === currentPage
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted'
                        }`}
                >
                    1
                </Link>
            );

            if (startPage > 2) {
                pages.push(
                    <span key="ellipsis-start" className="px-3 py-2 text-sm text-gray-500">
                        ...
                    </span>
                );
            }
        }

        // Page numbers
        for (let page = startPage; page <= endPage; page++) {
            pages.push(
                <Link
                    key={page}
                    href={getPageUrl(page)}
                    className={`px-3 py-2 text-sm rounded ${page === currentPage
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted'
                        }`}
                >
                    {page}
                </Link>
            );
        }

        // Last page + ellipsis if needed
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(
                    <span key="ellipsis-end" className="px-3 py-2 text-sm text-gray-500">
                        ...
                    </span>
                );
            }

            pages.push(
                <Link
                    key={totalPages}
                    href={getPageUrl(totalPages)}
                    className={`px-3 py-2 text-sm rounded ${totalPages === currentPage
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted'
                        }`}
                >
                    {totalPages}
                </Link>
            );
        }

        return pages;
    };

    return (
        <nav className="flex items-center justify-center gap-2 mt-8" aria-label="Pagination">
            {/* Previous button */}
            {currentPage > 1 && (
                <Link
                    href={getPageUrl(currentPage - 1)}
                    className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                </Link>
            )}

            {/* Page numbers */}
            <div className="flex gap-1">
                {renderPageNumbers()}
            </div>

            {/* Next button */}
            {currentPage < totalPages && (
                <Link
                    href={getPageUrl(currentPage + 1)}
                    className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
            )}
        </nav>
    );
}