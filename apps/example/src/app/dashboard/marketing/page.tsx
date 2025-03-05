import { Marketing } from '@denali/ui';
import type { Metadata } from 'next';
import type { FC } from 'react';

import { DefaultLayout } from '@/components/layouts/default-layout';

export const metadata: Metadata = {
  title:
    'Next.js Marketing Dashboard | TailAdmin - Next.js Admin Dashboard Template',
  description:
    'This is Next.js Marketing Dashboard page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
};

const MarketingPage: FC = () => {
  return (
    <DefaultLayout>
      <Marketing />
    </DefaultLayout>
  );
};

export default MarketingPage;
