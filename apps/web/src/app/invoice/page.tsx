import type { Metadata } from 'next';
import React from 'react';

import { Breadcrumb } from '@/components/Breadcrumbs/Breadcrumb';
import { InvoiceOne } from '@/components/Invoice/InvoiceOne';
import { InVoiceTwo } from '@/components/Invoice/InvoiceTwo';
import { DefaultLayout } from '@/components/Layouts/DefaultLayout';

export const metadata: Metadata = {
  title: 'Next.js Invoice | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js Invoice page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
};

const Invoice: React.FC = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Invoice" />

      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke p-4 dark:border-strokedark sm:px-6 xl:px-9">
            <h3 className="font-medium text-black dark:text-white">Style 1</h3>
          </div>

          <div className="p-4 sm:p-6 xl:p-9">
            <InvoiceOne />
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke p-4 dark:border-strokedark sm:px-6 xl:px-9">
            <h3 className="font-medium text-black dark:text-white">Style 2</h3>
          </div>

          <div className="p-4 sm:p-6 xl:p-9">
            <InVoiceTwo />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Invoice;
