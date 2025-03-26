import useBaseApi from '@/web/src/hooks/use-base-api';

type UseAssignExceptionToUserReturnType = {
  assignException: (id: number[], riskUserId: string) => Promise<unknown>;
};

export const useAssignExceptionToUser =
  (): UseAssignExceptionToUserReturnType => {
    const { makeRequest } = useBaseApi();

    const assignException = async (
      exceptionsId: number[],
      riskUserId: string
    ): Promise<unknown> => {
      const response = await makeRequest(
        `/v1/legacy_dashboard_proxy/assign_exception_to_user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            exceptionsId,
            riskUserId,
          }),
        }
      );
      return response;
    };

    return { assignException };
  };
