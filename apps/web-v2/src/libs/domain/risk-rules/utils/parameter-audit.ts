import type { RuleAuditLogEntry } from '../context/rules-context';

export function formatParameterLabel(key: string): string {
  if (key === '__catalog__') return 'Configuration baseline';
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export function serializeParameterValueForAudit(value: unknown): string {
  if (value === undefined || value === null || value === '') return '—';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function valuesEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/** Normalize parameters the same way as the rule detail form (e.g. default effective date). */
export function normalizeParametersForCompare(
  params: Record<string, any>,
  effectiveDateKey: string,
  defaultEffectiveDate: string
): Record<string, any> {
  return {
    ...params,
    [effectiveDateKey]: params[effectiveDateKey] ?? defaultEffectiveDate,
  };
}

/**
 * Builds audit rows for each parameter that changed between two snapshots.
 */
export function diffParametersForAudit(
  previous: Record<string, any>,
  next: Record<string, any>
): Array<
  Pick<RuleAuditLogEntry, 'parameterKey' | 'parameterLabel' | 'previousValue' | 'newValue'>
> {
  const keys = new Set([...Object.keys(previous), ...Object.keys(next)]);
  const rows: Array<
    Pick<RuleAuditLogEntry, 'parameterKey' | 'parameterLabel' | 'previousValue' | 'newValue'>
  > = [];

  for (const key of keys) {
    const oldVal = previous[key];
    const newVal = next[key];
    if (valuesEqual(oldVal, newVal)) continue;
    rows.push({
      parameterKey: key,
      parameterLabel: formatParameterLabel(key),
      previousValue: serializeParameterValueForAudit(oldVal),
      newValue: serializeParameterValueForAudit(newVal),
    });
  }

  return rows;
}
