import useBaseApi from '@/web/src/hooks/use-base-api';

type UseReviewExceptionByUsernameReturnType = {
  reviewException: (
    exceptionIds: number[],
    userName: string
  ) => Promise<unknown>;
};

export const useReviewExceptionByUsername =
  (): UseReviewExceptionByUsernameReturnType => {
    const { makeRequest } = useBaseApi();

    const reviewException = async (
      exceptionIds: number[],
      userName: string
    ): Promise<unknown> => {
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

      return response;
    };

    return { reviewException };
  };
