'use client';

import { Breadcrumb } from '@/ui/common/breadcrumbs/breadcrumb';
import { ImagesOne } from '@/ui/common/images/images-one';
import { ImagesTwo } from '@/ui/common/images/images-two';

export const Images: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Images" />

      <div className="flex flex-col gap-7.5">
        <ImagesOne />
        <ImagesTwo />
      </div>
    </>
  );
};
