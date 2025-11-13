'use client';

import React from 'react';
import {
  Box,
  HStack,
  VStack,
  Badge,
} from '@chakra-ui/react';
import { useRules } from './context/rules-context';
import RuleFilterBar from './components/rule-filter-bar/rule-filter-bar';
import RuleTable from './components/rule-table/rule-table';
import RuleDetailDrawer from './components/rule-detail-drawer/rule-detail-drawer';
import riskRulesData from '@/data/risk-rules.json';

export default function RiskRulesPage(): React.JSX.Element {
  const { rules, setRules, filteredRules, activeFiltersCount } = useRules();

  // Calculate rule counts
  const totalRules = rules.length;
  const activeRules = rules.filter((r) => r.status).length;
  const inactiveRules = rules.filter((r) => !r.status).length;

  // Load mock data on mount
  React.useEffect(() => {
    if (rules.length === 0) {
      setRules(riskRulesData as any);
    }
  }, [rules.length, setRules]);

  return (
    <Box>
      <VStack align="stretch" gap={6}>
        {/* Summary Badges */}
        <HStack justify="flex-end" align="center" flexWrap="wrap" gap={3}>
          {activeFiltersCount > 0 && (
            <Badge colorPalette="blue" variant="solid" px={3} py={1} borderRadius="full">
              Filters: {activeFiltersCount} active
            </Badge>
          )}
          <HStack gap={2}>
            <Badge colorPalette="gray" variant="subtle" px={3} py={1} borderRadius="full">
              Total: {totalRules}
            </Badge>
            <Badge colorPalette="green" variant="subtle" px={3} py={1} borderRadius="full">
              Active: {activeRules}
            </Badge>
            <Badge colorPalette="gray" variant="subtle" px={3} py={1} borderRadius="full">
              Inactive: {inactiveRules}
            </Badge>
          </HStack>
          <Badge colorPalette="blue" variant="subtle" px={3} py={1} borderRadius="full">
            Showing: {filteredRules.length}
          </Badge>
        </HStack>

        {/* Filter Bar */}
        <RuleFilterBar />

        {/* Rules Table */}
        <RuleTable />

        {/* Detail Drawer */}
        <RuleDetailDrawer />
      </VStack>
    </Box>
  );
}

