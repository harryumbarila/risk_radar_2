import type { EmailTemplatesResponseDto } from '@/shared/response/legacy-dashboard-proxy';
import { useApiSWR } from '@/web/src/hooks/use-base-api';

type UseEmailTemplatesReturnType = {
  data: EmailTemplatesResponseDto | undefined;
  error: unknown;
  isLoading: boolean;
};

export const useEmailTemplates = (): UseEmailTemplatesReturnType => {
  const { data, error, isLoading } = useApiSWR<EmailTemplatesResponseDto>(
    `/v1/risk-radar/email-templates`
  );

  return { data, error, isLoading };
};
