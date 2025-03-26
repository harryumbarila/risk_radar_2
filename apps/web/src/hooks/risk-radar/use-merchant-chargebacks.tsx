import type { MerchantChargebacksResponseDto } from '@/shared/response/legacy-dashboard-proxy';
import { useApiSWR } from '@/web/src/hooks/use-base-api';

type UseMerchantChargebacksReturnType = {
  data: MerchantChargebacksResponseDto | undefined;
  error: unknown;
  isLoading: boolean;
};

export const useMerchantChargebacks = (
  mid: string
): UseMerchantChargebacksReturnType => {
  const { data, error, isLoading } = useApiSWR<MerchantChargebacksResponseDto>(
    `/v1/legacy_dashboard_proxy/merchant_chargebacks?mid=${mid}`
  );

  return { data, error, isLoading };
};
