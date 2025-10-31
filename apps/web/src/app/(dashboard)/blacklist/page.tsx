'use client';

import { Breadcrumb, DataTable, DynamicCell } from '@denali/ui';
import type { ColumnDef, PaginationState } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

import type { BlacklistedEntry } from '@/hooks/blacklist/use-get-blacklist';
import { useBlacklistedEntries } from '@/hooks/blacklist/use-get-blacklist';

const ITEMS_PER_PAGE = 20;

const columnHelper = createColumnHelper<BlacklistedEntry>();

const columns = [
  columnHelper.accessor('id', {
    header: () => 'MID',
    cell: (info) => <DynamicCell type="text" value={info.getValue()} />,

    enableSorting: true,
  }),
  columnHelper.accessor('account', {
    header: () => 'Account',
    cell: (info) => <DynamicCell type="text" value={info.getValue()} />,

    enableSorting: true,
  }),
  columnHelper.accessor('returnCode', {
    header: () => 'Return Code',
    cell: (info) => <DynamicCell type="text" value={info.getValue()} />,

    enableSorting: true,
  }),
  columnHelper.accessor('route', {
    header: () => 'Route',
    cell: (info) => <DynamicCell type="text" value={info.getValue()} />,

    enableSorting: true,
  }),
  columnHelper.accessor('removed', {
    header: () => 'Status',
    cell: (info) => <DynamicCell type="status" value={info.getValue()} />,

    enableSorting: true,
  }),
  columnHelper.accessor('count', {
    header: () => 'MID/ISA Count',
    cell: (info) => <DynamicCell type="text" value={info.getValue()} />,

    enableSorting: true,
  }),
  columnHelper.accessor('createdAt', {
    header: () => 'Created At',
    cell: (info) => <DynamicCell type="date" value={info.getValue()} />,

    enableSorting: true,
  }),
  columnHelper.display({
    id: 'actions',
    header: () => 'Actions',
    cell: (props) => (
      <DynamicCell
        type="actions"
        row={props.row}
        iconOnly
        onEdit={() => {}}
        onDelete={() => {}}
      />
    ),
  }),
] as ColumnDef<BlacklistedEntry>[];

const BlackListPage: React.FC = () => {
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 1,
      pageSize: ITEMS_PER_PAGE,
    });

  const { data, loading } = useBlacklistedEntries(pageIndex, pageSize);

  if (!data) {
    return <div>Not found</div>;
  }

  return (
    <>
      <Breadcrumb pageName="BlackList ACH Page" />
      <main>
        <DataTable
          columns={columns}
          data={data}
          isLoading={loading}
          initialItemsPerPage={ITEMS_PER_PAGE}
          onSetPagination={setPagination}
        />
      </main>
    </>
  );
};

export default BlackListPage;
