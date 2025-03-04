import { DefaultLayout, ProFormElements } from '@denali/ui';
import type { Metadata } from 'next';
import type { FC } from 'react';

export const metadata: Metadata = {
  title: 'Next.js Pro Form Elements | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js Pro Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
};

const ProFormElementsPage: FC = () => {
  return (
    <DefaultLayout>
      <ProFormElements />
    </DefaultLayout>
  );
};

export default ProFormElementsPage;
