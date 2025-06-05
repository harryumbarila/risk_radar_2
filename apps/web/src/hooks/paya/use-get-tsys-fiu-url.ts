import { useCallback, useState } from 'react';

import useBaseApi from '@/hooks/use-base-api';
import type { InvoiceUrlResponseDto } from '@/shared/response';

export type TsysFiuFileUrlFilterState = {
  id: string;
  userName: string;
  ip?: string;
};

export type UseTsysFiuFileUrlReturnType = {
  isLoading: boolean;
  error: Error | null;
  fetchData: (
    filtersToApply: TsysFiuFileUrlFilterState
  ) => Promise<InvoiceUrlResponseDto | undefined>;
};

export const useTsysFiuFileUrl = (): UseTsysFiuFileUrlReturnType => {
  const { makeRequest } = useBaseApi();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createQuery = (filtersToApply: TsysFiuFileUrlFilterState): string => {
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
      filtersToApply: TsysFiuFileUrlFilterState
    ): Promise<InvoiceUrlResponseDto | undefined> => {
      setIsLoading(true);
      try {
        const queryParams = createQuery(filtersToApply);

        const result = await makeRequest<InvoiceUrlResponseDto>(
          `/v1/paya/download-url?${queryParams}`
        );

        setError(null);
        return result;
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
      return undefined;
    },
    [makeRequest]
  );

  return { isLoading, error, fetchData };
};
