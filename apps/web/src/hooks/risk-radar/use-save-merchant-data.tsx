import useBaseApi from '@/web/src/hooks/use-base-api';

export type SaveMerchantDataParams = {
  merchantId: string;
  exceptionId: number;
  isDiverted: boolean;
  preferredContact?: string;
  notes?: string;
  isPinnedNote: boolean;
  clickedStatus?: string;
  isRiskWatch: boolean;
  isAutoHoldEnabled: boolean;
  createdBy: string;
};

type UseMerchantDataReturnType = {
  saveMerchantdata: (params: SaveMerchantDataParams) => Promise<unknown>;
};

export const useSaveMerchantData = (): UseMerchantDataReturnType => {
  const { makeRequest } = useBaseApi();

  const saveMerchantdata = async (
    params: SaveMerchantDataParams
  ): Promise<unknown> => {
    const response = await makeRequest('/v1/risk-radar/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    return response;
  };

  return { saveMerchantdata };
};
