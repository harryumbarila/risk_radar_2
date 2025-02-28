import type { Metadata } from 'next';
import type { FC } from 'react';

import { DefaultLayout } from '@/components/Layouts/DefaultLayout';
import { TaskKanban } from '@/components/Tasks/KanbanTasks';

export const metadata: Metadata = {
  title: 'Next.js Kanban | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js Kanban page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
  // other metadata
};

const TaskKanbanPage: FC = () => {
  return (
    <DefaultLayout>
      <TaskKanban />
    </DefaultLayout>
  );
};

export default TaskKanbanPage;
