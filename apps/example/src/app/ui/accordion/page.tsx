import { Accordion, DefaultLayout } from '@denali/ui';
import type { Metadata } from 'next';
import type { FC } from 'react';

export const metadata: Metadata = {
  title: 'Next.js Accordion | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js Accordion page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
  // other metadata
};

const AccordionPage: FC = () => {
  return (
    <DefaultLayout>
      <Accordion />
    </DefaultLayout>
  );
};

export default AccordionPage;
