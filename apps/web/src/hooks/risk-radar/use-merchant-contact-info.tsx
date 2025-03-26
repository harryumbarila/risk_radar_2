import type { MerchantContactResponseDto } from '@/shared/response/legacy-dashboard-proxy';
import { useApiSWR } from '@/web/src/hooks/use-base-api';

type UseMerchantContactReturnType = {
  data: MerchantContactResponseDto | undefined;
  error: unknown;
  isLoading: boolean;
};

export const useMerchantContactInfo = (
  mid: string
): UseMerchantContactReturnType => {
  const { data, error, isLoading } = useApiSWR<MerchantContactResponseDto>(
    `/v1/legacy_dashboard_proxy/merchant_contact_info?mid=${mid}`
  );

  return { data, error, isLoading };
};
