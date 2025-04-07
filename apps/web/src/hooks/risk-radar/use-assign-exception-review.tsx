import { useState } from 'react';

import { useApiSWR } from '@/web/src/hooks/use-base-api';

type AssignExceptionReviewRequest = {
  exceptionIds: number[];
  userToAssign: string;
};

type UseAssignExceptionReviewReturnType = {
  assignExceptionReview: (
    exceptionIds: number[],
    userToAssign: string
  ) => Promise<boolean>;
  loading: boolean;
  error: Error | null;
  data: { success: boolean } | undefined;
};

export function useAssignExceptionReview(): UseAssignExceptionReviewReturnType {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { data: baseApiData, mutate } = useApiSWR<{ success: boolean }>(null);

  const assignExceptionReview = async (
    exceptionIds: number[],
    userToAssign: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const payload: AssignExceptionReviewRequest = {
        exceptionIds,
        userToAssign,
      };

      const response = await fetch(
        '/api/v1/risk-radar/assign-exception-review',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error assigning exception review: ${response.statusText}`
        );
      }

      await mutate();
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Unknown error occurred')
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    assignExceptionReview,
    loading,
    error,
    data: baseApiData,
  };
}
