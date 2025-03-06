'use client';

import { Breadcrumb } from '@/ui/common/breadcrumbs/breadcrumb';
import { ChartOne } from '@/ui/common/charts/chart-one';
import { ChartThree } from '@/ui/common/charts/chart-three';
import { ChartTwo } from '@/ui/common/charts/chart-two';

export const BasicChart: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Basic Chart" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
      </div>
    </>
  );
};
