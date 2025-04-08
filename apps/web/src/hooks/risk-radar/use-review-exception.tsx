import { useState } from 'react';

import useBaseApi from '@/web/src/hooks/use-base-api';

type ReviewExceptionResponse = {
  success: boolean;
  message: string;
};

type UseReviewExceptionReturnType = {
  reviewException: (exceptionIds: number[], user: string) => Promise<boolean>;
  isLoading: boolean;
  error: Error | null;
};

export const useReviewException = (): UseReviewExceptionReturnType => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { makeRequest } = useBaseApi();

  const reviewException = async (
    exceptionIds: number[],
    user: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await makeRequest<ReviewExceptionResponse>(
        '/v1/risk-radar/review-exceptions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reviewList: exceptionIds.join(','),
            user,
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
    reviewException,
    isLoading,
    error,
  };
};
