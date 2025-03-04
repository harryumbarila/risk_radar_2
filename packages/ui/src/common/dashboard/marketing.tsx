'use client';

import React from 'react';

import { ChartFive } from '@/ui/common/charts/chart-five';
import { ChartSix } from '@/ui/common/charts/chart-six';
import { DataStatsTwo } from '@/ui/common/data-stats/data-stats-two';
import { ExternalLink } from '@/ui/common/external-link';
import { FeaturedCampaigns } from '@/ui/common/featured-campaigns';
import { Feedback } from '@/ui/common/feedback';
import { TableFour } from '@/ui/common/tables/table-four';

export const Marketing: React.FC = () => {
  return (
    <>
      <DataStatsTwo />

      <div className="mt-7.5 grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <TableFour />
        <ChartFive />
        <ExternalLink />
        <div className="col-span-12 xl:col-span-7">
          <ChartSix />
        </div>
        <FeaturedCampaigns />
        <Feedback />
      </div>
    </>
  );
};
