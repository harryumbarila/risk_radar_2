'use client';

import React from 'react';

import { ChartTwelve } from '@/ui/common/charts/chart-twelve';
import { DataStatsFour } from '@/ui/common/data-stats/data-stats-four';
import { LatestTransaction } from '@/ui/common/stocks/latest-transaction';
import { MyStocks } from '@/ui/common/stocks/my-stocks';
import { TrendingStocks } from '@/ui/common/stocks/trending-stocks';

export const Stocks: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-9">
      {/* <!-- ====== Data Stats Start --> */}
      <DataStatsFour />
      {/* <!-- ====== Data Stats End --> */}

      {/* <!-- ====== Chart Twelve Start --> */}
      <ChartTwelve />
      {/* <!-- ====== Chart Twelve End --> */}

      {/* <!-- ====== My Stocks Start --> */}
      <MyStocks />
      {/* <!-- ====== My Stocks End --> */}

      {/* <!-- ====== Trending Stocks Start --> */}
      <TrendingStocks />
      {/* <!-- ====== Trending Stocks End --> */}

      {/* <!-- ====== Latest Transaction Start --> */}
      <LatestTransaction />
      {/* <!-- ====== Latest Transaction End --> */}
    </div>
  );
};
