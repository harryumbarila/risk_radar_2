import { Calendar } from '@denali/ui';
import type { Metadata } from 'next';
import type { FC } from 'react';

import { DefaultLayout } from '@/components/layouts/default-layout';

export const metadata: Metadata = {
  title: 'Next.js Calender | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template',
  // other metadata
};

const CalendarPage: FC = () => {
  return (
    <DefaultLayout>
      <Calendar />
    </DefaultLayout>
  );
};

export default CalendarPage;
