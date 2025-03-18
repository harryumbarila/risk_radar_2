'use client';

import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

import { DataTable } from '../../components/data-table';
import type { BlacklistedEntry } from '../../hooks/blacklist/use-get-blacklist';
import { useBlacklistedEntries } from '../../hooks/blacklist/use-get-blacklist';

const ITEMS_PER_PAGE = 20;

const TextCell = ({ value }: { value: string | number }) => (
  <span className="text-sm font-medium text-gray-900">{value}</span>
);

const DateCell = ({ value }: { value: string }) => (
  <span className="text-sm text-gray-700">
    {new Intl.DateTimeFormat('en-US').format(new Date(value))}
  </span>
);

const StatusCell = ({ value }: { value: boolean }) => {
  const status = value ? 'Removed' : 'Active';
  const color = value ? 'text-red-600' : 'text-green-600';
  return <span className={`text-sm font-medium ${color}`}>{status}</span>;
};

const columnHelper = createColumnHelper<BlacklistedEntry>();

const columns = [
  columnHelper.accessor('id', {
    header: () => 'MID',
    cell: (info) => <TextCell value={info.getValue()} />,
    footer: (info) => info.column.id,
    enableSorting: true,
  }),
  columnHelper.accessor('createdAt', {
    header: () => 'Created At',
    cell: (info) => <DateCell value={info.getValue()} />,
    footer: (info) => info.column.id,
    enableSorting: true,
  }),
  columnHelper.accessor('returnCode', {
    header: () => 'Return Code',
    cell: (info) => <TextCell value={info.getValue()} />,
    footer: (info) => info.column.id,
    enableSorting: true,
  }),
  columnHelper.accessor('route', {
    header: () => 'Route',
    cell: (info) => <TextCell value={info.getValue()} />,
    footer: (info) => info.column.id,
    enableSorting: true,
  }),
  columnHelper.accessor('account', {
    header: () => 'Account',
    cell: (info) => <TextCell value={info.getValue()} />,
    footer: (info) => info.column.id,
    enableSorting: true,
  }),
  columnHelper.accessor('count', {
    header: () => 'MID/ISA Count',
    cell: (info) => <TextCell value={info.getValue()} />,
    footer: (info) => info.column.id,
    enableSorting: true,
  }),
  columnHelper.accessor('removed', {
    header: () => 'Status',
    cell: (info) => <StatusCell value={info.getValue()} />,
    footer: (info) => info.column.id,
    enableSorting: true,
  }),
];

const BlackListPage: React.FC = () => {
  const { data, loading } = useBlacklistedEntries(1, 20);

  // Define the columns

  if (!data) {
    return <div>Not found</div>;
  }

  return (
    <main>
      <h1>BlackListPage</h1>

      <DataTable
        columns={columns}
        data={data}
        isLoading={loading}
        initialItemsPerPage={ITEMS_PER_PAGE}
      />
    </main>
  );
};

export default BlackListPage;
