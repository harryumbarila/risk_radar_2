import { useState } from 'react';

import useBaseApi from '@/web/src/hooks/use-base-api';

type UseAssignExceptionToUserReturnType = {
  assignException: (ids: number[], user: string) => Promise<unknown>;
  isLoading: boolean;
};

export const useAssignExceptionToUser =
  (): UseAssignExceptionToUserReturnType => {
    const { makeRequest } = useBaseApi();
    const [isLoading, setIsLoading] = useState(false);
    const assignException = async (
      ids: number[],
      user: string
    ): Promise<unknown> => {
      setIsLoading(true);

      try {
        const response = await makeRequest(
          `/v1/risk-radar/assign-exception-review`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              reviewList: ids.join(','),
              user,
            }),
          }
        );

        setIsLoading(false);

        return response;
      } catch (error) {
        setIsLoading(false);
      }

      return null;
    };

    return { assignException, isLoading };
  };
