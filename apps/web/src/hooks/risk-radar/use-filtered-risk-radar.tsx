import { useState } from 'react';

import useBaseApi from '@/hooks/use-base-api';
import type { PaginatedAPIResponse } from '@/shared/common';
import type {
  RiskRadarExceptionsListRow,
  RiskRadarFilterState,
} from '@/shared/response';
import { defaultRiskRadarFilters } from '@/shared/response/risk-radar/exception-list/filter-state';

type UseFilteredRiskRadarReturnType = {
  filters: RiskRadarFilterState;
  setFilters: React.Dispatch<React.SetStateAction<RiskRadarFilterState>>;
  data: PaginatedAPIResponse<RiskRadarExceptionsListRow> | null;
  isLoading: boolean;
  error: Error | null;
  fetchData: (filtersToApply?: RiskRadarFilterState) => void;
};

export const useFilteredRiskRadar = (): UseFilteredRiskRadarReturnType => {
  const { makeRequest } = useBaseApi();

  const [filters, setFilters] = useState<RiskRadarFilterState>(
    defaultRiskRadarFilters
  );

  const [data, setData] =
    useState<PaginatedAPIResponse<RiskRadarExceptionsListRow> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createQuery = (filtersToApply: RiskRadarFilterState): string => {
    const urlQueryParams = new URLSearchParams();

    Object.entries(filtersToApply).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            urlQueryParams.append(key, String(item));
          });
        } else {
          urlQueryParams.set(key, String(value));
        }
      }
    });

    return urlQueryParams.toString();
  };

  const fetchData = async (
    filtersToApply?: RiskRadarFilterState
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const queryParams = createQuery(
        filtersToApply ?? defaultRiskRadarFilters
      );

      const result = await makeRequest<
        PaginatedAPIResponse<RiskRadarExceptionsListRow>
      >(`/v1/risk-radar/exception-list?${queryParams}`);

      setData(result);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { filters, setFilters, data, isLoading, error, fetchData };
};
