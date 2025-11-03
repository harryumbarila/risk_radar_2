'use client';
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
    onSetPagination,
    initialItemsPerPage,
    data,
    CollapsibleBody,
    enablePagination,
  } = props;

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: initialItemsPerPage || 50,
    });
  const [sorting, setSorting] = React.useState<SortingState>([]);

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

  // eslint-disable-next-line react-hooks/incompatible-library
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

  const [selectedValue, setSelectedValue] = React.useState<string[]>([
    `${table.getState().pagination.pageSize}`,
  ]);
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
      {enablePagination ? (
        <Flex
          as="nav"
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'flex-start', md: 'center' }}
          px={2}
          aria-label="Table navigation"
          gap={3}
        >
          <Text fontWeight="normal" color="gray.500">
            <Text as="span" fontWeight="semibold" color="gray.900">
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount().toLocaleString()}
            </Text>
          </Text>

          <Flex gap={5} align="center">
            <Flex align="center">
              <Text mr={2}>Entries per Page</Text>

              <Select.Root
                collection={pageSizeOptions}
                width="120px"
                value={selectedValue}
                onValueChange={(e) => {
                  setSelectedValue(e.value);
                  table.setPageSize(Number(e.value[0]));
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
              count={table.getPageCount()}
              pageSize={1}
              page={pageIndex + 1}
              onPageChange={(details) => {
                table.setPageIndex(details.page - 1);
              }}
            >
              <ButtonGroup size="sm" variant="ghost">
                <Pagination.PrevTrigger asChild>
                  <IconButton
                    aria-label="Previous page"
                    disabled={pageIndex === 0}
                  >
                    <MdArrowLeft />
                  </IconButton>
                </Pagination.PrevTrigger>

                <Pagination.Items
                  render={(page) => (
                    <IconButton
                      key={page.value}
                      aria-label={`Page ${page.value}`}
                      variant={page.value ? 'outline' : 'ghost'}
                      onClick={() => table.setPageIndex(page.value - 1)}
                    >
                      {page.value}
                    </IconButton>
                  )}
                />
                <Pagination.NextTrigger asChild>
                  <IconButton
                    aria-label="Next page"
                    disabled={pageIndex >= pageCount - 1}
                  >
                    <MdArrowRight />
                  </IconButton>
                </Pagination.NextTrigger>
              </ButtonGroup>
            </Pagination.Root>
          </Flex>
        </Flex>
      ) : null}
    </Table.ScrollArea>
  );
};

export default DataTable;
