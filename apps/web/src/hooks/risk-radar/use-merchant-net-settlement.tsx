import type { MerchantNetSettlementResponseDto } from '@/shared/response/legacy-dashboard-proxy';
import { useApiSWR } from '@/web/src/hooks/use-base-api';

type UseMerchantNetSettlementReturnType = {
  data: MerchantNetSettlementResponseDto | undefined;
  error: unknown;
  isLoading: boolean;
  refetch: () => void;
};

export const useMerchantNetSettlement = (
  mid: string
): UseMerchantNetSettlementReturnType => {
  const { data, error, isLoading, mutate } =
    useApiSWR<MerchantNetSettlementResponseDto>(
      `/v1/legacy_dashboard_proxy/merchant_net_settlement?mid=${mid}`
    );

  return { data, error, isLoading, refetch: () => mutate() };
};
