import type { FC } from 'react';

type TablePaginationProps = {
  page: number;
  pageSize: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
};

export const TablePagination: FC<TablePaginationProps> = ({
  page,
  pageSize,
  totalRecords,
  onPageChange,
}) => {
  const fromRecord = (page - 1) * pageSize + 1;
  const toRecord = Math.min(fromRecord + pageSize - 1, totalRecords);
  const totalPages = Math.ceil(totalRecords / pageSize);

  const canGoToPreviousPage = page > 1;
  const canGoToNextPage = page < totalPages;

  const handlePreviousPage = (): void => {
    if (!canGoToPreviousPage) return;
    onPageChange(page - 1);
  };

  const handleNextPage = (): void => {
    if (!canGoToNextPage) return;
    onPageChange(page + 1);
  };

  // Generate visible page numbers with ellipses for gaps
  const getVisiblePages = (): Array<number | string> => {
    const maxVisiblePages = 5;
    const result: Array<number | string> = [];

    if (totalPages <= maxVisiblePages) {
      // Show all pages if there are fewer than maxVisiblePages
      for (let i = 1; i <= totalPages; i += 1) {
        result.push(i);
      }
    } else {
      // Always show first page
      result.push(1);

      // Add ellipsis after first page if needed
      if (page > 3) {
        result.push('...');
      }

      // Calculate middle pages
      let startPage = Math.max(2, page - 1);
      let endPage = Math.min(page + 1, totalPages - 1);

      // Adjust if at the beginning
      if (page <= 3) {
        startPage = 2;
        endPage = Math.min(4, totalPages - 1);
      }

      // Adjust if at the end
      if (page >= totalPages - 2) {
        startPage = Math.max(totalPages - 3, 2);
        endPage = totalPages - 1;
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i += 1) {
        result.push(i);
      }

      // Add ellipsis before last page if needed
      if (page < totalPages - 2) {
        result.push('...');
      }

      // Always show last page if more than one page
      if (totalPages > 1) {
        result.push(totalPages);
      }
    }

    return result;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex justify-between border-t border-stroke px-8 pt-5 dark:border-strokedark">
      <p className="font-medium">
        Showing {totalRecords > 0 ? fromRecord : 0} to {toRecord} of{' '}
        {totalRecords} entries
      </p>
      <div className="flex overflow-x-auto">
        <button
          className="flex cursor-pointer items-center justify-center rounded-md p-1 px-2 hover:bg-primary hover:text-whiter disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handlePreviousPage}
          disabled={!canGoToPreviousPage}
          type="button"
          aria-label="Previous"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.1777 16.1156C12.009 16.1156 11.8402 16.0593 11.7277 15.9187L5.37148 9.44995C5.11836 9.19683 5.11836 8.80308 5.37148 8.54995L11.7277 2.0812C11.9809 1.82808 12.3746 1.82808 12.6277 2.0812C12.8809 2.33433 12.8809 2.72808 12.6277 2.9812L6.72148 8.99995L12.6559 15.0187C12.909 15.2718 12.909 15.6656 12.6559 15.9187C12.4871 16.0312 12.3465 16.1156 12.1777 16.1156Z"
              fill=""
            />
          </svg>
        </button>

        {visiblePages.map((p, index) =>
          typeof p === 'number' ? (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`${
                page === p && 'bg-primary text-white'
              } mx-1 flex cursor-pointer items-center justify-center rounded-md p-1 px-3 hover:bg-primary hover:text-white`}
              type="button"
            >
              {p}
            </button>
          ) : (
            <span
              // Its needed to avoid duplicate keys
              // eslint-disable-next-line react/no-array-index-key
              key={`ellipsis-${p}-${index}`}
              className="mx-1 flex items-center justify-center p-1 px-3"
            >
              ...
            </span>
          )
        )}

        <button
          className="flex cursor-pointer items-center justify-center rounded-md p-1 px-2 hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleNextPage}
          disabled={!canGoToNextPage}
          type="button"
          aria-label="Next"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.82148 16.1156C5.65273 16.1156 5.51211 16.0593 5.37148 15.9468C5.11836 15.6937 5.11836 15.3 5.37148 15.0468L11.2777 8.99995L5.37148 2.9812C5.11836 2.72808 5.11836 2.33433 5.37148 2.0812C5.62461 1.82808 6.01836 1.82808 6.27148 2.0812L12.6277 8.54995C12.8809 8.80308 12.8809 9.19683 12.6277 9.44995L6.27148 15.9187C6.15898 16.0312 5.99023 16.1156 5.82148 16.1156Z"
              fill=""
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
