import useSWR from "swr";
import { riskRadarApi } from "@/hooks/risk-radar/riskRadarApi";
import { ExceptionDataResponseDto } from "@/hooks/risk-radar/response/exceptionDataResponseDto";

export const useExceptionData = () => {
  const { data, error, isLoading } = useSWR<ExceptionDataResponseDto>(
    "/v1/legacy_dashboard_proxy/exception_data", // Only the relative endpoint
    riskRadarApi, // Use the fetcher with BASE_URL
    {
      dedupingInterval: 100,
      revalidateOnFocus: false,
    },
  );

  return { data, error, isLoading };
};
