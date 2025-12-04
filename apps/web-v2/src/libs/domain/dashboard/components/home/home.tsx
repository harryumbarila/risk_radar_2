'use client';
import React from 'react';
import { Box, VStack, SimpleGrid, HStack, Button, Skeleton, Text, Tooltip, Portal } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import {
  User,
  AlertTriangle,
  TrendingUp,
  ShoppingCart,
  Clock,
  DollarSign,
  Info,
} from 'lucide-react';
import FilterBar, { type FilterState } from '../filter-bar/filter-bar';
import KpiCard from '../kpi-card/kpi-card';
import RuleLabel from '../rule-label/rule-label';
import TSYSUnifiedChart from '../charts/tsys-unified-chart';
// Lazy load heavy chart components
const TopRulesChart = React.lazy(() => import('../charts/top-rules-chart').then(m => ({ default: m.default })));
const SourceDistributionChart = React.lazy(() => import('../charts/source-distribution-chart').then(m => ({ default: m.default })));
const MerchantRanking = React.lazy(() => import('../charts/merchant-ranking').then(m => ({ default: m.default })));
const ChargebackRateChart = React.lazy(() => import('../charts/chargeback-rate-chart').then(m => ({ default: m.default })));
const ChargebackReasonCodeChart = React.lazy(() => import('../charts/chargeback-reason-code-chart').then(m => ({ default: m.default })));
import { generateMockAlerts, calculateKpis, type MockAlert, type Source } from '../../utils/mockData';
import { RULE_DEFINITIONS } from '../../utils/ruleNames';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const [allAlerts, setAllAlerts] = React.useState<MockAlert[]>([]);
  const [error, setError] = React.useState<Error | null>(null);
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

  // Generate mock data on mount - optimized to prevent blocking
  React.useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    // Safety timeout to ensure loading state doesn't get stuck (matches other modules)
    const safetyTimeout = setTimeout(() => {
      console.warn('Dashboard loading timeout reached, forcing load completion');
      setIsLoading(false);
    }, 800); // 800ms to match other modules
    
    // Use requestIdleCallback or setTimeout to prevent blocking main thread
    const generateData = () => {
      try {
        // Reduce initial data size for faster initial load
        const alerts = generateMockAlerts(500); // Reduced from 2500 to 500
        setAllAlerts(alerts);
        clearTimeout(safetyTimeout);
        setIsLoading(false);
        
        // Load remaining data asynchronously after initial render
        setTimeout(() => {
          try {
            const remainingAlerts = generateMockAlerts(2000);
            setAllAlerts((prev) => [...prev, ...remainingAlerts]);
          } catch (error) {
            console.warn('Error loading additional mock data:', error);
          }
        }, 1000);
      } catch (error) {
        console.error('Error generating mock alerts:', error);
        setError(error instanceof Error ? error : new Error(String(error)));
        clearTimeout(safetyTimeout);
        setAllAlerts([]);
        setIsLoading(false);
      }
    };
    
    // Use setTimeout to defer data generation and prevent blocking
    const timeoutId = setTimeout(generateData, 100); // Small delay to ensure component is mounted
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(safetyTimeout);
    };
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

  // Memoize the onRuleIdsChange callback to prevent infinite loops
  const handleRuleIdsChange = React.useCallback((ruleIds: string[]) => {
    setFilters((prev) => {
      const currentRuleIds = Array.isArray(prev.ruleId) ? prev.ruleId : (prev.ruleId === 'all' ? [] : [prev.ruleId]);
      // Only update if rules actually changed
      if (
        ruleIds.length !== currentRuleIds.length ||
        !ruleIds.every(rule => currentRuleIds.includes(rule))
      ) {
        return { ...prev, ruleId: ruleIds };
      }
      return prev;
    });
  }, []);

  if (error) {
    return (
      <Box p={6}>
        <VStack gap={4} align="stretch">
          <Text fontSize="lg" fontWeight="bold" color="red.600">
            Error loading dashboard
          </Text>
          <Text fontSize="sm" color="gray.600">
            {error.message}
          </Text>
          <Button onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </VStack>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box>
        <VStack gap={6} align="stretch">
          {/* Filter Bar Skeleton */}
          <Skeleton height="60px" />
          
          {/* TSYS Chart Skeleton */}
          <Skeleton height="400px" />
          
          {/* KPI Cards Skeleton */}
          <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={6}>
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} height="150px" />
            ))}
          </SimpleGrid>
          
          {/* Chargeback Charts Skeleton */}
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            <Skeleton height="300px" />
            <Skeleton height="300px" />
          </SimpleGrid>
          
          {/* Other Charts Skeleton */}
          <Skeleton height="400px" />
          <Skeleton height="400px" />
          <Skeleton height="400px" />
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
          onRuleIdsChange={handleRuleIdsChange}
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

        {/* Chargeback Insights Section */}
        <VStack align="stretch" gap={4}>
          <HStack justify="space-between" align="center">
            <HStack gap={2} align="center">
              <Text fontSize="xl" fontWeight="bold">
                Chargeback Insights
              </Text>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Box
                    as="span"
                    color="gray.400"
                    _hover={{ color: 'gray.600' }}
                    cursor="help"
                    display="inline-flex"
                    alignItems="center"
                    aria-label="Section information"
                  >
                    <Info size={16} />
                  </Box>
                </Tooltip.Trigger>
                <Portal>
                  <Tooltip.Positioner>
                    <Tooltip.Content
                      maxW="300px"
                      zIndex={1100}
                      bg="gray.900"
                      color="white"
                      px={3}
                      py={2}
                      borderRadius="md"
                      fontSize="sm"
                      boxShadow="lg"
                    >
                      <Tooltip.Arrow />
                      Comprehensive chargeback analytics including rate trends and reason code distribution to help identify patterns and reduce risk.
                    </Tooltip.Content>
                  </Tooltip.Positioner>
                </Portal>
              </Tooltip.Root>
            </HStack>
            <Text fontSize="xs" color="gray.500">
              Last Updated: {new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </Text>
          </HStack>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            <React.Suspense fallback={<Skeleton height="300px" />}>
              <ChargebackRateChart dateRange={filters} />
            </React.Suspense>
            <React.Suspense fallback={<Skeleton height="300px" />}>
              <ChargebackReasonCodeChart dateRange={filters} />
            </React.Suspense>
          </SimpleGrid>
        </VStack>

        {/* Separator */}
        <Box borderTop="1px" borderColor="gray.200" mt={2} pt={4} />

        {/* Charts Row 1: Top Rules */}
        <SimpleGrid columns={{ base: 1, lg: 1 }} gap={6} role="region" aria-label="Risk Analysis Charts">
          <React.Suspense fallback={<Skeleton height="400px" />}>
            <TopRulesChart alerts={filteredAlerts} onRuleClick={handleRuleClick} />
          </React.Suspense>
        </SimpleGrid>

        {/* Charts Row 2: Source Distribution */}
        <SimpleGrid columns={{ base: 1, lg: 1 }} gap={6}>
          <React.Suspense fallback={<Skeleton height="400px" />}>
            <SourceDistributionChart
              alerts={filteredAlerts}
              onSourceClick={handleSourceClick}
            />
          </React.Suspense>
        </SimpleGrid>

        {/* Merchant Ranking */}
        <React.Suspense fallback={<Skeleton height="400px" />}>
          <MerchantRanking
            alerts={filteredAlerts}
            onMerchantClick={handleMerchantClick}
          />
        </React.Suspense>
      </VStack>
    </Box>
  );
}
