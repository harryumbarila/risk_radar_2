import { useEffect, useState } from 'react';

import useBaseApi from '@/hooks/useBaseApi';
import type { RiskRadarResponseDto } from '@/shared/response';

export type FilterState = {
  from_date: string;
  to_date: string;
  status: string;
  assigned_to: string;
  MID: string | null;
  dba_or_sic: string | null;
  exception_type: string[];
  view_all_exceptions: boolean;
  source_type: string;
  current_page: number;
  records_per_page: number;
};

type UseFilteredRiskRadarReturnType = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  data: RiskRadarResponseDto | null;
  isLoading: boolean;
  error: Error | null;
};

export const useFilteredRiskRadar = (): UseFilteredRiskRadarReturnType => {
  const { makeRequest } = useBaseApi();

  const [filters, setFilters] = useState<FilterState>({
    from_date: '',
    to_date: '',
    status: '',
    assigned_to: '',
    MID: null,
    dba_or_sic: null,
    exception_type: [],
    view_all_exceptions: false,
    source_type: '0',
    current_page: 1,
    records_per_page: 10,
  });

  const [data, setData] = useState<RiskRadarResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized && filters.exception_type.length === 0) {
      return;
    }

    const fetchData = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          from_date: filters.from_date,
          to_date: filters.to_date,
          status: filters.status,
          assigned_to: filters.assigned_to,
          MID: filters.MID || 'null',
          dba_or_sic: filters.dba_or_sic || 'null',
          exception_type: filters.exception_type.join(', '),
          view_all_exceptions: filters.view_all_exceptions ? '1' : '0',
          source_type: filters.source_type,
          current_page: filters.current_page.toString(),
          records_per_page: filters.records_per_page.toString(),
        });

        const result = await makeRequest<RiskRadarResponseDto>(
          `/v1/legacy_dashboard_proxy/risk_radar?${queryParams.toString()}`
        );
        setData(result);
        setIsInitialized(true);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData().catch(() => {});
  }, [filters, isInitialized, makeRequest]);

  return { filters, setFilters, data, isLoading, error };
};
