import type { FC } from 'react';

type Props = {
  pageSize: number;
  onEntriesPerPageChange: (pageSize: number) => void;
};

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export const TableHeader: FC<Props> = ({
  pageSize,
  onEntriesPerPageChange: onRowsPerPageChange,
}) => {
  return (
    <div className="flex justify-end border-b border-stroke px-8 pb-4 dark:border-strokedark">
      <div className="flex items-center font-medium">
        <select
          value={pageSize}
          className="bg-transparent pl-2"
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
        >
          {ROWS_PER_PAGE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <p className="pl-2 text-black dark:text-white">Entries Per Page</p>
      </div>
    </div>
  );
};
