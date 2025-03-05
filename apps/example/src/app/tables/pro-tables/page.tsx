import { Breadcrumb, TableFive, TableSix } from '@denali/ui';
import type { Metadata } from 'next';
import type { FC } from 'react';

import { DefaultLayout } from '@/components/layouts/default-layout';

export const metadata: Metadata = {
  title: 'Next.js Pro Tables | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js Pro Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
};

const ProTablesPage: FC = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Pro Tables" />

      <div className="flex flex-col gap-10">
        <TableFive />
        <TableSix />
      </div>
    </DefaultLayout>
  );
};

export default ProTablesPage;
