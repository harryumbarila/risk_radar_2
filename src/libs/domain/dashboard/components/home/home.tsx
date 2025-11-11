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
import TrendChart from '../charts/trend-chart';
import TopRulesChart from '../charts/top-rules-chart';
import SourceDistributionChart from '../charts/source-distribution-chart';
import HeatmapChart from '../charts/heatmap-chart';
import MerchantRanking from '../charts/merchant-ranking';
import RuleLabel from '../rule-label/rule-label';
import { generateMockAlerts, calculateKpis, type MockAlert, type Source } from '../../utils/mockData';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const [allAlerts, setAllAlerts] = React.useState<MockAlert[]>([]);
  const [filters, setFilters] = React.useState<FilterState>({
    dateRange: '7',
    riskLevel: 'all',
    source: 'all',
    ruleId: 'all',
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
    let startDate: Date;
    if (filters.dateRange === 'custom') {
      if (filters.customStartDate && filters.customEndDate) {
        startDate = new Date(filters.customStartDate);
        const endDate = new Date(filters.customEndDate);
        filtered = filtered.filter(
          (a) => new Date(a.date) >= startDate && new Date(a.date) <= endDate
        );
      }
    } else {
      const days = parseInt(filters.dateRange);
      startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((a) => new Date(a.date) >= startDate);
    }

    // Risk level filter
    if (filters.riskLevel !== 'all') {
      filtered = filtered.filter((a) => a.risk === filters.riskLevel);
    }

    // Source filter
    if (filters.source !== 'all') {
      filtered = filtered.filter((a) => a.source === filters.source);
    }

    // Rule filter
    if (filters.ruleId !== 'all') {
      filtered = filtered.filter((a) => a.ruleId === filters.ruleId);
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

    // Hour range filter (from heatmap click)
    if (filters.hourRange) {
      filtered = filtered.filter(
        (a) => {
          const alertDate = new Date(a.date);
          return alertDate.getDay() === filters.hourRange!.day && a.hour === filters.hourRange!.hour;
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

  // Get available rules for filter
  const availableRules = React.useMemo(() => {
    const rules = new Set(allAlerts.map((a) => a.ruleId));
    return Array.from(rules).sort();
  }, [allAlerts]);


  const handleWeekClick = (week: number) => {
    setFilters((prev) => ({ ...prev, week }));
  };

  const handleRuleClick = (ruleId: string) => {
    setFilters((prev) => ({ ...prev, ruleId }));
  };

  const handleSourceClick = (source: Source) => {
    setFilters((prev) => ({ ...prev, source }));
  };

  const handleHeatmapClick = (day: number, hour: number) => {
    setFilters((prev) => ({ ...prev, hourRange: { day, hour } }));
  };

  const handleMerchantClick = (merchantId: string) => {
    // Navigate to auto-hold with merchant filter
    router.push(`/auto-hold?merchantId=${merchantId}`);
  };

  const handleViewAutoHold = () => {
    // Build query params from filters
    const params = new URLSearchParams();
    if (filters.riskLevel !== 'all') params.set('risk', filters.riskLevel);
    if (filters.source !== 'all') params.set('source', filters.source);
    if (filters.ruleId !== 'all') params.set('rule', filters.ruleId);
    router.push(`/auto-hold?${params.toString()}`);
  };

  const handleManageRules = () => {
    router.push('/settings/risk-rules');
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
      <VStack align="stretch" gap={8}>
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

        {/* KPI Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={6} role="region" aria-label="Key Performance Indicators">
          <KpiCard
            label="Merchants at Risk (today)"
            value={kpis.merchantsAtRiskToday}
            change={kpis.weeklyChangePct}
            color="red"
            icon={<User size={24} />}
          />
          <KpiCard
            label="Transactions in Auto Hold (today)"
            value={kpis.autoHoldToday}
            change={kpis.weeklyChangePct}
            color="orange"
            icon={<AlertTriangle size={24} />}
          />
          <KpiCard
            label="Weekly Alert Change %"
            value={`${kpis.weeklyChangePct >= 0 ? '+' : ''}${kpis.weeklyChangePct.toFixed(1)}%`}
            change={kpis.weeklyChangePct}
            color="blue"
            icon={<TrendingUp size={24} />}
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
          />
          <KpiCard
            label="Avg Resolution Time"
            value={`${kpis.avgResolutionHours.toFixed(1)}h`}
            color="teal"
            icon={<Clock size={24} />}
          />
          <KpiCard
            label="Chargebacks (last 30 days)"
            value={kpis.chargebacks30d}
            color="red"
            icon={<DollarSign size={24} />}
          />
        </SimpleGrid>

        {/* Separator */}
        <Box borderTop="1px" borderColor="gray.200" mt={8} pt={8} />

        {/* Charts Row 1: Trend and Top Rules */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6} role="region" aria-label="Risk Analysis Charts">
          <TrendChart alerts={filteredAlerts} onWeekClick={handleWeekClick} />
          <TopRulesChart alerts={filteredAlerts} onRuleClick={handleRuleClick} />
              </SimpleGrid>

        {/* Charts Row 2: Source Distribution and Heatmap */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
          <SourceDistributionChart
            alerts={filteredAlerts}
            onSourceClick={handleSourceClick}
          />
          <HeatmapChart alerts={filteredAlerts} onCellClick={handleHeatmapClick} />
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
