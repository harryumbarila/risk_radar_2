import React from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { PaginationState, SortingState } from '@tanstack/react-table';

import { DataTableProps } from './data-table.model';
import { Flex, Table } from '@chakra-ui/react';
import {
  MdArrowDownward,
  MdArrowDropDown,
  MdArrowUpward,
} from 'react-icons/md';
import DataRow from './data-row/data-row';
import { BaseModel } from '@/data/interfaces/api';

const DataTable = <Entry extends BaseModel>(
  props: DataTableProps<Entry>
): React.ReactElement => {
  const {
    columns,
    // onSelectRow,
    onSetPagination,
    initialItemsPerPage,
    data,
    CollapsibleBody,
  } = props;

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: initialItemsPerPage || 50,
    });

  React.useEffect(() => {
    // onSetPagination?.({ pageIndex, pageSize });
    setPagination?.({ pageIndex, pageSize });
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

    // pageCount: data?.pageCount ?? -1,
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
    debugTable: true,
    // TODO: Backend Pagination
    // manualPagination: true,
    // autoResetPageIndex: false,
  });

  // const onSelectRowItem = (entry: Entry) => {
  //   return () => onSelectRow?.(entry);
  // };
  return (
    <Table.ScrollArea borderWidth="1px">
      <Table.Root stickyHeader size="sm" variant="outline">
        <Table.Header>
          {table.getCenterHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                // const align = (
                //   header.column.columnDef?.meta as Record<string, unknown>
                // )?.align;
                const canSort = header.column.getCanSort();

                return (
                  <Table.ColumnHeader key={header.id}>
                    {!header.isPlaceholder && (
                      <Flex
                        aria-hidden="true"
                        {...{
                          cursor: canSort ? 'pointer' : undefined,
                          // className: clsx(
                          //   'flex w-full items-center font-bold text-black dark:text-white gap-2',
                          //   {
                          //     'cursor-pointer select-none': canSort,
                          //     'justify-start': align === 'left',
                          //     'justify-center': align === 'center',
                          //     'justify-end': align === 'right',
                          //   }
                          // ),
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {(canSort &&
                          {
                            asc: (
                              <MdArrowUpward className="size-4 text-green-600" />
                            ),
                            desc: (
                              <MdArrowDownward className="size-4 text-green-600" />
                            ),
                          }[header.column.getIsSorted() as string]) ?? (
                          <MdArrowDropDown className="size-4" />
                        )}
                      </Flex>
                    )}
                  </Table.ColumnHeader>
                );
              })}
            </Table.Row>
          ))}
        </Table.Header>

        <Table.Body>
          {table.getRowModel().rows.map((row) => (
            <DataRow
              key={row.id}
              row={row}
              colSpan={columns.length}
              CollapsibleBody={CollapsibleBody}
            />
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
};

export default DataTable;
