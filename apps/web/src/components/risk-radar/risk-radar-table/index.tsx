'use client';

import type { FC } from 'react';

import type {
  RiskRadarResponseDto,
  RiskUser,
} from '@/shared/response/legacy-dashboard-proxy';
import type { FilterState } from '@/web/src/hooks/risk-radar/use-filtered-risk-radar';

import { RiskRadarTable } from './risk-radar-table';

export type RiskRadarTableComponentProps = {
  data: RiskRadarResponseDto;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  status: number;
  riskUsers: { risk_users: RiskUser[] };
  filters: FilterState;
};

export const RiskRadarTableComponent: FC<RiskRadarTableComponentProps> = ({
  data,
  setFilters,
  status,
  riskUsers,
  filters,
}) => {
  return (
    <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
      <RiskRadarTable
        // TODO: Fix this from inferring the type
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        data={data as any}
        filters={filters}
        setFilters={setFilters}
        status={status}
        riskUsers={riskUsers}
      />
    </div>
  );
};
