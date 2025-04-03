import { useState } from 'react';

import useBaseApi from '@/web/src/hooks/use-base-api';

type UseAssignExceptionToUserReturnType = {
  assignException: (id: number[], riskUserId: string) => Promise<unknown>;
  isLoading: boolean;
};

export const useAssignExceptionToUser =
  (): UseAssignExceptionToUserReturnType => {
    const { makeRequest } = useBaseApi();
    const [isLoading, setIsLoading] = useState(false);
    const assignException = async (
      exceptionsId: number[],
      riskUserId: string
    ): Promise<unknown> => {
      setIsLoading(true);

      try {
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

        setIsLoading(false);

        return response;
      } catch (error) {
        setIsLoading(false);
      }

      return null;
    };

    return { assignException, isLoading };
  };
