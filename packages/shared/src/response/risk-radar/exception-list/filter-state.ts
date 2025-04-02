export type RiskRadarFilterState = {
  startDate: string;
  endDate: string;
  processor: number;
  viewAllExceptions?: boolean;

  categories?: string[];

  status?: number;
  assignedToUser?: number;
  merchantId?: string | null;
  dbaNameOrSIC?: string | null;

  exceptionType?: string[];

  sourceType?: number;
  page: number;
  pageSize: number;
};

export const defaultRiskRadarFilters: RiskRadarFilterState = {
  startDate: new Date().toISOString().split('T')[0] ?? '',
  endDate: new Date().toISOString().split('T')[0] ?? '',
  processor: 0,
  viewAllExceptions: false,
  categories: [],
  status: undefined,
  assignedToUser: undefined,
  merchantId: undefined,
  dbaNameOrSIC: undefined,
  sourceType: undefined,
  page: 1,
  pageSize: 10,
};
