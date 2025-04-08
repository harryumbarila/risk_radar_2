import { formatInTimeZone } from 'date-fns-tz';

import {
  DEFAULT_BLANK_VALUE,
  DEFAULT_NO_VALUE,
  DEFAULT_YES_VALUE,
  DEFAULT_ZERO_VALUE,
} from './default-values';

export const formatNumber = (value: unknown): string => {
  if (value === undefined || value === null || Number(value) === 0) {
    return DEFAULT_BLANK_VALUE;
  }
  return Number(value).toLocaleString();
};

export const formatCurrency = (value: unknown): string => {
  if (value === undefined || value === null || Number(value) === 0) {
    return DEFAULT_BLANK_VALUE;
  }

  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(Number(value));
};

export const formatScore = (value: unknown): string => {
  const numValue = Number(value);
  if (numValue === 0) return DEFAULT_ZERO_VALUE;
  return numValue.toFixed(0);
};

export const formatBoolean = (value: unknown): string => {
  return value === 'Yes' ? DEFAULT_YES_VALUE : DEFAULT_NO_VALUE;
};

export const formatDate = (value: unknown): string => {
  if (!value) return DEFAULT_BLANK_VALUE;
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return formatInTimeZone(value as string, 'UTC', 'MM/dd/yyyy hh:mm:ss a');
  } catch {
    return DEFAULT_BLANK_VALUE;
  }
};

export const formatDateWithoutTime = (value: unknown): string => {
  if (!value) return DEFAULT_BLANK_VALUE;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return formatInTimeZone(value as string, 'UTC', 'MM/dd/yyyy');
};
