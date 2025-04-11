import type { MerchantChargebacksResponseDto } from '@/shared/response/legacy-dashboard-proxy';
import { useApiSWR } from '@/web/src/hooks/use-base-api';

type UseMerchantChargebacksReturnType = {
  data: MerchantChargebacksResponseDto[] | undefined;
  error: unknown;
  isLoading: boolean;
};

export const useMerchantChargebacks = (
  mid: string | null | undefined
): UseMerchantChargebacksReturnType => {
  const { data, error, isLoading } = useApiSWR<
    MerchantChargebacksResponseDto[]
  >(mid ? `/v1/risk-radar/chargeback-transactions?mid=${mid}` : null);

  return { data, error, isLoading };
};
