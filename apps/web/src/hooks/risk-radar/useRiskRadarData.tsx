import useSWR from "swr";
import { RiskRadarResponseDto } from "@/hooks/risk-radar/response/riskRadarResponseDto";
import { riskRadarApi } from "@/hooks/risk-radar/riskRadarApi";

export const useRiskRadarData = () => {
  const { data, error, isLoading } = useSWR<RiskRadarResponseDto[]>(
    "/v1/legacy_dashboard_proxy/risk_radar",
    (url) =>
      riskRadarApi(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Add any POST body parameters here
        }),
      }),
    {
      dedupingInterval: 100,
      revalidateOnFocus: false,
    },
  );

  return { data, error, isLoading };
};
