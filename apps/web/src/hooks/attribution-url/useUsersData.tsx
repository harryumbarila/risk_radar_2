import useSWR from 'swr';

import { baseApi } from '@/hooks/baseApi';
import type { IrisFilteredUsersResponseDto } from '@/shared/response/iris-proxy';

type UseUsersDataReturnType = {
  data: IrisFilteredUsersResponseDto | undefined;
  error: unknown;
  isLoading: boolean;
};

export const useUsersData = (): UseUsersDataReturnType => {
  const { data, error, isLoading } = useSWR<
    IrisFilteredUsersResponseDto,
    unknown
  >(
    '/v1/iris_proxy/users', // Only the relative endpoint
    baseApi, // Use the fetcher with BASE_URL
    {
      dedupingInterval: 100,
      revalidateOnFocus: false,
    }
  );

  return { data, error, isLoading };
};
