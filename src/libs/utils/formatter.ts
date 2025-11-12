import { isValid, parse } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

import {
  DEFAULT_BLANK_VALUE,
  DEFAULT_NO_VALUE,
  DEFAULT_TIME_ZONE,
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
    return Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits,
    }).format(Number(0));
  }

  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits,
  }).format(Number(value));
};

export const formatBoolean = (value: unknown): string => {
  return value === 'Yes' ? DEFAULT_YES_VALUE : DEFAULT_NO_VALUE;
};

export const parseDate = (
  value: unknown,
  format = 'MM/dd/yyyy hh:mm:ss a'
): Date | null => {
  let parsedDate: Date;
  try {
    parsedDate = new Date(String(value));
    if (!isValid(parsedDate)) return null;
  } catch {
    // If that fails, try the custom format
    parsedDate = parse(String(value), format, new Date());
  }
  return parsedDate;
};

export const formatDate = (
  value?: Date | string,
  format = 'MM/dd/yyyy hh:mm:ss a'
): string => {
  try {
    if (!value) return DEFAULT_BLANK_VALUE;

    return formatInTimeZone(value, DEFAULT_TIME_ZONE, format);
  } catch (_) {
    const parsedDate = parseDate(value);
    if (!parsedDate || !isValid(parsedDate)) return DEFAULT_BLANK_VALUE;
    return formatInTimeZone(parsedDate, DEFAULT_TIME_ZONE, format);
  }
};

export const formatDateWithoutTime = (value: unknown): string => {
  const parsedDate = parseDate(value);
  if (!parsedDate || !isValid(parsedDate)) return DEFAULT_BLANK_VALUE;
  return formatInTimeZone(parsedDate, DEFAULT_TIME_ZONE, 'MM/dd/yyyy');
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
};
