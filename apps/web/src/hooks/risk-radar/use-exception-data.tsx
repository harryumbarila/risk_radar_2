import type { ExceptionDataResponseDto } from '@/shared/response/legacy-dashboard-proxy';
import { useApiSWR } from '@/web/src/hooks/use-base-api';

type UseExceptionDataReturnType = {
  data: ExceptionDataResponseDto | undefined;
  error: unknown;
  isLoading: boolean;
};

export const useExceptionData = (): UseExceptionDataReturnType => {
  const { data, error, isLoading } = useApiSWR<ExceptionDataResponseDto>(
    '/v1/legacy_dashboard_proxy/exception_data'
  );

  return { data, error, isLoading };
};
