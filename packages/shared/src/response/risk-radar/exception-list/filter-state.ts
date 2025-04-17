import { getCurrentLocalDate } from '@/shared/utils/date-utils';

export type RiskRadarFilterState = {
  startDate: string;
  endDate: string;
  processor: number;
  viewAllExceptions?: boolean;

  categories?: string[];

  status: number;
  assignedToUser?: number;
  merchantId?: string | null;
  dbaNameOrSIC?: string | null;

  exceptionType?: string[];

  sourceType?: number;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
};

export const defaultRiskRadarFilters: RiskRadarFilterState = {
  startDate: getCurrentLocalDate(),
  endDate: getCurrentLocalDate(),
  processor: 0,
  viewAllExceptions: false,
  categories: [],
  status: 1,
  assignedToUser: undefined,
  merchantId: undefined,
  dbaNameOrSIC: undefined,
  sourceType: undefined,
  page: 1,
  pageSize: 10,
  sortBy: undefined,
  sortDirection: undefined,
};
