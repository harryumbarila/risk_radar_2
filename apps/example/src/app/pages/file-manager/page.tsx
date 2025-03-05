import { FileManager } from '@denali/ui';
import type { Metadata } from 'next';
import type { FC } from 'react';

import { DefaultLayout } from '@/components/layouts/default-layout';

export const metadata: Metadata = {
  title: 'Next.js FileManager | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js FileManager page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
  // other metadata
};

const FileManagerPage: FC = () => {
  return (
    <DefaultLayout>
      <FileManager />
    </DefaultLayout>
  );
};

export default FileManagerPage;
