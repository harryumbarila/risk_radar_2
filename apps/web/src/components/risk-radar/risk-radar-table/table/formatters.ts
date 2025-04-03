import { format, isValid } from 'date-fns';

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
  const date = value instanceof Date ? value : new Date(String(value));
  if (!isValid(date)) return DEFAULT_BLANK_VALUE;
  return format(date, 'yyyy-MM-dd HH:mm:ss');
};
