import type { Metadata } from 'next';
import type { FC } from 'react';

import { DefaultLayout } from '@/components/Layouts/DefaultLayout';
import { Modals } from '@/components/Modals';

export const metadata: Metadata = {
  title: 'Next.js Modals | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js Modals page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
  // other metadata
};

const ModalPage: FC = () => {
  return (
    <DefaultLayout>
      <Modals />
    </DefaultLayout>
  );
};

export default ModalPage;
