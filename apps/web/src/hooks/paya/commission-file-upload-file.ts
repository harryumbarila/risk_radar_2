import { useCallback, useState } from 'react';

import useBaseApi from '@/hooks/use-base-api';
import type { CommissionFileResponse } from '@/shared/response';

export type UseUploadCommissionReturnType = {
  data: CommissionFileResponse | null;
  isLoading: boolean;
  error: Error | null;
  uploadFile: (body: FormData) => Promise<void>;
};

export const useUploadCommissionFile = (): UseUploadCommissionReturnType => {
  const { makeRequest } = useBaseApi();

  const [data, setData] = useState<CommissionFileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadFile = useCallback(
    async (body: FormData): Promise<void> => {
      setIsLoading(true);
      try {
        const result = await makeRequest<CommissionFileResponse>(
          '/v1/paya/residual-file',
          {
            body,
            method: 'PATCH',
          }
        );

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
