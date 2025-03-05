import {
  BadgeFour,
  BadgeOne,
  BadgeThree,
  BadgeTwo,
  Breadcrumb,
} from '@denali/ui';
import type { Metadata } from 'next';
import React from 'react';

import { DefaultLayout } from '@/components/layouts/default-layout';

export const metadata: Metadata = {
  title: 'Next.js Badge | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js Badge page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
  // other metadata
};

const Badge: React.FC = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Badge" />

      <div className="flex flex-col gap-7.5">
        <BadgeOne />
        <BadgeTwo />
        <BadgeThree />
        <BadgeFour />
      </div>
    </DefaultLayout>
  );
};

export default Badge;
