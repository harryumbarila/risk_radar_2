'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  diffParametersForAudit,
  formatParameterLabel,
  normalizeParametersForCompare,
  serializeParameterValueForAudit,
} from '../utils/parameter-audit';

/** Stored in `parameters` for every rule; ISO date string (YYYY-MM-DD). */
export const EFFECTIVE_DATE_PARAM_KEY = 'effective_date';

export interface RuleAuditLogEntry {
  id: string;
  parameterKey: string;
  parameterLabel: string;
  previousValue: string;
  newValue: string;
  modifiedBy: string;
  /** ISO 8601 timestamp */
  date: string;
}

export interface RiskRule {
  id: string;
  name: string;
  type: 'Auto Hold' | 'Alert' | 'Monitoring';
  source: 'TSYS DFT256 Capture' | 'TSYS ADF Auth' | 'TSYS TDDF Settle' | 'ACH Returns' | 'TSYS' | 'Fluidpay' | 'Paya' | 'Internal';
  severity: 'Critical' | 'Moderate' | 'Info';
  status: boolean;
  last_updated: string;
  description: string;
  created_by: string;
  last_execution: string;
  parameters: Record<string, any>;
}

export interface RuleFilters {
  search: string;
  type: string;
  severity: string;
  source: string;
  status: string;
}

interface RulesContextType {
  rules: RiskRule[];
  filters: RuleFilters;
  selectedRule: RiskRule | null;
  isDrawerOpen: boolean;
  isLoading: boolean;
  setRules: (rules: RiskRule[]) => void;
  setFilters: (filters: Partial<RuleFilters>) => void;
  clearFilters: () => void;
  setSelectedRule: (rule: RiskRule | null) => void;
  openDrawer: (rule: RiskRule) => void;
  closeDrawer: () => void;
  toggleRuleStatus: (ruleId: string) => Promise<void>;
  updateRule: (ruleId: string, updates: Partial<RiskRule>) => Promise<void>;
  deleteRule: (ruleId: string) => Promise<void>;
  ruleAuditLogs: Record<string, RuleAuditLogEntry[]>;
  appendRuleAuditLogEntries: (ruleId: string, entries: RuleAuditLogEntry[]) => void;
  filteredRules: RiskRule[];
  activeFiltersCount: number;
}

const RulesContext = createContext<RulesContextType | undefined>(undefined);

const defaultFilters: RuleFilters = {
  search: '',
  type: 'all',
  severity: 'all',
  source: 'all',
  status: 'all',
};

