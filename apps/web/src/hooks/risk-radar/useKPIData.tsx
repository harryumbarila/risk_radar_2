import useSWR from "swr";
import { KpiStatisticsResponseDto } from "@/shared/response/legacy-dashboard-proxy";
import { riskRadarApi } from "@/hooks/risk-radar/riskRadarApi";

export const useKPIData = () => {
  const { data, error, isLoading } = useSWR<KpiStatisticsResponseDto>(
    "/v1/legacy_dashboard_proxy/kpi", // Only the relative endpoint
    riskRadarApi, // Use the fetcher with BASE_URL
    {
      dedupingInterval: 100,
      revalidateOnFocus: false,
    },
  );

  return { data, error, isLoading };
};
