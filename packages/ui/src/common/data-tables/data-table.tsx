'use client';

import {
  ArrowDownIcon,
  ArrowsUpDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid';
import type { PaginationState, SortingState } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React from 'react';

import type { BaseModel } from '@/ui/types';

import type { DataTableProps } from './data-table-model';

export const DataTable = <Entry extends BaseModel>(
  props: DataTableProps<Entry>
): React.ReactElement => {
  const {
    columns,
    isLoading,
    onSelectRow,
    onSetPagination,
    initialItemsPerPage,
    data,
  } = props;

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: initialItemsPerPage,
    });

  React.useEffect(() => {
    onSetPagination?.({ pageIndex, pageSize });
  }, [pageIndex, pageSize, onSetPagination]);

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );
  const table = useReactTable({
    data: data.data,
    columns,
    pageCount: props.data?.pageCount ?? -1,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: initialItemsPerPage,
      },
    },
    manualPagination: true,
    debugTable: true,
    autoResetPageIndex: false,
  });

  const onSelectRowItem = (entry: Entry) => {
    return () => onSelectRow?.(entry);
  };

  // TODO: Implement loading based on app design
  if (isLoading) {
    return <>Loading</>;
  }
  // TODO: Implement no data view based on app design
  if (data.data?.length === 0) {
    return <div>No Data</div>;
  }

  return (
    <div className="mx-auto max-w-screen-xl px-10 lg:px-12">
      <div className="bg-[#F9FAFB] dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden border-[#D9D9D9]">
        <div className="overflow-x-auto">
          <table className="datatable-table w-full table-auto !border-collapse break-words px-4 md:px-8">
            <thead>
              {table.getCenterHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th key={header.id}>
                        {!header.isPlaceholder && (
                          <div
                            aria-hidden="true"
                            {...{
                              className: `flex  items-center gap-2 ${
                                header.column.getCanSort()
                                  ? 'cursor-pointer select-none'
                                  : ''
                              }`,
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: (
                                <ArrowUpIcon className="size-4 text-green-600" />
                              ),
                              desc: (
                                <ArrowDownIcon className="size-4 text-green-600" />
                              ),
                            }[header.column.getIsSorted() as string] ?? (
                              <ArrowsUpDownIcon className="size-4" />
                            )}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <tr
                    key={row.id}
                    className={`bg-white dark:bg-gray-800 hover:bg-gray-50  dark:hover:bg-gray-600 ${onSelectRow ? 'bg-gray-600' : ''}`}
                    onClick={onSelectRowItem(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <nav
          className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
          aria-label="Table navigation"
        >
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
            <span className="font-semibold text-gray-900 dark:text-white">
              {pageIndex * pageSize + 1}-
              {pageSize > data.count ? data.count : pageSize}
            </span>{' '}
          </span>

          <div className="flex gap-5">
            <div className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
              <span className="flex items-center justify-center px-3 h-8 ms-0">
                Entries per Page
              </span>
              <select
                id="underline_select"
                className="h-full py-0 pl-0 pr-8 text-sm text-gray-500 bg-transparent border-0"
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                value={pageSize}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={40}>40</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-5 self-center">
              <button
                type="button"
                className="flex items-center justify-center ms-0 w-6 h-5 leading-tight text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 select-none cursor-pointer"
                disabled={pageIndex === 0}
                onClick={() => {
                  table.setPageIndex(pageIndex - 1);
                }}
              >
                <ChevronLeftIcon className="size-4" />
              </button>
              <span className="flex items-center justify-center px-3 h-5 ms-0">
                {pageIndex + 1}
              </span>
              <button
                type="button"
                className="flex items-center justify-center ms-0 w-6 h-5 leading-tight text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 select-none cursor-pointer"
                onClick={() => {
                  table.setPageIndex(pageIndex + 1);
                }}
              >
                <ChevronRightIcon className="size-4" />
              </button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};
