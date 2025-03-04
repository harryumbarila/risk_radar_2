import { DefaultLayout, FormElements } from '@denali/ui';
import type { Metadata } from 'next';
import type { FC } from 'react';

export const metadata: Metadata = {
  title: 'Next.js Form Elements | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
};

const FormElementsPage: FC = () => {
  return (
    <DefaultLayout>
      <FormElements />
    </DefaultLayout>
  );
};

export default FormElementsPage;
