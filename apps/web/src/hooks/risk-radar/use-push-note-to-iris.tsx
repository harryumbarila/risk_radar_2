import useBaseApi from '@/web/src/hooks/use-base-api';

type UsePushNoteToIrisReturnType = {
  pushNote: (id: string) => Promise<unknown>;
};

export const usePushNoteToIris = (): UsePushNoteToIrisReturnType => {
  const { makeRequest } = useBaseApi();

  const pushNote = async (id: string): Promise<unknown> => {
    const response = await makeRequest(
      `/v1/legacy_dashboard_proxy/push_note_to_iris?noteId=${id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  };

  return { pushNote };
};
