'use client';

import { Breadcrumb, Loader } from '@denali/ui';
import type { FC } from 'react';
import { useMemo } from 'react';

import { DefaultLayout } from '@/components/layouts/default-layout';
import { RiskRadarFilters } from '@/components/risk-radar/filters';
import { useFilteredRiskRadar } from '@/hooks/risk-radar/use-filtered-risk-radar';
import { RiskRadarTable } from '@/web/src/components/risk-radar/risk-radar-table/risk-radar-table';

const RiskRadar: FC = () => {
  const { data, isLoading, error, fetchData, filters } = useFilteredRiskRadar();

  const renderedComponent = useMemo((): JSX.Element => {
    if (isLoading) {
      return <Loader size="small" fullScreen={false} />;
    }

    if (error) {
      return (
        <div className="flex h-56 items-center justify-center">
          <p className="text-red-500">Error fetching data</p>
        </div>
      );
    }

    if (data) {
      return (
        <RiskRadarTable
          exceptionList={data}
          status={Number(filters.status)}
          filters={filters}
          fetchData={fetchData}
        />
      );
    }

    return <div>No data available</div>;
  }, [data, error, fetchData, filters, isLoading]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Risk Radar" />

      <RiskRadarFilters
        onSubmit={(filtersToApply) => {
          fetchData(filtersToApply);
        }}
      />

      <div className="mt-4">{renderedComponent}</div>
    </DefaultLayout>
  );
};

export default RiskRadar;
