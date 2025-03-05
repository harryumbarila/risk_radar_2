import { DefaultLayout, Stocks } from '@denali/ui';
import type { Metadata } from 'next';
import type { FC } from 'react';

export const metadata: Metadata = {
  title: 'Next.js Stocks Dashboard | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js Stocks Dashboard page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
};

const StocksPage: FC = () => {
  return (
    <DefaultLayout>
      <Stocks />
    </DefaultLayout>
  );
};

export default StocksPage;
