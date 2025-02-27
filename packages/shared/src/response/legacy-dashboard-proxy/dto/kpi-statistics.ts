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

export const kpiStatisticsResponseDto: KpiStatisticsResponseDto = {
  processingMIDs: {
    count: 248,
    amount: '$707,430.90',
  },
  exceptionMIDs: {
    count: 1191,
    percentageIncrease: '480%',
    amount: '$4,178,830.84',
    amountPercentageIncrease: '591%',
  },
  ndfProcessingMIDs: {
    count: 141,
    amount: '$352,259.29',
  },
  ndfExceptionMIDs: {
    count: 563,
    percentageIncrease: '399%',
    amount: '$861,715.59',
    amountPercentageIncrease: '245%',
  },
  reviewed: {
    count: 331,
    amount: '$3,208,421.34',
  },
  queued: {
    count: 7,
    amount: '$31,462.70',
  },
  divert: {
    count: 0,
    amount: '$0.00',
  },
  divertRelease: {
    count: 9,
    amount: '$139,681.14',
  },
  autoDivert: {
    count: 0,
    amount: '$0.00',
  },
};
