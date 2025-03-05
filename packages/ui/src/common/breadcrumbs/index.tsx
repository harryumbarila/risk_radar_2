'use client';

import { Breadcrumb } from '@/ui/common/breadcrumbs/breadcrumb';
import { BreadcrumbOne } from '@/ui/common/breadcrumbs/breadcrumb-one';
import { BreadcrumbThree } from '@/ui/common/breadcrumbs/breadcrumb-three';
import { BreadcrumbTwo } from '@/ui/common/breadcrumbs/breadcrumb-two';

export const Breadcrumbs: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Breadcrumb" />

      <div className="flex flex-col gap-7.5">
        <BreadcrumbOne />
        <BreadcrumbTwo />
        <BreadcrumbThree />
      </div>
    </>
  );
};
