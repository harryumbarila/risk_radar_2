import type { Metadata } from 'next';
import type { FC } from 'react';

import { CRM } from '@/components/Dashboard/CRM';
import { DefaultLayout } from '@/components/Layouts/DefaultLayout';

export const metadata: Metadata = {
  title: 'Next.js CRM Dashboard | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js CRM Dashboard page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
  // other metadata
};

const CrmPage: FC = () => {
  return (
    <DefaultLayout>
      <CRM />
    </DefaultLayout>
  );
};

export default CrmPage;
