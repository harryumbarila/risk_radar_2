import type { TransactionExceptionResponseDto } from '@/shared/response/legacy-dashboard-proxy';
import { useApiSWR } from '@/web/src/hooks/use-base-api';

type UseMerchantContactReturnType = {
  data: TransactionExceptionResponseDto | undefined;
  error: unknown;
  isLoading: boolean;
};

export const useTransactionExceptions = (
  mid: string
): UseMerchantContactReturnType => {
  const { data, error, isLoading } = useApiSWR<TransactionExceptionResponseDto>(
    `/v1/legacy_dashboard_proxy/transaction_exceptions?mid=${mid}`
  );

  return { data, error, isLoading };
};
