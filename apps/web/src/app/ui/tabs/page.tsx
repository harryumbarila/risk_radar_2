import type { Metadata } from 'next';
import type { FC } from 'react';

import { DefaultLayout } from '@/components/Layouts/DefaultLayout';
import { Tabs } from '@/components/Tabs';

export const metadata: Metadata = {
  title: 'Next.js Tabs | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js Tabs page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
  // other metadata
};

const TabsPage: FC = () => {
  return (
    <DefaultLayout>
      <Tabs />
    </DefaultLayout>
  );
};

export default TabsPage;
