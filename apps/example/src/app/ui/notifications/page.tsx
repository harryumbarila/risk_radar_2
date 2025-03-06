import {
  Breadcrumb,
  NotificationsFour,
  NotificationsThree,
  NotificationsTwo,
} from '@denali/ui';
import type { Metadata } from 'next';
import React from 'react';

import { DefaultLayout } from '@/components/layouts/default-layout';

export const metadata: Metadata = {
  title: 'Next.js Notifications | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js Notifications page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
};

const Notifications: React.FC = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Notifications" />

      <div className="flex flex-col gap-7.5">
        <NotificationsTwo />
        <NotificationsThree />
        <NotificationsFour />
      </div>
    </DefaultLayout>
  );
};

export default Notifications;
