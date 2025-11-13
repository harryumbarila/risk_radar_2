'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export interface MCCWhitelistData {
  mcc: string;
  description: string;
  processor: string;
  risk_level: 'Low' | 'Medium' | 'High';
  whitelist: string[]; // Array of rule IDs that are excluded
  last_updated: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  rule: string;
  modified_by: string;
  date: string;
}

interface WhitelistContextType {
  // Current MCC being managed
  currentMCC: MCCWhitelistData | null;
  setCurrentMCC: (mcc: MCCWhitelistData | null) => void;

  // Drawer state
  isDrawerOpen: boolean;
  openDrawer: (mcc: MCCWhitelistData) => void;
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
  addAuditLog: (mcc: string, entry: AuditLogEntry) => void;

  // Save whitelist
  saveWhitelist: (mcc: string, excludedRules: string[]) => Promise<void>;
}

const WhitelistContext = createContext<WhitelistContextType | undefined>(undefined);

export function WhitelistProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [currentMCC, setCurrentMCC] = useState<MCCWhitelistData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [tempExcludedRules, setTempExcludedRules] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState<Record<string, AuditLogEntry[]>>({});

  const openDrawer = useCallback((mcc: MCCWhitelistData) => {
    setCurrentMCC(mcc);
    setIsDrawerOpen(true);
    setTempExcludedRules(new Set(mcc.whitelist));
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setCurrentMCC(null);
    setTempExcludedRules(new Set());
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
    if (currentMCC) {
      setTempExcludedRules(new Set(currentMCC.whitelist));
    } else {
      setTempExcludedRules(new Set());
    }
  }, [currentMCC]);

  const addAuditLog = useCallback((mcc: string, entry: AuditLogEntry) => {
    setAuditLogs((prev) => {
      const logs = { ...prev };
      if (!logs[mcc]) {
        logs[mcc] = [];
      }
      logs[mcc] = [entry, ...logs[mcc]];
      return logs;
    });
  }, []);

  const saveWhitelist = useCallback(
    async (mcc: string, excludedRules: string[]) => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Update current MCC
        if (currentMCC && currentMCC.mcc === mcc) {
          setCurrentMCC({
            ...currentMCC,
            whitelist: excludedRules,
            last_updated: new Date().toISOString().split('T')[0],
          });
        }

        // Add audit log entries for changes
        const previousRules = new Set(currentMCC?.whitelist || []);
        const newRules = new Set(excludedRules);
        const added = excludedRules.filter((id) => !previousRules.has(id));
        const removed = Array.from(previousRules).filter((id) => !newRules.has(id));

        added.forEach((ruleId) => {
          addAuditLog(mcc, {
            id: `${Date.now()}-${ruleId}`,
            action: 'Added to whitelist',
            rule: ruleId,
            modified_by: 'Current User',
            date: new Date().toISOString(),
          });
        });

        removed.forEach((ruleId) => {
          addAuditLog(mcc, {
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
    [currentMCC, addAuditLog]
  );

  const value = useMemo(
    () => ({
      currentMCC,
      setCurrentMCC,
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
    }),
    [
      currentMCC,
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

