'use client';

import { Breadcrumb, Loader } from '@denali/ui';
import type { FC } from 'react';
import { useMemo } from 'react';

import { DefaultLayout } from '@/components/layouts/default-layout';
import { RiskRadarFilters } from '@/components/risk-radar/filters';
import { RiskRadarTableComponent } from '@/components/risk-radar/risk-radar-table';
import { useFilteredRiskRadar } from '@/hooks/risk-radar/use-filtered-risk-radar';

const RiskRadar: FC = () => {
  const {
    data: filteredData,
    isLoading: filterLoading,
    error: filterError,
    fetchData,
    filters,
  } = useFilteredRiskRadar();

  const filterComponent = useMemo((): JSX.Element => {
    if (filterLoading) {
      return <Loader size="small" fullScreen={false} />;
    }

    if (filterError) {
      return (
        <div className="flex h-56 items-center justify-center">
          <p className="text-red-500">Error fetching data</p>
        </div>
      );
    }

    if (filteredData) {
      return (
        <RiskRadarTableComponent
          data={filteredData}
          status={Number(filters.status)}
          filters={filters}
          fetchData={fetchData}
        />
      );
    }

    return <div>No data available</div>;
  }, [fetchData, filterError, filterLoading, filteredData, filters]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Risk Radar" />

      <RiskRadarFilters
        onSubmit={(filtersToApply) => {
          fetchData(filtersToApply);
        }}
      />

      <div className="mt-4">{filterComponent}</div>
    </DefaultLayout>
  );
};

export default RiskRadar;
