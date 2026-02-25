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
  return (
    <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
      <p className="text-sm text-gray-500">
        Showing <span className="font-medium text-gray-900">{start}</span>–<span className="font-medium text-gray-900">{end}</span> of{' '}
        <span className="font-medium text-gray-900">{totalCount}</span> transactions
      </p>
      <div className="flex gap-1">
        {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          );
        })}
        {totalPages > 7 && currentPage > 7 && (
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
