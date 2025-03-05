'use client';

import { Breadcrumb } from '@/ui/common/breadcrumbs/breadcrumb';
import { ProgressFour } from '@/ui/common/progress/progress-four';
import { ProgressOne } from '@/ui/common/progress/progress-one';
import { ProgressThree } from '@/ui/common/progress/progress-three';
import { ProgressTwo } from '@/ui/common/progress/progress-two';

export const Progress: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Progress" />

      <div className="flex flex-col gap-7.5">
        <ProgressOne />
        <ProgressTwo />
        <ProgressThree />
        <ProgressFour />
      </div>
    </>
  );
};
