import useBaseApi from '@/web/src/hooks/use-base-api';

type UsePushNoteToIrisReturnType = {
  pushNote: (noteId: number, merchantId: string) => Promise<unknown>;
};

export const usePushNoteToIris = (): UsePushNoteToIrisReturnType => {
  const { makeRequest } = useBaseApi();

  const pushNote = async (
    noteId: number,
    merchantId: string
  ): Promise<unknown> => {
    const response = await makeRequest(`/v1/risk-radar/push-note-to-iris`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        noteId,
        merchantId,
      }),
    });
    return response;
  };

  return { pushNote };
};
