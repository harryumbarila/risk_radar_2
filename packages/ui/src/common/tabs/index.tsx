'use client';

import { Breadcrumb } from '@/ui/common/breadcrumbs/breadcrumb';
import { TabOne } from '@/ui/common/tabs/tab-one';
import { TabThree } from '@/ui/common/tabs/tab-three';
import { TabTwo } from '@/ui/common/tabs/tab-two';

export const Tabs: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Tabs" />

      <div className="flex flex-col gap-9">
        <TabOne />
        <TabTwo />
        <TabThree />
      </div>
    </>
  );
};
