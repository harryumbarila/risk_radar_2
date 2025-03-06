'use client';

import React from 'react';

import { Breadcrumb } from '@/ui/common/breadcrumbs/breadcrumb';
import { ChartEight } from '@/ui/common/charts/chart-eight';
import { ChartFour } from '@/ui/common/charts/chart-four';
import { ChartNine } from '@/ui/common/charts/chart-nine';
import { ChartSeven } from '@/ui/common/charts/chart-seven';
import { ChartSix } from '@/ui/common/charts/chart-six';
import { ChartTwelve } from '@/ui/common/charts/chart-twelve';

export const AdvancedChart: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Advanced Chart" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12">
          <ChartFour />
        </div>
        <div className="col-span-12 xl:col-span-7">
          <ChartSeven />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <ChartEight />
        </div>
        <div className="col-span-12 xl:col-span-7">
          <ChartSix />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <ChartNine />
        </div>

        <ChartTwelve />
      </div>
    </>
  );
};
