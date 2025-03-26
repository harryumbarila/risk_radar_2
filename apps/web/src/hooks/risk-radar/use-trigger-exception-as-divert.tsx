import useBaseApi from '@/web/src/hooks/use-base-api';

type UseDivertReturnType = {
  triggerAsDivert: (id: number[]) => Promise<unknown>;
};

export const useTriggerExceptionAsDivert = (): UseDivertReturnType => {
  const { makeRequest } = useBaseApi();

  const triggerAsDivert = async (exceptionsId: number[]): Promise<unknown> => {
    const response = await makeRequest(
      `/v1/legacy_dashboard_proxy/mark_exception_as_divert`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ exceptionsId }),
      }
    );
    return response;
  };

  return { triggerAsDivert };
};
