import { useCallback, useState } from 'react';

import useBaseApi from '@/hooks/use-base-api';
import type { CommissionFileResponse } from '@/shared/response';

export type CommissionFilePaginationFilterState = {
  page?: number;
  limit?: number;
};

export type UseFilteredCommissionReturnType = {
  data: CommissionFileResponse | null;
  isLoading: boolean;
  error: Error | null;
  fetchData: (
    filtersToApply: CommissionFilePaginationFilterState
  ) => Promise<void>;
};

export const useListCommissionFile = (): UseFilteredCommissionReturnType => {
  const { makeRequest } = useBaseApi();

  const [data, setData] = useState<CommissionFileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createQuery = (
    filtersToApply: CommissionFilePaginationFilterState
  ): string => {
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

  const fetchData = useCallback(
    async (
      filtersToApply: CommissionFilePaginationFilterState
    ): Promise<void> => {
      setIsLoading(true);
      try {
        const queryParams = createQuery(filtersToApply);

        const result = await makeRequest<CommissionFileResponse>(
          `/v1/paya/residual?${queryParams}`
        );

        setData(result);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [makeRequest]
  );

  return { data, isLoading, error, fetchData };
};
