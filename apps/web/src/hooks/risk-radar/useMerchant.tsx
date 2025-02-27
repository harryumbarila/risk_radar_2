import useSWR from "swr";
import { riskRadarApi } from "@/hooks/risk-radar/riskRadarApi";
import { MerchantResponseDto } from "@/shared/response/legacy-dashboard-proxy";

export const useMerchant = (mid: string) => {
  const { data, error, isLoading } = useSWR<MerchantResponseDto>(
    `/v1/legacy_dashboard_proxy/merchant?mid=${mid}`, // Only the relative endpoint
    riskRadarApi, // Use the fetcher with BASE_URL
    {
      dedupingInterval: 100,
      revalidateOnFocus: false,
    },
  );

  return { data, error, isLoading };
};
