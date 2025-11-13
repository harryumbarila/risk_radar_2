'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export interface RiskThresholds {
  monthly_volume: number;
  decline_percent: number;
  high_ticket: number;
  transaction_count: number;
  keyed_percent: number;
}

export interface MIDWhitelistData {
  mid: string;
  merchant: string;
  processor: string;
  risk_level: 'Low' | 'Medium' | 'High';
  whitelist: string[]; // Array of rule IDs that are excluded
  thresholds?: RiskThresholds;
  inherit_from_mcc?: boolean;
  last_updated: string;
  last_updated_by?: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  rule: string;
  modified_by: string;
  date: string;
}

interface WhitelistContextType {
  // Current MID being managed
  currentMID: MIDWhitelistData | null;
  setCurrentMID: (mid: MIDWhitelistData | null) => void;

  // Drawer state
  isDrawerOpen: boolean;
  openDrawer: (mid: MIDWhitelistData) => void;
  closeDrawer: () => void;

  // Temporary edits (before save)
  tempExcludedRules: Set<string>;
  setTempExcludedRules: (rules: Set<string>) => void;
  toggleRuleExclusion: (ruleId: string) => void;
  resetTempExcludedRules: () => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Audit log
  auditLogs: Record<string, AuditLogEntry[]>;
  addAuditLog: (mid: string, entry: AuditLogEntry) => void;

  // Save whitelist
  saveWhitelist: (mid: string, excludedRules: string[]) => Promise<void>;

  // Thresholds state
  tempThresholds: RiskThresholds | null;
  setTempThresholds: (thresholds: RiskThresholds | null) => void;
  resetTempThresholds: () => void;
  hasThresholdChanges: boolean;
  saveThresholds: (mid: string, thresholds: RiskThresholds) => Promise<void>;
}

const WhitelistContext = createContext<WhitelistContextType | undefined>(undefined);

export function WhitelistProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [currentMID, setCurrentMID] = useState<MIDWhitelistData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [tempExcludedRules, setTempExcludedRules] = useState<Set<string>>(new Set());
  const [tempThresholds, setTempThresholds] = useState<RiskThresholds | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState<Record<string, AuditLogEntry[]>>({});

  const openDrawer = useCallback((mid: MIDWhitelistData) => {
    setCurrentMID(mid);
    setIsDrawerOpen(true);
    setTempExcludedRules(new Set(mid.whitelist));
    setTempThresholds(mid.thresholds || null);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setCurrentMID(null);
    setTempExcludedRules(new Set());
    setTempThresholds(null);
  }, []);

  const toggleRuleExclusion = useCallback((ruleId: string) => {
    setTempExcludedRules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ruleId)) {
        newSet.delete(ruleId);
      } else {
        newSet.add(ruleId);
      }
      return newSet;
    });
  }, []);

  const resetTempExcludedRules = useCallback(() => {
    if (currentMID) {
      setTempExcludedRules(new Set(currentMID.whitelist));
    } else {
      setTempExcludedRules(new Set());
    }
  }, [currentMID]);

  const resetTempThresholds = useCallback(() => {
    if (currentMID) {
      setTempThresholds(currentMID.thresholds || null);
    } else {
      setTempThresholds(null);
    }
  }, [currentMID]);

  const addAuditLog = useCallback((mid: string, entry: AuditLogEntry) => {
    setAuditLogs((prev) => {
      const logs = { ...prev };
      if (!logs[mid]) {
        logs[mid] = [];
      }
      logs[mid] = [entry, ...logs[mid]];
      return logs;
    });
  }, []);

  const hasThresholdChanges = useMemo(() => {
    if (!currentMID || !tempThresholds) return false;
    const original = currentMID.thresholds;
    if (!original) return true;
    return (
      original.monthly_volume !== tempThresholds.monthly_volume ||
      original.decline_percent !== tempThresholds.decline_percent ||
      original.high_ticket !== tempThresholds.high_ticket ||
      original.transaction_count !== tempThresholds.transaction_count ||
      original.keyed_percent !== tempThresholds.keyed_percent
    );
  }, [currentMID, tempThresholds]);

  const saveThresholds = useCallback(
    async (mid: string, thresholds: RiskThresholds) => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Update current MID
        if (currentMID && currentMID.mid === mid) {
          setCurrentMID({
            ...currentMID,
            thresholds,
            last_updated: new Date().toISOString().split('T')[0],
            last_updated_by: 'Current User',
          });
          setTempThresholds(thresholds);
        }

        // Add audit log entry
        addAuditLog(mid, {
          id: `${Date.now()}-thresholds`,
          action: 'Updated risk thresholds',
          rule: 'N/A',
          modified_by: 'Current User',
          date: new Date().toISOString(),
        });

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        throw error;
      }
    },
    [currentMID, addAuditLog]
  );

  const saveWhitelist = useCallback(
    async (mid: string, excludedRules: string[]) => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Update current MID
        if (currentMID && currentMID.mid === mid) {
          setCurrentMID({
            ...currentMID,
            whitelist: excludedRules,
            last_updated: new Date().toISOString().split('T')[0],
          });
        }

        // Add audit log entries for changes
        const previousRules = new Set(currentMID?.whitelist || []);
        const newRules = new Set(excludedRules);
        const added = excludedRules.filter((id) => !previousRules.has(id));
        const removed = Array.from(previousRules).filter((id) => !newRules.has(id));

        added.forEach((ruleId) => {
          addAuditLog(mid, {
            id: `${Date.now()}-${ruleId}`,
            action: 'Added to whitelist',
            rule: ruleId,
            modified_by: 'Current User',
            date: new Date().toISOString(),
          });
        });

        removed.forEach((ruleId) => {
          addAuditLog(mid, {
            id: `${Date.now()}-${ruleId}`,
            action: 'Removed from whitelist',
            rule: ruleId,
            modified_by: 'Current User',
            date: new Date().toISOString(),
          });
        });

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        throw error;
      }
    },
    [currentMID, addAuditLog]
  );

  const value = useMemo(
    () => ({
      currentMID,
      setCurrentMID,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      tempExcludedRules,
      setTempExcludedRules,
      toggleRuleExclusion,
      resetTempExcludedRules,
      isLoading,
      setIsLoading,
      auditLogs,
      addAuditLog,
      saveWhitelist,
      tempThresholds,
      setTempThresholds,
      resetTempThresholds,
      hasThresholdChanges,
      saveThresholds,
    }),
    [
      currentMID,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      tempExcludedRules,
      toggleRuleExclusion,
      resetTempExcludedRules,
      isLoading,
      auditLogs,
      addAuditLog,
      saveWhitelist,
      tempThresholds,
      resetTempThresholds,
      hasThresholdChanges,
      saveThresholds,
    ]
  );

  return React.createElement(WhitelistContext.Provider, { value }, children);
}

export function useWhitelistStore(): WhitelistContextType {
  const context = useContext(WhitelistContext);
  if (context === undefined) {
    throw new Error('useWhitelistStore must be used within a WhitelistProvider');
  }
  return context;
}

