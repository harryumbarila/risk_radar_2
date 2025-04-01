import type { MerchantChargebacksResponseDto } from '@/shared/response/legacy-dashboard-proxy';
import { useApiSWR } from '@/web/src/hooks/use-base-api';

type UseMerchantChargebacksReturnType = {
  data: MerchantChargebacksResponseDto[] | undefined;
  error: unknown;
  isLoading: boolean;
};

export const useMerchantChargebacks = (
  mid: string
): UseMerchantChargebacksReturnType => {
  const { data, error, isLoading } = useApiSWR<
    MerchantChargebacksResponseDto[]
  >(`/v1/risk-radar/chargeback-transactions?mid=${mid}`);

  return { data, error, isLoading };
};
