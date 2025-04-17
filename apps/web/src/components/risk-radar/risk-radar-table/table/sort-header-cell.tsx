import type { FC } from 'react';

type SortHeaderCellProps = {
  label: string;
  sortDirection?: 'ASC' | 'DESC' | null;
  onSort?: () => void;
  enableSorting?: boolean;
};

export const SortHeaderCell: FC<SortHeaderCellProps> = ({
  label,
  sortDirection,
  onSort,
  enableSorting = true,
}) => {
  if (!enableSorting) {
    return <div className="flex items-center">{label}</div>;
  }

  return (
    <div
      className="flex cursor-pointer items-center gap-1"
      onClick={onSort}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSort?.();
        }
      }}
    >
      <span>{label}</span>
      <div className="flex flex-col">
        {/* Up arrow */}
        <svg
          className={`h-2 w-2 transform ${
            sortDirection === 'ASC' ? 'text-primary' : 'text-gray-400'
          }`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 4l-8 8h16z" />
        </svg>
        {/* Down arrow */}
        <svg
          className={`h-2 w-2 transform ${
            sortDirection === 'DESC' ? 'text-primary' : 'text-gray-400'
          }`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 20l-8-8h16z" />
        </svg>
      </div>
    </div>
  );
};
