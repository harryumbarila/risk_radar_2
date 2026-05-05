'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';

/** Stored in `parameters` for every rule; ISO date string (YYYY-MM-DD). */
export const EFFECTIVE_DATE_PARAM_KEY = 'effective_date';

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

  const updateRule = useCallback(async (ruleId: string, updates: Partial<RiskRule>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setRules((prev) =>
        prev.map((rule) => (rule.id === ruleId ? { ...rule, ...updates } : rule))
      );
      if (selectedRule?.id === ruleId) {
        setSelectedRule((prev) => (prev ? { ...prev, ...updates } : null));
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedRule]);

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

