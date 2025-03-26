import useBaseApi from '@/web/src/hooks/use-base-api';

type UseRiskWatchReturnType = {
  triggerAsRiskWatch: (id: number[], bool: boolean) => Promise<unknown>;
};

export const useTriggerExceptionAsRiskWatch = (): UseRiskWatchReturnType => {
  const { makeRequest } = useBaseApi();

  const triggerAsRiskWatch = async (
    exceptionsId: number[],
    isActive: boolean
  ): Promise<unknown> => {
    const response = await makeRequest(
      `/v1/legacy_dashboard_proxy/toggle_risk_watch_command`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exceptionsId,
          isActive,
        }),
      }
    );
    return response;
  };

  return { triggerAsRiskWatch };
};
