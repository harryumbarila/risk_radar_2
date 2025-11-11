'use client';
import React from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  PaginationState,
} from '@tanstack/react-table';
import type { SortingState } from '@tanstack/react-table';

import { DataTableProps } from './data-table.model';
import {
  Flex,
  Table,
  Text,
  Pagination,
  Select,
  ButtonGroup,
  IconButton,
  Portal,
  createListCollection,
} from '@chakra-ui/react';
import {
  MdArrowDownward,
  MdArrowDropDown,
  MdArrowUpward,
  MdArrowLeft,
  MdArrowRight,
} from 'react-icons/md';

import DataRow from './data-row/data-row';
import { BaseModel } from '@/data/interfaces/api';

const justifyMap: Record<string, string> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

const DataTable = <Entry extends BaseModel>(
  props: DataTableProps<Entry>
): React.ReactElement => {
  const {
    columns,
    // onSelectRow,
    pagination,
    onSetPagination,
    data,
    CollapsibleBody,
    enablePagination,
  } = props;

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const effectivePagination: PaginationState = enablePagination
    ? (pagination ?? { pageIndex: 0, pageSize: 10 })
    : { pageIndex: 0, pageSize: data.data?.length || 10 };

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: data.data,
    columns,
    pageCount: data?.pageCount ?? -1,
    state: {
      sorting,
      pagination: effectivePagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: onSetPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: false,
    manualPagination: enablePagination,
    autoResetPageIndex: false,
  });

  const pageCount = table.getPageCount();

  const pageSizeOptions = createListCollection({
    items: [10, 20, 30, 40, 50].map((size) => ({
      label: `${size}`,
      value: `${size}`,
    })),
  });

  // const onSelectRowItem = (entry: Entry) => {
  //   return () => onSelectRow?.(entry);
  // };
  return (
    <Table.ScrollArea borderWidth="1px" w="full">
      <Table.Root stickyHeader size="sm" variant="outline">
        <Table.Header>
          {table.getCenterHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const align = (
                  header.column.columnDef?.meta as Record<string, unknown>
                )?.align as string;
                const canSort = header.column.getCanSort();

                return (
                  <Table.ColumnHeader key={header.id}>
                    {!header.isPlaceholder && (
                      <Flex
                        aria-hidden="true"
                        onClick={header.column.getToggleSortingHandler()}
                        cursor={canSort ? 'pointer' : undefined}
                        justifyContent={justifyMap[align]}
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

        <Table.Footer>
          {table.getFooterGroups().map((footerEl) => (
            <Table.Row key={footerEl.id}>
              {footerEl.headers.map((columnEl) => {
                const align = (
                  columnEl.column.columnDef?.meta as Record<string, unknown>
                )?.align as string;
                return (
                  <Table.Cell key={columnEl.id} colSpan={columnEl.colSpan}>
                    <Flex aria-hidden="true" justify={justifyMap[align]}>
                      {flexRender(
                        columnEl.column.columnDef.footer,
                        columnEl.getContext()
                      )}
                    </Flex>
                  </Table.Cell>
                );
              })}
            </Table.Row>
          ))}
        </Table.Footer>
      </Table.Root>
      {enablePagination && (
        <Flex
          as="nav"
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'flex-start', md: 'center' }}
          px={2}
          py={3}
          aria-label="Table navigation"
          gap={3}
        >
          <Text fontWeight="normal" color="gray.500">
            Page{' '}
            <Text as="span" fontWeight="semibold" color="gray.900">
              {effectivePagination.pageIndex + 1} of{' '}
              {pageCount.toLocaleString()}
            </Text>
          </Text>

          <Flex gap={5} align="center">
            <Flex align="center">
              <Text mr={2}>Entries per Page</Text>
              <Select.Root
                collection={pageSizeOptions}
                width="120px"
                value={[`${table.getState().pagination.pageSize}`]}
                onValueChange={(e) => {
                  const size = Number(e.value[0]);
                  onSetPagination?.({ ...effectivePagination, pageSize: size });
                }}
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Select" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>

                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {pageSizeOptions.items.map((item) => (
                        <Select.Item item={item} key={item.value}>
                          {item.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </Flex>

            <Pagination.Root
              count={pageCount}
              pageSize={1}
              page={effectivePagination.pageIndex + 1}
              onPageChange={(details) =>
                onSetPagination?.({
                  ...effectivePagination,
                  pageIndex: details.page - 1,
                })
              }
            >
              <ButtonGroup size="sm" variant="ghost">
                <Pagination.PrevTrigger asChild>
                  <IconButton
                    aria-label="Previous page"
                    disabled={effectivePagination.pageIndex === 0}
                  >
                    <MdArrowLeft />
                  </IconButton>
                </Pagination.PrevTrigger>

                <Pagination.Items
                  render={(page) => (
                    <Pagination.Item
                      type="page"
                      key={page.value}
                      value={page.value}
                      asChild
                    >
                      <IconButton
                        aria-label={`Page ${page.value}`}
                        variant={
                          effectivePagination.pageIndex + 1 === page.value
                            ? 'solid'
                            : 'ghost'
                        }
                      >
                        {page.value}
                      </IconButton>
                    </Pagination.Item>
                  )}
                />

                <Pagination.NextTrigger asChild>
                  <IconButton
                    aria-label="Next page"
                    disabled={effectivePagination.pageIndex >= pageCount - 1}
                  >
                    <MdArrowRight />
                  </IconButton>
                </Pagination.NextTrigger>
              </ButtonGroup>
            </Pagination.Root>
          </Flex>
        </Flex>
      )}
    </Table.ScrollArea>
  );
};

export default DataTable;
