'use client';

import { Breadcrumb } from '@/ui/common/breadcrumbs/breadcrumb';
import { PopoversOne } from '@/ui/common/popovers/popovers-one';
import { PopoversTwo } from '@/ui/common/popovers/popovers-two';

export const Popovers: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Popovers" />

      <div className="flex flex-col gap-7.5">
        <PopoversOne />
        <PopoversTwo />
      </div>
    </>
  );
};
