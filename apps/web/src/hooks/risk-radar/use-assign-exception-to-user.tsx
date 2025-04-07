import { useState } from 'react';

import useBaseApi from '@/web/src/hooks/use-base-api';

type AssignExceptionsResponse = {
  success: boolean;
};

type UseAssignExceptionToUserReturnType = {
  assignException: (
    exceptionIds: number[],
    assignToUserId: number,
    username: string
  ) => Promise<boolean>;
  isLoading: boolean;
  error: Error | null;
};

export const useAssignExceptionToUser =
  (): UseAssignExceptionToUserReturnType => {
    const { makeRequest } = useBaseApi();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const assignException = async (
      exceptionIds: number[],
      assignToUserId: number,
      createdBy: string
    ): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        // Call our new API endpoint to assign exceptions
        const response = await makeRequest<AssignExceptionsResponse>(
          `/v1/risk-radar/assign-exceptions`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              exceptionIds: exceptionIds.join(','),
              assignToUserId,
              createdBy,
            }),
          }
        );

        setIsLoading(false);
        return response?.success || false;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(err instanceof Error ? err : new Error(errorMessage));
        setIsLoading(false);
        return false;
      }
    };

    return {
      assignException,
      isLoading,
      error,
    };
  };
