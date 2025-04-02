import type { RiskRadarUsersResponseDto } from '@/shared/response';
import { useApiSWR } from '@/web/src/hooks/use-base-api';

type UseRiskRadarUsersReturnType = {
  data: RiskRadarUsersResponseDto | undefined;
  error: unknown;
  isLoading: boolean;
};

export const useRiskRadarUsers = (): UseRiskRadarUsersReturnType => {
  const { data, error, isLoading } = useApiSWR<RiskRadarUsersResponseDto>(
    `/v1/legacy_dashboard_proxy/risk_radar_users`
  );

  return { data, error, isLoading };
};
