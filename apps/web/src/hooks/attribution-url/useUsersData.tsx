import type { IrisFilteredUsersResponseDto } from '@/shared/response/iris-proxy';
import { useApiSWR } from '@/hooks/useBaseApi';

type UseUsersDataReturnType = {
  data: IrisFilteredUsersResponseDto | undefined;
  error: unknown;
  isLoading: boolean;
};

export const useUsersData = (): UseUsersDataReturnType => {
  const { data, error, isLoading } = useApiSWR<IrisFilteredUsersResponseDto>(
    '/v1/iris_proxy/users'
  );

  return { data, error, isLoading };
};
