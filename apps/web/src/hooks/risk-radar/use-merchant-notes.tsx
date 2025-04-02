import type { MerchantNotesResponseDto } from '@/shared/response/legacy-dashboard-proxy';
import { useApiSWR } from '@/web/src/hooks/use-base-api';

type UseMerchantNotesReturnType = {
  data: MerchantNotesResponseDto[] | undefined;
  error: unknown;
  isLoading: boolean;
  refetch: () => void;
};

export const useMerchantNotes = (mid: string): UseMerchantNotesReturnType => {
  const { data, error, isLoading, mutate } = useApiSWR<
    MerchantNotesResponseDto[],
    unknown
  >(`/v1/risk-radar/notes?mid=${mid}`);

  return { data, error, isLoading, refetch: () => mutate() };
};
