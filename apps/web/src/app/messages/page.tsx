import type { Metadata } from 'next';
import type { FC } from 'react';

import { DefaultLayout } from '@/components/Layouts/DefaultLayout';
import { Messages } from '@/components/Messages';

export const metadata: Metadata = {
  title: 'Next.js Messages | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js Messages page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
  // other metadata
};

const MessagesPage: FC = () => {
  return (
    <DefaultLayout>
      <Messages />
    </DefaultLayout>
  );
};

export default MessagesPage;
