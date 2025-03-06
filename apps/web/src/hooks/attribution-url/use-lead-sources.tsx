import { useApiSWR } from '@/hooks/use-base-api';
import type { IrisLeadSourcesResponseDto } from '@/shared/response/iris-proxy';

type UseLeadSourcesReturnType = {
  data: IrisLeadSourcesResponseDto | undefined;
  error: unknown;
  isLoading: boolean;
};

export const useLeadSources = (): UseLeadSourcesReturnType => {
  const { data, error, isLoading } = useApiSWR<IrisLeadSourcesResponseDto>(
    '/v1/iris_proxy/lead-sources'
  );

  return { data, error, isLoading };
};
