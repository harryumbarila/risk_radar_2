import useBaseApi from '@/web/src/hooks/use-base-api';

type UseMerchantDataReturnType = {
  saveNetSettlement: (
    category: string,
    tranDate: string,
    tranAmt: number,
    balAmt: number,
    pendingAmt: number,
    writeOffAmt: number,
    reason: string,
    createdBy: string,
    mid: string
  ) => Promise<unknown>;
};

export const useSaveNewNetSettlement = (): UseMerchantDataReturnType => {
  const { makeRequest } = useBaseApi();

  const saveNetSettlement = async (
    category: string,
    tranDate: string,
    tranAmt: number,
    balAmt: number,
    pendingAmt: number,
    writeOffAmt: number,
    reason: string,
    createdBy: string,
    mid: string
  ): Promise<unknown> => {
    const response = await makeRequest(
      `/v1/legacy_dashboard_proxy/save_new_net_settlement`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          tranDate,
          tranAmt,
          balAmt,
          pendingAmt,
          writeOffAmt,
          reason,
          createdBy,
          mid,
        }),
      }
    );

    return response;
  };

  return { saveNetSettlement };
};
