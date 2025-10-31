import React from 'react';

import { DefaultLayout } from '@/components/layouts/default-layout';

const DashboardLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <DefaultLayout>{children}</DefaultLayout>;
};

export default DashboardLayout;
