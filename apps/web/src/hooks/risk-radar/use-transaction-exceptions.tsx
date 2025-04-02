import type { TransactionExceptionResponseDto } from '@/shared/response/legacy-dashboard-proxy';
import { useApiSWR } from '@/web/src/hooks/use-base-api';

type UseMerchantContactReturnType = {
  data: TransactionExceptionResponseDto[] | undefined;
  error: unknown;
  isLoading: boolean;
};

export const useTransactionExceptions = (
  exceptionId: string
): UseMerchantContactReturnType => {
  const { data, error, isLoading } = useApiSWR<
    TransactionExceptionResponseDto[]
  >(
    `/v1/risk-radar/merchant-exception-transaction?riskRadarExceptionId=${exceptionId}`
  );

  return { data, error, isLoading };
};
