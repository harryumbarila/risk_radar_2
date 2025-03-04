import {
  Breadcrumb,
  DefaultLayout,
  TableOne,
  TableThree,
  TableTwo,
} from '@denali/ui';
import type { Metadata } from 'next';
import type { FC } from 'react';

export const metadata: Metadata = {
  title: 'Next.js Tables | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
};

const TablesPage: FC = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <TableOne />
        <TableTwo />
        <TableThree />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
