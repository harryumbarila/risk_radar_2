import type { MerchantResponseDto } from '@/shared/response/legacy-dashboard-proxy';
import { useApiSWR } from '@/hooks/useBaseApi';

type UseMerchantReturnType = {
  data: MerchantResponseDto | undefined;
  error: unknown;
  isLoading: boolean;
};

export const useMerchant = (mid: string): UseMerchantReturnType => {
  const { data, error, isLoading } = useApiSWR<MerchantResponseDto>(
    `/v1/legacy_dashboard_proxy/merchant?mid=${mid}`
  );

  return { data, error, isLoading };
};
