import useSWR from 'swr';

import type { MerchantResponseDto } from '@/shared/response/legacy-dashboard-proxy';

import { riskRadarApi } from './riskRadarApi';

type UseMerchantReturnType = {
  data: MerchantResponseDto | undefined;
  error: unknown;
  isLoading: boolean;
};

export const useMerchant = (mid: string): UseMerchantReturnType => {
  const { data, error, isLoading } = useSWR<MerchantResponseDto, unknown>(
    `/v1/legacy_dashboard_proxy/merchant?mid=${mid}`, // Only the relative endpoint
    riskRadarApi, // Use the fetcher with BASE_URL
    {
      dedupingInterval: 100,
      revalidateOnFocus: false,
    }
  );

  return { data, error, isLoading };
};
