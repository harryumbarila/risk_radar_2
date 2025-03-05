import { DefaultLayout, Inbox } from '@denali/ui';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Next.js Inbox | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js Inbox page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
};

const InboxPage: React.FC = () => {
  return (
    <DefaultLayout>
      <Inbox />
    </DefaultLayout>
  );
};

export default InboxPage;
