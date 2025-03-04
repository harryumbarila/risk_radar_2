import { DefaultLayout, Images } from '@denali/ui';
import type { Metadata } from 'next';
import type { FC } from 'react';

export const metadata: Metadata = {
  title: 'Next.js Images | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js Images page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
  // other metadata
};

const ImagesPage: FC = () => {
  return (
    <DefaultLayout>
      <Images />
    </DefaultLayout>
  );
};

export default ImagesPage;
