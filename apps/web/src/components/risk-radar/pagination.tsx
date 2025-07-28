import type { FC, JSX } from 'react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}): JSX.Element | null => {
  const getPageNumbers = (): Array<number | string> => {
    const delta = 2; // Number of pages to show before and after current page
    const range: number[] = [];
    const rangeWithDots: Array<number | string> = [];
    let lastNumber: number;

    range.push(1);

    if (totalPages <= 1) return range;

    // Add pages before and after current page
    for (let i = currentPage - delta; i <= currentPage + delta; i += 1) {
      if (i < totalPages && i > 1) {
        range.push(i);
      }
    }
    range.push(totalPages);

    // Add dots between numbers
    range.forEach((i) => {
      if (lastNumber) {
        if (i - lastNumber === 2) {
          rangeWithDots.push(lastNumber + 1);
        } else if (i - lastNumber !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      lastNumber = i;
    });

    return rangeWithDots;
  };

  const getButtonClassName = (page: number | string): string => {
    if (typeof page !== 'number') {
      return 'px-3 py-1 rounded border-none cursor-default';
    }

    if (currentPage === page) {
      return 'px-3 py-1 rounded bg-primary text-white';
    }

    return 'px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700';
  };

  const generateButtonKey = (page: number | string): string => {
    if (typeof page === 'number') {
      return `page-${page}`;
    }
    return `ellipsis-${Math.random()}`;
  };

  const handlePageClick = (page: number | string): (() => void) | undefined => {
    if (typeof page === 'number') {
      return () => onPageChange(page);
    }
    return undefined;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        Previous
      </button>
      {getPageNumbers().map((page) => (
        <button
          type="button"
          key={generateButtonKey(page)}
          onClick={handlePageClick(page)}
          className={getButtonClassName(page)}
          disabled={typeof page !== 'number'}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        Next
      </button>
    </div>
  );
};
