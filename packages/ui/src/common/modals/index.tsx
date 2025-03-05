'use client';

import { Breadcrumb } from '@/ui/common/breadcrumbs/breadcrumb';
import { ModalOne } from '@/ui/common/modals/modal-one';
import { ModalThree } from '@/ui/common/modals/modal-three';
import { ModalTwo } from '@/ui/common/modals/modal-two';

export const Modals: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Modals" />

      <div className="rounded-sm border border-stroke bg-white p-10 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap justify-center gap-5">
          <ModalOne />
          <ModalTwo />
          <ModalThree />
        </div>
      </div>
    </>
  );
};
