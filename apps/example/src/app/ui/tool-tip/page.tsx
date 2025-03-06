import { Breadcrumb, TooltipsOne, TooltipsTwo } from '@denali/ui';
import type { Metadata } from 'next';
import React from 'react';

import { DefaultLayout } from '@/components/layouts/default-layout';

export const metadata: Metadata = {
  title: 'Next.js Tooltips | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js Tooltips page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
};

const Tooltips: React.FC = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tooltips" />

      <div className="flex flex-col gap-7.5">
        <TooltipsOne />
        <TooltipsTwo />
      </div>
    </DefaultLayout>
  );
};

export default Tooltips;
