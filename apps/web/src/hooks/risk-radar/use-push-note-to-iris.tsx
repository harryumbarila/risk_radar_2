import useBaseApi from '@/web/src/hooks/use-base-api';

type UsePushNoteToIrisReturnType = {
  pushNote: (note: string, merchantId: string) => Promise<unknown>;
};

export const usePushNoteToIris = (): UsePushNoteToIrisReturnType => {
  const { makeRequest } = useBaseApi();

  const pushNote = async (
    note: string,
    merchantId: string
  ): Promise<unknown> => {
    const response = await makeRequest(`/v1/risk-radar/push-note-to-iris`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        merchantId,
        note,
      }),
    });
    return response;
  };

  return { pushNote };
};
