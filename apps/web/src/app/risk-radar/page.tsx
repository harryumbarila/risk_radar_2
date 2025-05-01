'use client';

import { Breadcrumb } from '@denali/ui';
import type { FC } from 'react';
import { useEffect, useMemo } from 'react';

import { ScrollLayout } from '@/components/layouts/scroll-layout';
import { RiskRadarFilters } from '@/components/risk-radar/filters';
import { useFilteredRiskRadar } from '@/hooks/risk-radar/use-filtered-risk-radar';
import type { CommonStatus } from '@/shared/common';
import { useSidebarStore } from '@/stores/sidebar';
import { RiskRadarTable } from '@/web/src/components/risk-radar/risk-radar-table/risk-radar-table';

const RiskRadar: FC = () => {
  const { data, isLoading, error, fetchData, filters } = useFilteredRiskRadar();
  const { sidebarOpen, sidebarExpanded } = useSidebarStore();

  useEffect(() => {
    fetchData(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const status = useMemo<CommonStatus | undefined>(() => {
    if (isLoading) return 'loading';
    if (error) return 'error';

    return undefined;
  }, [isLoading, error]);

  return (
    <ScrollLayout>
      <div
        style={{
          width: `calc(100vw - ${sidebarOpen || sidebarExpanded ? 324 : 128}px)`, // Subtract padding and sidebar
        }}
      >
        <Breadcrumb pageName="Risk Radar" />

        <RiskRadarFilters onSubmit={fetchData} />
      </div>
      <div className="mt-4">
        <RiskRadarTable
          exceptionList={data}
          status={Number(filters.status)}
          filters={filters}
          fetchData={fetchData}
          dataStatus={status}
        />
      </div>
    </ScrollLayout>
  );
};

export default RiskRadar;
