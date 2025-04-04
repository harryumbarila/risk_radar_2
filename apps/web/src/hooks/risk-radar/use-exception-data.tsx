import { useApiSWR } from '@/web/src/hooks/use-base-api';

type RiskUser = {
  pkRiskRadarUser: number;
  sName: string;
  sNTUserID: string;
  bManager: boolean;
  bHidden: boolean;
  dtCreated: string;
};

type ExceptionDataResponse = {
  source_type: Array<{
    pk: number;
    sName: string;
    bHidden: boolean;
  }>;
  status: Array<{
    pkRiskRadarExceptionStatus: number;
    sExceptionStatusDesc: string;
    iSortOrder: number;
    bHidden: boolean;
    dtCreated: string;
  }>;
  exception_type: Array<{
    pk: number;
    sDesc: string;
    bHidden: boolean;
  }>;
  risk_user: RiskUser[];
};

export function useExceptionData(): {
  data: ExceptionDataResponse | undefined;
  error: Error | undefined;
  isLoading: boolean;
} {
  const { data, error, isLoading } = useApiSWR<ExceptionDataResponse>(
    '/v1/risk-radar/exception_data'
  );

  return {
    data,
    error,
    isLoading,
  };
}
