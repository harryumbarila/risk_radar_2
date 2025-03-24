import useBaseApi from '@/web/src/hooks/use-base-api';

type UseAutoHoldReturnType = {
  triggerAsAutoHold: (id: number[], bool: boolean) => Promise<unknown>;
};

export const useTriggerExceptionAsAutoHold = (): UseAutoHoldReturnType => {
  const { makeRequest } = useBaseApi();

  const triggerAsAutoHold = async (
    exceptionsId: number[],
    bool: boolean
  ): Promise<unknown> => {
    const response = await makeRequest(
      `/v1/legacy_dashboard_proxy/toggle_auto_hold_white_label`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ exceptionsId, isActive: bool }),
      }
    );
    return response;
  };

  return { triggerAsAutoHold };
};
