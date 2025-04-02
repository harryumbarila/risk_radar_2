import useBaseApi from '@/web/src/hooks/use-base-api';

type UseMerchantDataReturnType = {
  saveMerchantdata: (
    mid: string,
    note: string,
    isPinned: boolean,
    bbbRating: string,
    author: string,
    preferredContact: string
  ) => Promise<unknown>;
};

export const useSaveMerchantData = (): UseMerchantDataReturnType => {
  const { makeRequest } = useBaseApi();

  const saveMerchantdata = async (
    mid: string,
    note: string,
    isPinned: boolean,
    bbbRating: string,
    author: string,
    preferredContact: string
  ): Promise<unknown> => {
    const response = await makeRequest(
      `/v1/legacy_dashboard_proxy/save_merchant_data?mid=${mid}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferredContact,
          note,
          isPinned,
          bbbRating,
          author,
        }),
      }
    );

    return response;
  };

  return { saveMerchantdata };
};
