import { useState } from 'react';

import useBaseApi from '@/web/src/hooks/use-base-api';

type UseReviewExceptionByUsernameReturnType = {
  reviewException: (
    exceptionIds: number[],
    userName: string
  ) => Promise<unknown>;
  isLoading: boolean;
};

export const useReviewExceptionByUsername =
  (): UseReviewExceptionByUsernameReturnType => {
    const [isLoading, setIsLoading] = useState(false);

    const { makeRequest } = useBaseApi();

    const reviewException = async (
      exceptionIds: number[],
      userName: string
    ): Promise<unknown> => {
      setIsLoading(true);

      try {
        const response = await makeRequest(`/v1/risk-radar/review-exceptions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reviewList: exceptionIds.join(','),
            user: userName,
          }),
        });

        setIsLoading(false);

        return response;
      } catch (error) {
        setIsLoading(false);
      }

      return null;
    };

    return { reviewException, isLoading };
  };
