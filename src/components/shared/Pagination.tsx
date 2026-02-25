interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  totalCount: number;
  pageSize: number;
}

export function Pagination({ currentPage, totalPages, onPageChange, totalCount, pageSize }: PaginationProps) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalCount);

  // Build visible page numbers: always show first, last, and up to 3 around current
  const pages: (number | 'ellipsis')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('ellipsis');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('ellipsis');
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 flex-wrap gap-3">
      <p className="text-sm text-gray-500">
        Showing{' '}
        <span className="font-medium text-gray-900">{start}</span>
        –
        <span className="font-medium text-gray-900">{end}</span>
        {' '}of{' '}
        <span className="font-medium text-gray-900">{totalCount}</span> transactions
      </p>
      <div className="flex gap-1 items-center">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50 transition-colors"
        >
          ←
        </button>
        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`e-${i}`} className="px-2 text-gray-400 text-sm">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                p === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50 transition-colors"
        >
          →
        </button>
      </div>
    </div>
  );
}
