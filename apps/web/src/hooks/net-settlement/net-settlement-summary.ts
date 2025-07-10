import { useCallback, useState } from 'react';

import useBaseApi from '@/hooks/use-base-api';
import type { NetSettlementSummary } from '@/shared/response';

export type NetSettlementSummaryFilterState = {
  mid: string;
};

export type UseNetSettlementSummaryReturnType = {
  data: NetSettlementSummary | null;
  isLoading: boolean;
  error: Error | null;
  fetchData: (filtersToApply: NetSettlementSummaryFilterState) => Promise<void>;
};

export const useNetSettlementSummary =
  (): UseNetSettlementSummaryReturnType => {
    const { makeRequest } = useBaseApi();

    const [data, setData] = useState<NetSettlementSummary | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(
      async (
        filtersToApply: NetSettlementSummaryFilterState
      ): Promise<void> => {
        setIsLoading(true);
        try {
          const result = await makeRequest<NetSettlementSummary>(
            `/v1/net-settlement/summary/${filtersToApply.mid}`
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
