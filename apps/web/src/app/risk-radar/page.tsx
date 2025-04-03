'use client';

import { Breadcrumb } from '@denali/ui';
import type { FC } from 'react';
import { useMemo } from 'react';

import { DefaultLayout } from '@/components/layouts/default-layout';
import { RiskRadarFilters } from '@/components/risk-radar/filters';
import { useFilteredRiskRadar } from '@/hooks/risk-radar/use-filtered-risk-radar';
import type { CommonStatus } from '@/shared/common';
import { RiskRadarTable } from '@/web/src/components/risk-radar/risk-radar-table/risk-radar-table';

const RiskRadar: FC = () => {
  const { data, isLoading, error, fetchData, filters } = useFilteredRiskRadar();

  const status = useMemo<CommonStatus | undefined>(() => {
    if (isLoading) return 'loading';
    if (error) return 'error';

    return undefined;
  }, [isLoading, error]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Risk Radar" />

      <RiskRadarFilters onSubmit={fetchData} />

      <div className="mt-4">
        <RiskRadarTable
          exceptionList={data}
          status={Number(filters.status)}
          filters={filters}
          fetchData={fetchData}
          dataStatus={status}
        />
      </div>
    </DefaultLayout>
  );
};

export default RiskRadar;
