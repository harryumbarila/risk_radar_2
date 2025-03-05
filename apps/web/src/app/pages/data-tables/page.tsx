import { DataTables, DefaultLayout } from '@denali/ui';
import type { Metadata } from 'next';
import type { FC } from 'react';

export const metadata: Metadata = {
  title: 'Next.js DataTables | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js DataTables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
  // other metadata
};

const DataTablesPage: FC = () => {
  return (
    <DefaultLayout>
      <DataTables />
    </DefaultLayout>
  );
};

export default DataTablesPage;
