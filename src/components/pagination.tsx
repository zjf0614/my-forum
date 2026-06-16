import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "ellipsis")[] = [];
  const delta = 2;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "ellipsis") {
      pages.push("ellipsis");
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-8">
      {currentPage > 1 && (
        <Link
          href={`${baseUrl}?page=${currentPage - 1}`}
          className="px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          上一页
        </Link>
      )}

      {pages.map((page, idx) => {
        if (page === "ellipsis") {
          return (
            <span key={`ellipsis-${idx}`} className="px-3 py-2 text-sm text-gray-400">
              ...
            </span>
          );
        }

        return (
          <Link
            key={page}
            href={`${baseUrl}?page=${page}`}
            className={`px-3 py-2 text-sm rounded-lg border transition ${
              page === currentPage
                ? "bg-blue-600 text-white border-blue-600"
                : "text-gray-600 bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            {page}
          </Link>
        );
      })}

      {currentPage < totalPages && (
        <Link
          href={`${baseUrl}?page=${currentPage + 1}`}
          className="px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          下一页
        </Link>
      )}
    </nav>
  );
}
