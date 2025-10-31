import { useApiSWR } from '@/web/src/hooks/use-base-api';

type MerchantsWithSameTaxIdResponse = {
  merchantIds: string[];
};

type UseMerchantsWithSameTaxIdReturnType = {
  data: MerchantsWithSameTaxIdResponse | undefined;
  error: unknown;
  isLoading: boolean;
  refetch: () => void;
};

export function useMerchantsWithSameTaxId(
  merchantId: string | null | undefined
): UseMerchantsWithSameTaxIdReturnType {
  const { data, error, isLoading, mutate } =
    useApiSWR<MerchantsWithSameTaxIdResponse>(
      merchantId
        ? `/v1/risk-radar/merchants-with-same-tax-id?merchantId=${merchantId}`
        : null
    );

  return {
    data,
    error,
    isLoading,
    refetch: () => mutate(),
  };
}
