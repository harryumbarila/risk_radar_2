import { isValid, parse } from 'date-fns';
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

export const formatCurrency = (
  value: unknown,
  minimumFractionDigits = 2,
  returnZero = false
): string => {
  if (
    !returnZero &&
    (value === undefined || value === null || Number(value) === 0)
  ) {
    return DEFAULT_BLANK_VALUE;
  }

  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits,
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

export const parseDate = (value: unknown): Date | null => {
  let parsedDate: Date;
  try {
    parsedDate = new Date(String(value));
    if (!isValid(parsedDate)) return null;
  } catch {
    // If that fails, try the custom format
    parsedDate = parse(String(value), 'MM/dd/yyyy hh:mm:ss a', new Date());
  }
  return parsedDate;
};

export const formatDate = (value: unknown): string => {
  const parsedDate = parseDate(value);
  if (!parsedDate || !isValid(parsedDate)) return DEFAULT_BLANK_VALUE;
  return formatInTimeZone(parsedDate, 'UTC', 'MM/dd/yyyy hh:mm:ss a');
};

export const formatDateWithoutTime = (value: unknown): string => {
  const parsedDate = parseDate(value);
  if (!parsedDate || !isValid(parsedDate)) return DEFAULT_BLANK_VALUE;
  return formatInTimeZone(parsedDate, 'UTC', 'MM/dd/yyyy');
};
