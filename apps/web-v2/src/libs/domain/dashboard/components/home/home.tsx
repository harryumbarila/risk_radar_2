'use client';
import React from 'react';
import { Box, VStack, SimpleGrid, HStack, Button, Skeleton, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import {
  User,
  AlertTriangle,
  TrendingUp,
  ShoppingCart,
  Clock,
  DollarSign,
} from 'lucide-react';
import FilterBar, { type FilterState } from '../filter-bar/filter-bar';
import KpiCard from '../kpi-card/kpi-card';
import TopRulesChart from '../charts/top-rules-chart';
import SourceDistributionChart from '../charts/source-distribution-chart';
import MerchantRanking from '../charts/merchant-ranking';
import RuleLabel from '../rule-label/rule-label';
import TSYSUnifiedChart from '../charts/tsys-unified-chart';
import { generateMockAlerts, calculateKpis, type MockAlert, type Source } from '../../utils/mockData';
import { RULE_DEFINITIONS } from '../../utils/ruleNames';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const [allAlerts, setAllAlerts] = React.useState<MockAlert[]>([]);
  // Use only the 30 defined rules (AH001-AH030)
  const availableRules = React.useMemo(() => {
    return Object.keys(RULE_DEFINITIONS).sort();
  }, []);

  const [filters, setFilters] = React.useState<FilterState>(() => {
    // Initialize with all 30 defined rules selected
    const allRuleIds = Object.keys(RULE_DEFINITIONS).sort();
    return {
      dateRange: '7',
      processor: 'all',
      source: 'all',
      ruleId: allRuleIds, // All 30 rules selected by default
    };
  });

  // Generate mock data on mount
  React.useEffect(() => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      const alerts = generateMockAlerts(2500);
      setAllAlerts(alerts);
      setIsLoading(false);
    }, 500);
  }, []);

  // Filter alerts based on current filters
  const filteredAlerts = React.useMemo(() => {
    let filtered = [...allAlerts];

    // Date range filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (filters.dateRange === 'custom') {
      if (filters.customStartDate && filters.customEndDate) {
        const startDate = new Date(filters.customStartDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(filters.customEndDate);
        endDate.setHours(23, 59, 59, 999);
        filtered = filtered.filter(
          (a) => {
            const alertDate = new Date(a.date);
            return alertDate >= startDate && alertDate <= endDate;
          }
        );
      }
    } else {
      const days = parseInt(filters.dateRange);
      if (!isNaN(days) && days > 0) {
        // Calculate start date: today minus (days-1) to include today in the range
        // For "Last 7 days": today (0) + 6 previous days = 7 days total
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - (days - 1));
        startDate.setHours(0, 0, 0, 0);
        
        // End date: end of today
        const endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
        
        filtered = filtered.filter((a) => {
          const alertDate = new Date(a.date);
          return alertDate >= startDate && alertDate <= endDate;
        });
      }
    }

    // Processor filter (TSYS, FSP) - filters by the source field in mock data
    if (filters.processor !== 'all') {
      filtered = filtered.filter((a) => a.source === filters.processor);
    }

    // Source filter (Talus Pay, Global365, SIT, SC Flow)
    // Note: This filter is available in the UI but won't filter data until the source field
    // is added to the MockAlert interface. For now, it's prepared for future implementation.
    // if (filters.source !== 'all') {
    //   filtered = filtered.filter((a) => a.dataSource === filters.source);
    // }

    // Rule filter
    if (filters.ruleId !== 'all') {
      const ruleIds = Array.isArray(filters.ruleId) ? filters.ruleId : [filters.ruleId];
      filtered = filtered.filter((a) => ruleIds.includes(a.ruleId));
    }

    // Week filter (from chart click)
    if (filters.week !== undefined) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay() - filters.week * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      filtered = filtered.filter(
        (a) => {
          const alertDate = new Date(a.date);
          return alertDate >= weekStart && alertDate < weekEnd;
        }
      );
    }

    return filtered;
  }, [allAlerts, filters]);

  // Calculate KPIs
  const kpis = React.useMemo(() => {
    if (filteredAlerts.length === 0) {
      return {
        merchantsAtRiskToday: 0,
        autoHoldToday: 0,
        weeklyChangePct: 0,
        topRule: { ruleId: 'AH001', count: 0 },
        avgResolutionHours: 0,
        chargebacks30d: 0,
      };
    }
    return calculateKpis(filteredAlerts);
  }, [filteredAlerts]);

  const handleRuleClick = (ruleId: string) => {
    setFilters((prev) => ({ ...prev, ruleId: [ruleId] }));
  };

  const handleSourceClick = (source: Source) => {
    // SourceDistributionChart shows processors, so filter by processor
    // Map Source to processor filter values
    const processorMap: Record<Source, 'TSYS' | 'FSP' | 'all'> = {
      TSYS: 'TSYS',
      Fluidpay: 'FSP',
      Paya: 'FSP',
      Other: 'all',
    };
    setFilters((prev) => ({ ...prev, processor: processorMap[source] || 'all' }));
  };


  const handleMerchantClick = (merchantId: string) => {
    // Navigate to auto-hold with merchant filter
    router.push(`/auto-hold?merchantId=${merchantId}`);
  };

  const handleViewAutoHold = () => {
    // Build query params from filters
    const params = new URLSearchParams();
    if (filters.processor !== 'all') params.set('processor', filters.processor);
    if (filters.source !== 'all') params.set('source', filters.source);
    if (filters.ruleId !== 'all') {
      const ruleIds = Array.isArray(filters.ruleId) ? filters.ruleId : [filters.ruleId];
      params.set('rule', ruleIds.join(','));
    }
    router.push(`/auto-hold?${params.toString()}`);
  };

  const handleManageRules = () => {
    router.push('/risk-rules');
  };

  if (isLoading) {
    return (
      <Box>
        <VStack gap={6} align="stretch">
          <Skeleton height="200px" />
          <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={6}>
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} height="150px" />
            ))}
          </SimpleGrid>
        </VStack>
      </Box>
    );
  }

  return (
    <Box>
      <VStack align="stretch" gap={6}>
        {/* Header with CTAs */}
        <HStack justify="flex-end" align="center">
          <HStack gap={3}>
            <Button colorPalette="blue" onClick={handleViewAutoHold}>
              View Auto Hold Cases
            </Button>
            <Button variant="outline" onClick={handleManageRules}>
              Manage Rules
            </Button>
          </HStack>
        </HStack>

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          availableRules={availableRules}
        />

        {/* TSYS Performance Overview Section */}
        <TSYSUnifiedChart 
          dateRange={filters} 
          paymentStage={filters.paymentStage}
          selectedRuleIds={Array.isArray(filters.ruleId) ? filters.ruleId : (filters.ruleId === 'all' ? [] : [filters.ruleId])}
          availableRuleIds={availableRules}
          onRuleIdsChange={(ruleIds) => {
            setFilters((prev) => ({ ...prev, ruleId: ruleIds }));
          }}
        />

        {/* KPI Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={6} role="region" aria-label="Key Performance Indicators">
          <KpiCard
            label="Merchants at Risk (today)"
            value={kpis.merchantsAtRiskToday}
            change={kpis.weeklyChangePct}
            color="red"
            icon={<User size={24} />}
            tooltip="Number of unique merchants that have triggered risk alerts today. This metric helps identify merchants requiring immediate attention."
          />
          <KpiCard
            label="Transactions in Auto Hold (today)"
            value={kpis.autoHoldToday}
            change={kpis.weeklyChangePct}
            color="orange"
            icon={<AlertTriangle size={24} />}
            tooltip="Total number of transactions that have been automatically placed on hold today due to risk rules. These require manual review."
          />
          <KpiCard
            label="Weekly Alert Change %"
            value={`${kpis.weeklyChangePct >= 0 ? '+' : ''}${kpis.weeklyChangePct.toFixed(1)}%`}
            change={kpis.weeklyChangePct}
            color="blue"
            icon={<TrendingUp size={24} />}
            tooltip="Percentage change in total alerts compared to the previous week. Positive values indicate an increase, negative values indicate a decrease."
          />
          <KpiCard
            label="Top Triggered Rule"
            value={
              <HStack gap={2} align="center">
                <RuleLabel ruleId={kpis.topRule.ruleId} fontSize="2xl" fontWeight="bold" />
                <Text fontSize="2xl" fontWeight="bold" color="gray.900">
                  ({kpis.topRule.count})
                </Text>
              </HStack>
            }
            color="purple"
            icon={<ShoppingCart size={24} />}
            tooltip="The risk rule that has been triggered most frequently. Hover over the rule code to see its full name."
          />
          <KpiCard
            label="Avg Resolution Time"
            value={`${kpis.avgResolutionHours.toFixed(1)}h`}
            color="teal"
            icon={<Clock size={24} />}
            tooltip="Average time taken to review and resolve alerts, measured in hours. Lower values indicate faster response times."
          />
          <KpiCard
            label="Chargebacks (last 30 days)"
            value={kpis.chargebacks30d}
            color="red"
            icon={<DollarSign size={24} />}
            tooltip="Total number of chargebacks received in the last 30 days. Chargebacks represent disputed transactions that require investigation."
          />
        </SimpleGrid>

        {/* Separator */}
        <Box borderTop="1px" borderColor="gray.200" mt={2} pt={4} />

        {/* Charts Row 1: Top Rules */}
        <SimpleGrid columns={{ base: 1, lg: 1 }} gap={6} role="region" aria-label="Risk Analysis Charts">
          <TopRulesChart alerts={filteredAlerts} onRuleClick={handleRuleClick} />
        </SimpleGrid>

        {/* Charts Row 2: Source Distribution */}
        <SimpleGrid columns={{ base: 1, lg: 1 }} gap={6}>
          <SourceDistributionChart
            alerts={filteredAlerts}
            onSourceClick={handleSourceClick}
          />
        </SimpleGrid>

        {/* Merchant Ranking */}
        <MerchantRanking
          alerts={filteredAlerts}
          onMerchantClick={handleMerchantClick}
        />
      </VStack>
    </Box>
  );
}
