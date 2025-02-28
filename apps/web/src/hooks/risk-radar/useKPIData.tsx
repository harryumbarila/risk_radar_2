import useSWR from 'swr';

import type { KpiStatisticsResponseDto } from '@/shared/response/legacy-dashboard-proxy';

import { riskRadarApi } from './riskRadarApi';

type UseKPIDataReturnType = {
  data: KpiStatisticsResponseDto | undefined;
  error: unknown;
  isLoading: boolean;
};

export const useKPIData = (): UseKPIDataReturnType => {
  const { data, error, isLoading } = useSWR<KpiStatisticsResponseDto, unknown>(
    '/v1/legacy_dashboard_proxy/kpi', // Only the relative endpoint
    riskRadarApi, // Use the fetcher with BASE_URL
    {
      dedupingInterval: 100,
      revalidateOnFocus: false,
    }
  );

  return { data, error, isLoading };
};
