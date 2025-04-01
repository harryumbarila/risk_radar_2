'use client';

import type { FC } from 'react';

import type { PaginatedAPIResponse } from '@/shared/common';
import type { RiskRadarExceptionsListRow } from '@/shared/response';

import { RiskRadarTable } from './risk-radar-table';

export type RiskRadarTableComponentProps = {
  data: PaginatedAPIResponse<RiskRadarExceptionsListRow>;
  status: number;
};

export const RiskRadarTableComponent: FC<RiskRadarTableComponentProps> = ({
  data,
  status,
}) => {
  return (
    <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
      <RiskRadarTable data={data} status={status} />
    </div>
  );
};
