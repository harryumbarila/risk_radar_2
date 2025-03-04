import { BasicChart, DefaultLayout } from '@denali/ui';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Next.js Basic Chart | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js Basic Chart page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
  // other metadata
};

const BasicChartPage: React.FC = () => {
  return (
    <DefaultLayout>
      <BasicChart />
    </DefaultLayout>
  );
};

export default BasicChartPage;
