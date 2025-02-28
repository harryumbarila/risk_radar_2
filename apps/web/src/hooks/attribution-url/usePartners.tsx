import useSWR from 'swr';

import { baseApi } from '@/hooks/baseApi';
import type { IrisPartnersResponseDto } from '@/shared/response/iris-proxy';

type UsePartnersReturnType = {
  data: IrisPartnersResponseDto | undefined;
  error: unknown;
  isLoading: boolean;
};

export const usePartners = (): UsePartnersReturnType => {
  const { data, error, isLoading } = useSWR<IrisPartnersResponseDto, unknown>(
    '/v1/iris_proxy/partners', // Only the relative endpoint
    baseApi, // Use the fetcher with BASE_URL
    {
      dedupingInterval: 100,
      revalidateOnFocus: false,
    }
  );

  return { data, error, isLoading };
};
