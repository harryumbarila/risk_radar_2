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
        const response = await makeRequest(
          `/v1/legacy_dashboard_proxy/review_exception`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              exceptionsId: exceptionIds,
              reviewerUsername: userName,
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

    return { reviewException, isLoading };
  };
