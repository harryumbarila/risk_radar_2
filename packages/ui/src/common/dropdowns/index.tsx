'use client';

import { Breadcrumb } from '@/ui/common/breadcrumbs/breadcrumb';
import { DropdownsOne } from '@/ui/common/dropdowns/dropdowns-one';
import { DropdownsThree } from '@/ui/common/dropdowns/dropdowns-three';
import { DropdownsTwo } from '@/ui/common/dropdowns/dropdowns-two';

export const Dropdowns: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Dropdowns" />

      <div className="flex flex-col gap-7.5">
        <DropdownsOne />
        <DropdownsTwo />
        <DropdownsThree />
      </div>
    </>
  );
};
