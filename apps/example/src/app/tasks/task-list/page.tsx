import { TaskList } from '@denali/ui';
import type { Metadata } from 'next';
import type { FC } from 'react';

import { DefaultLayout } from '@/components/layouts/default-layout';

export const metadata: Metadata = {
  title: 'Next.js List | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js List page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
};
const TaskListPage: FC = () => {
  return (
    <DefaultLayout>
      <TaskList />
    </DefaultLayout>
  );
};

export default TaskListPage;
