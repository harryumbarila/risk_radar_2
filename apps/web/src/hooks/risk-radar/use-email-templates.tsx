import type { MerchantNotesResponseDto } from '@/shared/response/legacy-dashboard-proxy';
import { useApiSWR } from '@/web/src/hooks/use-base-api';

type UseMerchantNotesReturnType = {
  data: unknown;
  error: unknown;
  isLoading: boolean;
};

export const useEmailTemplates = (): UseMerchantNotesReturnType => {
  const { data, error, isLoading } = useApiSWR<MerchantNotesResponseDto>(
    `/v1/legacy_dashboard_proxy/email_templates`
  );

  return { data, error, isLoading };
};
