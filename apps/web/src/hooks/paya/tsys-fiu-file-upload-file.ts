import { useCallback, useState } from 'react';

import useBaseApi from '@/hooks/use-base-api';
import type { TsysFiuFileResponse } from '@/shared/response';

export type UseUploadTsysFiuReturnType = {
  data: TsysFiuFileResponse | null;
  isLoading: boolean;
  error: Error | null;
  uploadFile: (body: FormData) => Promise<void>;
};

export const useUploadTsysFiuFile = (): UseUploadTsysFiuReturnType => {
  const { makeRequest } = useBaseApi();

  const [data, setData] = useState<TsysFiuFileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadFile = useCallback(
    async (body: FormData): Promise<void> => {
      setIsLoading(true);
      try {
        const result = await makeRequest<TsysFiuFileResponse>('/v1/paya/file', {
          body,
          method: 'PATCH',
        });

        setData(result);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [makeRequest]
  );

  return { data, isLoading, error, uploadFile };
};
