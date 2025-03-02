import type { Metadata } from 'next';
import React from 'react';

import { Breadcrumb } from '@/components/Breadcrumbs/Breadcrumb';
import { DefaultLayout } from '@/components/Layouts/DefaultLayout';
import { NotificationsFour } from '@/components/Notifications/NotificationsFour';
import { NotificationsThree } from '@/components/Notifications/NotificationsThree';
import { NotificationsTwo } from '@/components/Notifications/NotificationsTwo';

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
