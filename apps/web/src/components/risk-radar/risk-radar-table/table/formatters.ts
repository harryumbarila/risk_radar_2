export const formatNumber = (value: unknown): string => {
  if (value === undefined || value === null || Number(value) === 0) {
    return 'N/A';
  }
  return Number(value).toLocaleString();
};

export const formatScore = (value: unknown): string => {
  const numValue = Number(value);
  if (numValue === 0) return '';
  return numValue.toFixed(0);
};

export const formatBoolean = (value: unknown): string => {
  return value === 'Yes' ? 'Yes' : 'No';
};

export const formatDate = (value: unknown): string => {
  if (!value) return 'N/A';
  try {
    return new Date(String(value)).toLocaleDateString();
  } catch {
    return 'N/A';
  }
};
