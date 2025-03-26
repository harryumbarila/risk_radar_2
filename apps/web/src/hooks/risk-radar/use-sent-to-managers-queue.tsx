import useBaseApi from '@/web/src/hooks/use-base-api';

type UseSentToManagersQueueReturnType = {
  managersQueue: (exceptionIds: number[]) => Promise<unknown>;
};

export const useSentExceptionToManagersQueue =
  (): UseSentToManagersQueueReturnType => {
    const { makeRequest } = useBaseApi();

    const managersQueue = async (exceptionIds: number[]): Promise<unknown> => {
      const response = await makeRequest(
        `/v1/legacy_dashboard_proxy/managers_queue`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            exceptionsId: exceptionIds,
          }),
        }
      );

      return response;
    };

    return { managersQueue };
  };
