import { useApiSWR } from '@/hooks/use-base-api';
import type { IrisBasicInfoResponseDto } from '@/shared/response/iris-proxy';

type UseLeadBasicInfoReturnType = {
  data: IrisBasicInfoResponseDto | undefined;
  error: unknown;
  isLoading: boolean;
};

export const useLeadBasicInfo = (
  leadId?: string
): UseLeadBasicInfoReturnType => {
  const { data, error, isLoading } = useApiSWR<IrisBasicInfoResponseDto>(
    leadId ? `/v1/iris_proxy/lead-basic-info/${leadId}` : null
  );

  return { data, error, isLoading };
};
