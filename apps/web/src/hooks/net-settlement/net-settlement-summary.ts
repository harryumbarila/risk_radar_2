import { useAuth } from '@frontegg/nextjs';
import { useCallback, useState } from 'react';

import useBaseApi from '@/hooks/use-base-api';
import type {
  NetSettlementBaseDto,
  NetSettlementSummary,
} from '@/shared/response';

export type NetSettlementSummaryFilterState = {
  mid: string;
  label?: string;
  divertReason?: string;
};
export type NetSettlementSummaryRemoveTransaction = {
  mid: string;
  transactionId: number;
};

export type UseNetSettlementSummaryReturnType = {
  data: NetSettlementSummary | null;
  isLoading: boolean;
  error: Error | null;
  fetchData: (filtersToApply: NetSettlementSummaryFilterState) => Promise<void>;
  addNotes: (filtersToApply: NetSettlementSummaryFilterState) => Promise<void>;
  removeNotes: (
    filtersToApply: NetSettlementSummaryFilterState
  ) => Promise<void>;
  handleAction: (payload: Partial<NetSettlementBaseDto>) => Promise<void>;
  removeTransaction: (
    payload: NetSettlementSummaryRemoveTransaction
  ) => Promise<void>;
};

export const useNetSettlementSummary =
  (): UseNetSettlementSummaryReturnType => {
    const { makeRequest } = useBaseApi();
    const { user } = useAuth();

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

    const addNotes = useCallback(
      async (
        filtersToApply: NetSettlementSummaryFilterState
      ): Promise<void> => {
        try {
          const result = await makeRequest<NetSettlementSummary>(
            '/v1/net-settlement/summary/add',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                mid: filtersToApply.mid,
                note: filtersToApply.divertReason,
                user: user?.name,
              }),
            }
          );
          setData(result);
        } catch (err) {
          setError(err as Error);
        } finally {
          setIsLoading(false);
        }
      },
      [makeRequest, user?.name]
    );
    const removeNotes = useCallback(
      async (
        filtersToApply: NetSettlementSummaryFilterState
      ): Promise<void> => {
        try {
          const result = await makeRequest<NetSettlementSummary>(
            '/v1/net-settlement/summary/remove',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                mid: filtersToApply.mid,
                user: user?.name,
              }),
            }
          );

          setData(result);
        } catch (err) {
          setError(err as Error);
        }
      },
      [makeRequest, user?.name]
    );
    const handleAction = useCallback(
      async (payload: Partial<NetSettlementBaseDto>): Promise<void> => {
        try {
          const result = await makeRequest<NetSettlementSummary>(
            '/v1/net-settlement/summary/action',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ...payload,
                user: user?.name,
              }),
            }
          );

          setData(result);
        } catch (err) {
          setError(err as Error);
        }
      },
      [makeRequest, user?.name]
    );
    const removeTransaction = useCallback(
      async (payload: NetSettlementSummaryRemoveTransaction): Promise<void> => {
        try {
          setIsLoading(true);
          const result = await makeRequest<NetSettlementSummary>(
            '/v1/net-settlement/summary/transaction/remove',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ...payload,
                user: user?.name,
              }),
            }
          );

          setData(result);
        } catch (err) {
          setError(err as Error);
        } finally {
          setIsLoading(false);
        }
      },
      [makeRequest, user?.name]
    );

    return {
      data,
      isLoading,
      error,
      fetchData,
      removeNotes,
      addNotes,
      handleAction,
      removeTransaction,
    };
  };
