export interface KpiStatisticsResponseDto {
  processingMIDs: {
    count: number;
    amount: string;
  };
  exceptionMIDs: {
    count: number;
    percentageIncrease: string;
    amount: string;
    amountPercentageIncrease: string;
  };
  ndfProcessingMIDs: {
    count: number;
    amount: string;
  };
  ndfExceptionMIDs: {
    count: number;
    percentageIncrease: string;
    amount: string;
    amountPercentageIncrease: string;
  };
  reviewed: {
    count: number;
    amount: string;
  };
  queued: {
    count: number;
    amount: string;
  };
  divert: {
    count: number;
    amount: string;
  };
  divertRelease: {
    count: number;
    amount: string;
  };
  autoDivert: {
    count: number;
    amount: string;
  };
}
