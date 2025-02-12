export interface KpiData {
  id: string;
  metric: string;
  value: number;
  trend: "up" | "down" | "neutral";
  changePercentage: number;
}

export interface RadarData {
  id: string;
  merchantId: string;
  exceptionType: string;
  status: string;
  dba: string;
  sic: string;
  date: string;
}

export interface RiskRadarResponse {
  kpiData: KpiData[];
  radarData: RadarData[];
}
