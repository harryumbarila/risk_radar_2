import useSWR from 'swr';

import type { ExceptionDataResponseDto } from '@/shared/response/legacy-dashboard-proxy';

import { riskRadarApi } from './riskRadarApi';

type UseExceptionDataReturnType = {
  data: ExceptionDataResponseDto | undefined;
  error: unknown;
  isLoading: boolean;
};

export const useExceptionData = (): UseExceptionDataReturnType => {
  const { data, error, isLoading } = useSWR<ExceptionDataResponseDto, unknown>(
    '/v1/legacy_dashboard_proxy/exception_data', // Only the relative endpoint
    riskRadarApi, // Use the fetcher with BASE_URL
    {
      dedupingInterval: 100,
      revalidateOnFocus: false,
    }
  );

  return { data, error, isLoading };
};
