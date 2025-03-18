'use client';

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

import type { BaseModel } from '../../types/base';
import type { DataTableProps } from './data-table.model';

export const DataTable = <Entry extends BaseModel>(
  props: DataTableProps<Entry>
): React.ReactElement => {
  const {
    title,
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
    pageCount: 0 /* props.data?.pageCount ?? -1, */,
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

  if (isLoading) {
    return <>Loading</>;
  }

  if (data.data?.length === 0) {
    return <div>No Data</div>;
  }

  return (
    <div className="p-5">
      <div className="border-2 rounded-2xl border-[#D9D9D9]">
        <div className="bg-[#F9FAFB] rounded-t-2xl py-[0.9375rem] px-[1.125rem] flex flex-col md:flex-row justify-between">
          <div className="flex flex-row gap-2">
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="table-search"
                className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search"
              />
            </div>
            <div className="flex w-9 h-9 mt-1 bg-primary-blue border border-blue-700 cursor-pointer select-none rounded-lg items-center justify-center">
              {/* <Filter color="white" /> */}
            </div>
          </div>
          <span className="text-primary-blue font-semibold text-center self-center">
            {title}
          </span>
          <button type="button" onClick={() => {}} variant="primary" />
        </div>

        <div className="overflow-x-auto">
          <table className="datatable-table w-full table-auto !border-collapse break-words px-4 md:px-8">
            <thead>
              {table.getCenterHeaderGroups().map((headerGroup) => (
                <tr>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th key={header.id}>
                        {!header.isPlaceholder && (
                          <button
                            type="button"
                            {...{
                              style: {
                                cursor: header.column.getCanSort()
                                  ? 'pointer'
                                  : '',
                              },
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() &&
                              (header.column.getIsSorted() === 'asc'
                                ? '^'
                                : 'v')}
                          </button>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => {
                const styles = onSelectRow && {
                  cursor: 'pointer',
                  _hover: { bg: 'lightPrimary' },
                };

                return (
                  <tr
                    key={row.id}
                    {...styles}
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
        <div className="bg-[#F9FAFB] h-4 rounded-b-2xl" />
      </div>
      <nav
        className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4 px-5"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
          <span className="font-semibold text-gray-900 dark:text-white">
            {10 * pageIndex + 1}-
            {/* {pageSize > nodes.length ? nodes.length : pageSize} */}
          </span>{' '}
        </span>

        <div className="flex gap-5">
          <div className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
            <span className="flex items-center justify-center px-3 h-8 ms-0">
              Rows per Page
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
            <div className="flex items-center justify-center ms-0 w-6 h-5 leading-tight text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 select-none cursor-pointer">
              {/* <ChevronLeft width={16} height={16} /> */}
            </div>
            <span className="flex items-center justify-center px-3 h-5 ms-0">
              {pageIndex + 1}
            </span>
            <div className="flex items-center justify-center ms-0 w-6 h-5 leading-tight text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 select-none cursor-pointer">
              {/* <ChevronRight width={16} height={16} /> */}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};