export function RulesProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [rules, setRules] = useState<RiskRule[]>([]);
  const [filters, setFiltersState] = useState<RuleFilters>(defaultFilters);
  const [selectedRule, setSelectedRule] = useState<RiskRule | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ruleAuditLogs, setRuleAuditLogs] = useState<Record<string, RuleAuditLogEntry[]>>({});

  useEffect(() => {
    if (rules.length === 0) return;
    setRuleAuditLogs((prev) => {
      const next = { ...prev };
      for (const rule of rules) {
        if (next[rule.id] !== undefined) continue;
        const normalizedParams: Record<string, any> = {
          ...rule.parameters,
          [EFFECTIVE_DATE_PARAM_KEY]: rule.parameters[EFFECTIVE_DATE_PARAM_KEY] ?? rule.last_updated,
        };
        const modifiedBy = rule.created_by || 'System';
        const date = `${rule.last_updated}T12:00:00.000Z`;
        const baselineEntries: RuleAuditLogEntry[] = Object.keys(normalizedParams)
          .sort()
          .map((key) => ({
            id: `baseline-${rule.id}-${key}`,
            parameterKey: key,
            parameterLabel: formatParameterLabel(key),
            previousValue:
              key === EFFECTIVE_DATE_PARAM_KEY
                ? serializeParameterValueForAudit(normalizedParams[key])
                : '—',
            newValue: serializeParameterValueForAudit(normalizedParams[key]),
            modifiedBy,
            date,
          }));

        // Seed a few logical user changes for one concrete rule so the UI shows real history.
        // This is mock data until API-backed audit logs exist.
        const seededChanges: RuleAuditLogEntry[] = [];
        if (rule.id === 'AH001') {
          const effectiveDate0 = String(normalizedParams[EFFECTIVE_DATE_PARAM_KEY] ?? rule.last_updated);
          seededChanges.push(
            {
              id: `seed-${rule.id}-${EFFECTIVE_DATE_PARAM_KEY}-1`,
              parameterKey: EFFECTIVE_DATE_PARAM_KEY,
              parameterLabel: formatParameterLabel(EFFECTIVE_DATE_PARAM_KEY),
              previousValue: effectiveDate0,
              newValue: '2025-02-01',
              modifiedBy: 'Richard Parrot',
              date: '2025-02-01T14:12:00.000Z',
            },
            {
              id: `seed-${rule.id}-batch_amount_greater_than-1`,
              parameterKey: 'batch_amount_greater_than',
              parameterLabel: formatParameterLabel('batch_amount_greater_than'),
              previousValue: serializeParameterValueForAudit(normalizedParams.batch_amount_greater_than),
              newValue: '150',
              modifiedBy: 'Richard Parrot',
              date: '2025-02-01T14:12:00.000Z',
            },
            {
              id: `seed-${rule.id}-total_keyed_volume_amount_greater_than-1`,
              parameterKey: 'total_keyed_volume_amount_greater_than',
              parameterLabel: formatParameterLabel('total_keyed_volume_amount_greater_than'),
              previousValue: serializeParameterValueForAudit(
                normalizedParams.total_keyed_volume_amount_greater_than
              ),
              newValue: '600',
              modifiedBy: 'Richard Parrot',
              date: '2025-02-03T09:45:00.000Z',
            }
          );
        }

        next[rule.id] = [...seededChanges, ...baselineEntries];
      }
      return next;
    });
  }, [rules]);

  const setFilters = useCallback((newFilters: Partial<RuleFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState(defaultFilters);
  }, []);

  const openDrawer = useCallback((rule: RiskRule) => {
    setSelectedRule(rule);
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setSelectedRule(null);
  }, []);

  const toggleRuleStatus = useCallback(async (ruleId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setRules((prev) =>
        prev.map((rule) => (rule.id === ruleId ? { ...rule, status: !rule.status } : rule))
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const appendRuleAuditLogEntries = useCallback((ruleId: string, entries: RuleAuditLogEntry[]) => {
    if (entries.length === 0) return;
    setRuleAuditLogs((prev) => ({
      ...prev,
      [ruleId]: [...entries, ...(prev[ruleId] ?? [])],
    }));
  }, []);

  const updateRule = useCallback(async (ruleId: string, updates: Partial<RiskRule>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Audit parameter changes centrally so updates from any UI path are logged.
      if (updates.parameters) {
        const current = rules.find((r) => r.id === ruleId);
        if (current) {
          const previousParams = normalizeParametersForCompare(
            current.parameters,
            EFFECTIVE_DATE_PARAM_KEY,
            current.last_updated
          );
          const nextParams = normalizeParametersForCompare(
            updates.parameters,
            EFFECTIVE_DATE_PARAM_KEY,
            current.last_updated
          );
          const changedRows = diffParametersForAudit(previousParams, nextParams);
          if (changedRows.length > 0) {
            const nowIso = new Date().toISOString();
            const modifiedBy =
              // Mock: generate some entries as Richard Parrot
              Date.now() % 2 === 0
                ? 'Richard Parrot'
                : 'Current User'; // TODO: replace with auth user
            appendRuleAuditLogEntries(
              ruleId,
              changedRows.map((row) => ({
                id: `audit-${ruleId}-${row.parameterKey}-${Date.now()}-${Math.random()
                  .toString(36)
                  .slice(2, 8)}`,
                ...row,
                modifiedBy,
                date: nowIso,
              }))
            );
          }
        }
      }

      setRules((prev) =>
        prev.map((rule) => (rule.id === ruleId ? { ...rule, ...updates } : rule))
      );
      if (selectedRule?.id === ruleId) {
        setSelectedRule((prev) => (prev ? { ...prev, ...updates } : null));
      }
    } finally {
      setIsLoading(false);
    }
  }, [appendRuleAuditLogEntries, rules, selectedRule]);

  const deleteRule = useCallback(async (ruleId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setRules((prev) => prev.filter((rule) => rule.id !== ruleId));
      if (selectedRule?.id === ruleId) {
        closeDrawer();
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedRule, closeDrawer]);

  const filteredRules = useMemo(() => {
    return rules.filter((rule) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          !rule.name.toLowerCase().includes(searchLower) &&
          !rule.description.toLowerCase().includes(searchLower) &&
          !rule.id.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }
      if (filters.type !== 'all' && rule.type !== filters.type) {
        return false;
      }
      if (filters.severity !== 'all' && rule.severity !== filters.severity) {
        return false;
      }
      if (filters.source !== 'all' && rule.source !== filters.source) {
        return false;
      }
      if (filters.status !== 'all') {
        const isActive = filters.status === 'active';
        if (rule.status !== isActive) {
          return false;
        }
      }
      return true;
    });
  }, [rules, filters]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.type !== 'all') count++;
    if (filters.severity !== 'all') count++;
    if (filters.source !== 'all') count++;
    if (filters.status !== 'all') count++;
    return count;
  }, [filters]);

  const value: RulesContextType = {
    rules,
    filters,
    selectedRule,
    isDrawerOpen,
    isLoading,
    setRules,
    setFilters,
    clearFilters,
    setSelectedRule,
    openDrawer,
    closeDrawer,
    toggleRuleStatus,
    updateRule,
    deleteRule,
    ruleAuditLogs,
    appendRuleAuditLogEntries,
    filteredRules,
    activeFiltersCount,
  };

  return <RulesContext.Provider value={value}>{children}</RulesContext.Provider>;
}

export function useRules(): RulesContextType {
  const context = useContext(RulesContext);
  if (context === undefined) {
    throw new Error('useRules must be used within a RulesProvider');
  }
  return context;
}

