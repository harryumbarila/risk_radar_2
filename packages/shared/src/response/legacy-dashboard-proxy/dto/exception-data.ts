export interface SourceType {
  pk: number;
  sName: string;
  bHidden: boolean;
}

export interface ExceptionStatus {
  pkRiskRadarExceptionStatus: number;
  sExceptionStatusDesc: string;
  iSortOrder: number;
  bHidden: boolean;
  dtCreated: string;
}

export interface ExceptionType {
  pk: number;
  sDesc: string;
  bHidden: boolean;
}

export interface RiskUser {
  pkRiskRadarUser: number;
  sName: string;
  sNTUserID: string;
  bManager: boolean;
  bHidden: boolean;
  dtCreated: string;
}

export interface ExceptionDataResponseDto {
  source_type: SourceType[];
  status: ExceptionStatus[];
  exception_type: ExceptionType[];
  risk_user: RiskUser[];
}
