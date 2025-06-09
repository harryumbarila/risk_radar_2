import { useCallback, useState } from 'react';

import useBaseApi from '@/hooks/use-base-api';
import type { TsysFiuFileResponse } from '@/shared/response';

export type TsysFiuFilePaginationFilterState = {
  page?: number;
  limit?: number;
};

export type UseFilteredTsysFiuReturnType = {
  data: TsysFiuFileResponse | null;
  isLoading: boolean;
  error: Error | null;
  fetchData: (
    filtersToApply: TsysFiuFilePaginationFilterState
  ) => Promise<void>;
};

export const useListTsysFiuFile = (): UseFilteredTsysFiuReturnType => {
  const { makeRequest } = useBaseApi();

  const [data, setData] = useState<TsysFiuFileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createQuery = (
    filtersToApply: TsysFiuFilePaginationFilterState
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
    async (filtersToApply: TsysFiuFilePaginationFilterState): Promise<void> => {
      setIsLoading(true);
      try {
        const queryParams = createQuery(filtersToApply);

        const result = await makeRequest<TsysFiuFileResponse>(
          `/v1/paya/tsys-fiu?${queryParams}`
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
