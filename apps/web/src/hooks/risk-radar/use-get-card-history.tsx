import { useApiSWR } from '@/web/src/hooks/use-base-api';

type UseRiskRadarUsersReturnType = {
  data: unknown;
  error: unknown;
  isLoading: boolean;
};

export const useCardHistory = (
  cardNumber: string | undefined
): UseRiskRadarUsersReturnType => {
  const { data, error, isLoading } = useApiSWR<unknown>(
    `/v1/legacy_dashboard_proxy/card_history?cardNumber=${cardNumber}`
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
