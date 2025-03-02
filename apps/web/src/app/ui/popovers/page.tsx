import type { Metadata } from 'next';
import type { FC } from 'react';
import React from 'react';

import { DefaultLayout } from '@/components/Layouts/DefaultLayout';
import { Popovers } from '@/components/Popovers';

export const metadata: Metadata = {
  title: 'Next.js Popovers | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js Popovers page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
};

const PopOversPage: FC = () => {
  return (
    <DefaultLayout>
      <Popovers />
    </DefaultLayout>
  );
};

export default PopOversPage;
