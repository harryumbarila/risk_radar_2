import {
  Breadcrumb,
  PaginationOne,
  PaginationThree,
  PaginationTwo,
} from '@denali/ui';
import type { Metadata } from 'next';
import React from 'react';

import { DefaultLayout } from '@/components/layouts/default-layout';

export const metadata: Metadata = {
  title: 'Next.js Pagination | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js Pagination page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
};

const Pagination: React.FC = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Pagination" />

      <div className="flex flex-col gap-7.5">
        <PaginationOne />
        <PaginationTwo />
        <PaginationThree />
      </div>
    </DefaultLayout>
  );
};

export default Pagination;
