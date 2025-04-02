import { useApiSWR } from '@/web/src/hooks/use-base-api';

export type CardHistory = {
  mid: string;
  transmissionDate: string;
  transactionDate: string;
  amount: number;
  posEntryMode: string;
  avsResponseCode: string;
  authCode: string;
  cardNumber: string;
  debitNetworkIdentifier: string | null;
  netDepositAmount: number;
};

type UseCardHistoryReturnType = {
  data: CardHistory[] | undefined;
  error: unknown;
  isLoading: boolean;
};

export const useCardHistory = (
  cardNumber: string | undefined
): UseCardHistoryReturnType => {
  const { data, error, isLoading } = useApiSWR<CardHistory[]>(
    `/v1/risk-radar/merchant-card-num-history?cardNumber=${cardNumber}`
  );

  if (!cardNumber) {
    return {
      data: undefined,
      error: new Error('Card number is required'),
      isLoading: false,
    };
  }

  return { data, error, isLoading };
};
