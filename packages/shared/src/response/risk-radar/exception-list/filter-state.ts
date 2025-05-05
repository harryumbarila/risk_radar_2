export type RiskRadarFilterState = {
  startDate: string;
  endDate: string;
  processor: number;
  viewAllExceptions?: boolean;

  categories?: string[];

  status: number;
  assignedToUser?: number | undefined;
  merchantId?: string | null;
  dbaNameOrSIC?: string | null;

  exceptionType?: string[];

  sourceType?: number;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
};
