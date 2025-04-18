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
  issuerBank?: string;
  issuerCountry?: string;
  issuerPhone?: string;
};

type UseCardHistoryReturnType = {
  data: CardHistory[] | undefined;
  error: unknown;
  isLoading: boolean;
};

export const useCardHistory = (
  cardNumber: string | null | undefined
): UseCardHistoryReturnType => {
  const { data, error, isLoading } = useApiSWR<CardHistory[]>(
    cardNumber
      ? `/v1/risk-radar/merchant-card-num-history?cardNumber=${cardNumber}`
      : null
  );

  if (!cardNumber) {
    return {
      data: undefined,
      error: undefined,
      isLoading: false,
    };
  }

  return { data, error, isLoading };
};
