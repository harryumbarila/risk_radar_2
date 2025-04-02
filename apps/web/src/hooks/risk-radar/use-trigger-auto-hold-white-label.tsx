import useBaseApi from '@/web/src/hooks/use-base-api';

type UsePushNoteToIrisReturnType = {
  triggerAsWhiteLabel: (id: number[], bool: boolean) => Promise<unknown>;
};

export const useToggleAutoHoldWhiteLabelFlag =
  (): UsePushNoteToIrisReturnType => {
    const { makeRequest } = useBaseApi();

    const triggerAsWhiteLabel = async (
      exceptionsId: number[],
      isActive: boolean
    ): Promise<unknown> => {
      const response = await makeRequest(
        `/v1/legacy_dashboard_proxy/toggle_auto_hold_white_label`,
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

    return { triggerAsWhiteLabel };
  };
