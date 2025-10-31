import type { MerchantResponseDto } from '@/shared/response/legacy-dashboard-proxy';
import { useApiSWR } from '@/web/src/hooks/use-base-api';

type UseMerchantReturnType = {
  data: MerchantResponseDto | undefined;
  error: unknown;
  refetch: () => void;
  isLoading: boolean;
};

export const useMerchant = (
  mid: string,
  exceptionId: string
): UseMerchantReturnType => {
  const { data, error, isLoading, mutate } = useApiSWR<MerchantResponseDto>(
    `/v1/risk-radar/merchant-exception-detail?merchantId=${mid}&exceptionId=${exceptionId}`
  );

  return { data, error, isLoading, refetch: () => mutate() };
};
