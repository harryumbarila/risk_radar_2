import type { Metadata } from 'next';
import type { FC } from 'react';

import { Breadcrumb } from '@/components/Breadcrumbs/Breadcrumb';
import { DefaultLayout } from '@/components/Layouts/DefaultLayout';
import { ListOne } from '@/components/List/ListOne';
import { ListThree } from '@/components/List/ListThree';
import { ListTwo } from '@/components/List/ListTwo';

export const metadata: Metadata = {
  title: 'Next.js List | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js List page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
};

const ListPage: FC = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="List" />

      <div className="flex flex-col gap-7.5">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke p-4 dark:border-strokedark sm:px-6 xl:px-9">
            <h3 className="font-medium text-black dark:text-white">Style 1</h3>
          </div>

          <div className="p-4 sm:p-6 xl:p-9">
            <ListOne />
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke p-4 dark:border-strokedark sm:px-6 xl:px-9">
            <h3 className="font-medium text-black dark:text-white">Style 2</h3>
          </div>

          <div className="p-4 sm:p-6 xl:p-9">
            <ListTwo />
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke p-4 dark:border-strokedark sm:px-6 xl:px-9">
            <h3 className="font-medium text-black dark:text-white">Style 3</h3>
          </div>

          <div className="p-4 sm:p-6 xl:p-9">
            <ListThree />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ListPage;
