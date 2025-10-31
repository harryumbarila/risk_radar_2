import type { TransactionExceptionResponseDto } from '@/shared/response/legacy-dashboard-proxy';
import { useApiSWR } from '@/web/src/hooks/use-base-api';

type UseMerchantContactReturnType = {
  data: TransactionExceptionResponseDto[] | undefined;
  error: unknown;
  isLoading: boolean;
};

export const useTransactionExceptions = (
  exceptionId: string | null | undefined
): UseMerchantContactReturnType => {
  const { data, error, isLoading } = useApiSWR<
    TransactionExceptionResponseDto[]
  >(
    exceptionId
      ? `/v1/risk-radar/merchant-exception-transaction?riskRadarExceptionId=${exceptionId}`
      : null
  );

  return { data, error, isLoading };
};
