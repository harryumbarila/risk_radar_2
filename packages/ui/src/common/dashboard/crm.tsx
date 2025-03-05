'use client';

import React from 'react';

import { ChartEight } from '@/ui/common/charts/chart-eight';
import { ChartNine } from '@/ui/common/charts/chart-nine';
import { ChartSeven } from '@/ui/common/charts/chart-seven';
import { DataStatsThree } from '@/ui/common/data-stats/data-stats-three';
import { LeadsReport } from '@/ui/common/leads-report';
import { ToDoList } from '@/ui/common/todo/to-do-list';

export const CRM: React.FC = () => {
  return (
    <>
      <DataStatsThree />

      <div className="mt-7.5 grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-7">
          <ChartSeven />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <ChartEight />
        </div>

        <LeadsReport />

        <div className="col-span-12 xl:col-span-5">
          <ChartNine />
        </div>

        <ToDoList />
      </div>
    </>
  );
};
