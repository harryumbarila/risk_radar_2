import type { ExceptionDataResponseDto } from '@/shared/response/legacy-dashboard-proxy';
import { useApiSWR } from '../use-base-api';

type UseExceptionDataReturnType = {
  data: ExceptionDataResponseDto | undefined;
  error: unknown;
  isLoading: boolean;
};

export const useExceptionData = (): UseExceptionDataReturnType => {
  const { data, error, isLoading } = useApiSWR<ExceptionDataResponseDto>(
    '/v1/risk-radar/exception_data'
  );

  return { data, error, isLoading };
};
