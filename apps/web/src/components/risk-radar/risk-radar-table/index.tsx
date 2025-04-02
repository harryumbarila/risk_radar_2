'use client';

import type { FC } from 'react';

import type { PaginatedAPIResponse } from '@/shared/common';
import type {
  RiskRadarExceptionsListRow,
  RiskRadarFilterState,
} from '@/shared/response';

import { RiskRadarTable } from './risk-radar-table';

export type RiskRadarTableComponentProps = {
  data: PaginatedAPIResponse<RiskRadarExceptionsListRow>;
  status: number;
  filters: RiskRadarFilterState;
  fetchData: (filters: RiskRadarFilterState) => void;
};

export const RiskRadarTableComponent: FC<RiskRadarTableComponentProps> = ({
  data,
  status,
  filters,
  fetchData,
}) => {
  return (
    <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
      <RiskRadarTable
        exceptionList={data}
        status={status}
        filters={filters}
        fetchData={fetchData}
      />
    </div>
  );
};
