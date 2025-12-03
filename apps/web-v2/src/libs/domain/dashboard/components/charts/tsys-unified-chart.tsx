'use client';
import React from 'react';
import { Box, VStack, Text, HStack, Tooltip, Portal, Select, createListCollection, Button } from '@chakra-ui/react';
import { Info, X } from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import type { FilterState } from '../filter-bar/filter-bar';
import {
  generateRuleParticipationData,
  generateTrendingData,
  RULE_IDS,
  RULE_COLORS,
  RULE_DESCRIPTIONS,
  calculatePercentage,
  getDaysFromDateRange,
  getDateGrouping,
  getXAxisConfig,
  getSmoothingWindow,
  applySmoothing,
  formatWeeklyDate,
  getTopRules,
} from './chart-utils';
import { RULE_DEFINITIONS } from '../../utils/ruleNames';

export type PaymentStage = 'Authorization' | 'Capture' | 'Settlement' | 'ACH Returns';
export type RuleStageParticipation = 'all' | 'auth-only' | 'multi-stage' | 'settlement-only' | 'ach-only';
export type TopContributorsFilter = 'all' | 'top5' | 'top10';

interface TSYSUnifiedChartProps {
  dateRange?: FilterState;
  paymentStage?: PaymentStage;
  ruleStageParticipation?: RuleStageParticipation;
  selectedRuleIds?: string[]; // Rules selected from FilterBar
  availableRuleIds?: string[]; // All available rule IDs
  onRuleIdsChange?: (ruleIds: string[]) => void; // Callback to update main filter
}

// Define which rules apply to which stages based on source
// Source mapping: TSYS DFT256 Capture -> Capture, TSYS ADF Auth -> Authorization, 
// TSYS TDDF Settle -> Settlement, ACH Returns -> ACH Returns
const getStagesFromSource = (source: string): PaymentStage[] => {
  if (source.includes('Capture')) return ['Capture'];
  if (source.includes('Auth')) return ['Authorization'];
  if (source.includes('Settle')) return ['Settlement'];
  if (source === 'ACH Returns') return ['ACH Returns'];
  return ['Authorization']; // Default
};

const RULE_STAGE_MAP: Record<string, PaymentStage[]> = Object.fromEntries(
  Object.entries(RULE_DEFINITIONS).map(([code, def]) => [
    code,
    getStagesFromSource(def.source)
  ])
);

// Only 30 rules are defined (AH001-AH030), no additional mappings needed

const PAYMENT_STAGE_BASE_COUNTS: Record<PaymentStage, number> = {
  'Authorization': 1200,
  'Capture': 1000,
  'Settlement': 1500,
  'ACH Returns': 800,
};

// Color scale for heatmap (6-7 intensity levels)
const HEATMAP_COLORS = [
  '#e0f2fe', // Very light blue
  '#bae6fd', // Light blue
  '#7dd3fc', // Medium light blue
  '#38bdf8', // Medium blue
  '#0ea5e9', // Medium dark blue
  '#0284c7', // Dark blue
  '#0369a1', // Very dark blue
];

export default function TSYSUnifiedChart({ 
  dateRange, 
  paymentStage = 'Authorization',
  ruleStageParticipation = 'all',
  selectedRuleIds = [],
  availableRuleIds = [],
  onRuleIdsChange
}: TSYSUnifiedChartProps) {
  const [manualChartType, setManualChartType] = React.useState<'stacked-area' | 'heatmap' | 'trending' | null>(null);
  const [topContributorsFilter, setTopContributorsFilter] = React.useState<TopContributorsFilter>('all');
  const [expandedOthers, setExpandedOthers] = React.useState(false);
  const [heatmapDensity, setHeatmapDensity] = React.useState<'compact' | 'normal' | 'spacious'>('normal');
  
  const days = React.useMemo(() => dateRange ? getDaysFromDateRange(dateRange) : 14, [dateRange]);
  const dateGrouping = React.useMemo(() => getDateGrouping(days), [days]);
  const smoothingWindow = React.useMemo(() => getSmoothingWindow(days), [days]);
  
  // Use rules from FilterBar (selectedRuleIds), filtered by Rule Stage Participation
  const filteredRuleIds = React.useMemo(() => {
    // Start with rules selected in FilterBar
    let rules = selectedRuleIds.length > 0 ? selectedRuleIds : RULE_IDS;
    
    // Apply Rule Stage Participation filter
    if (ruleStageParticipation !== 'all') {
      rules = rules.filter((ruleId) => {
        const stages = RULE_STAGE_MAP[ruleId] || [];
        switch (ruleStageParticipation) {
          case 'auth-only':
            return stages.length === 1 && stages.includes('Authorization');
          case 'multi-stage':
            return stages.length > 1;
          case 'settlement-only':
            return stages.length === 1 && stages.includes('Settlement');
          case 'ach-only':
            return stages.length === 1 && stages.includes('ACH Returns');
          default:
            return true;
        }
      });
    }
    
    return rules;
  }, [selectedRuleIds, ruleStageParticipation]);

  const rawData = React.useMemo(() => {
    const baseCount = PAYMENT_STAGE_BASE_COUNTS[paymentStage];
    return generateRuleParticipationData(days, baseCount, dateGrouping);
  }, [days, dateGrouping, paymentStage]);

  const data = React.useMemo(() => {
    let processedData = [...rawData];
    
    if (smoothingWindow > 0) {
      processedData = applySmoothing(processedData, smoothingWindow);
    }
    
    return processedData;
  }, [rawData, smoothingWindow]);

  // Calculate top rules
  const top5Rules = React.useMemo(() => {
    return getTopRules(data, filteredRuleIds, 5);
  }, [data, filteredRuleIds]);

  const top10Rules = React.useMemo(() => {
    return getTopRules(data, filteredRuleIds, 10);
  }, [data, filteredRuleIds]);

  // Apply Top Contributors filter
  const contributorFilteredRules = React.useMemo(() => {
    switch (topContributorsFilter) {
      case 'top5':
        return top5Rules;
      case 'top10':
        return top10Rules;
      default:
        return filteredRuleIds;
    }
  }, [topContributorsFilter, top5Rules, top10Rules, filteredRuleIds]);

  // Track previous topContributorsFilter to only update when it actually changes
  const prevTopContributorsFilterRef = React.useRef<TopContributorsFilter>(topContributorsFilter);
  
  // Update main filter when Top Contributors changes (only when filter value changes, not when dependencies recalculate)
  React.useEffect(() => {
    // Only update if topContributorsFilter actually changed (user interaction)
    if (prevTopContributorsFilterRef.current === topContributorsFilter) {
      return;
    }
    
    prevTopContributorsFilterRef.current = topContributorsFilter;
    
    if (onRuleIdsChange) {
      let rulesToSelect: string[] = [];
      switch (topContributorsFilter) {
        case 'top5':
          rulesToSelect = top5Rules;
          break;
        case 'top10':
          rulesToSelect = top10Rules;
          break;
        case 'all':
          rulesToSelect = availableRuleIds.length > 0 ? availableRuleIds : filteredRuleIds;
          break;
      }
      
      // Only update if rules are different from current selection to avoid loops
      const currentRules = Array.isArray(selectedRuleIds) ? selectedRuleIds : [];
      const rulesAreDifferent = 
        rulesToSelect.length !== currentRules.length ||
        !rulesToSelect.every(rule => currentRules.includes(rule));
      
      if (rulesToSelect.length > 0 && rulesAreDifferent) {
        onRuleIdsChange(rulesToSelect);
      }
    }
  }, [topContributorsFilter, top5Rules, top10Rules, availableRuleIds, filteredRuleIds, onRuleIdsChange, selectedRuleIds]);

  // Generate trending data based on filtered rules and data
  const trendingData = React.useMemo(() => {
    if (effectiveChartType === 'trending') {
      // Use contributorFilteredRules to respect Top Contributors filter
      return generateTrendingData(data, contributorFilteredRules);
    }
    // Return empty array if not trending (won't be used)
    return [];
  }, [data, contributorFilteredRules, effectiveChartType]);

  // Determine chart type: auto-switch to heatmap if 12+ rules
  const effectiveChartType = React.useMemo(() => {
    if (manualChartType) return manualChartType;
    if (contributorFilteredRules.length >= 12) return 'heatmap';
    return 'stacked-area';
  }, [manualChartType, contributorFilteredRules.length]);

  // For 20+ rules, collapse to Top 5 + Others (only for stacked-area, not heatmap)
  const shouldCollapseToTop5 = contributorFilteredRules.length >= 20 && effectiveChartType === 'stacked-area';
  const displayRules = React.useMemo(() => {
    if (shouldCollapseToTop5 && !expandedOthers) {
      return top5Rules;
    }
    return contributorFilteredRules;
  }, [shouldCollapseToTop5, expandedOthers, top5Rules, contributorFilteredRules, effectiveChartType]);

  const otherRules = React.useMemo(() => {
    if (shouldCollapseToTop5) {
      return contributorFilteredRules.filter((r) => !top5Rules.includes(r));
    }
    return [];
  }, [shouldCollapseToTop5, contributorFilteredRules, top5Rules]);

  // Visible rules: always use displayRules (no focus mode)
  const visibleRules = React.useMemo(() => {
    return new Set(displayRules);
  }, [displayRules]);

  // Empty state check
  const hasNoRules = filteredRuleIds.length === 0 || displayRules.length === 0;

  // Get rule color
  const getRuleColor = (ruleId: string, isTop5: boolean): string => {
    return RULE_COLORS[ruleId] || '#94a3b8';
  };

  // Get rule opacity
  const getRuleOpacity = (ruleId: string, isTop5: boolean): number => {
    if (isTop5) {
      return 1.0;
    }
    return contributorFilteredRules.length > 10 ? 0.5 : 1.0;
  };

  // Get stroke width
  const getStrokeWidth = (ruleId: string, isTop5: boolean): number => {
    if (isTop5) {
      return 1.5;
    }
    return contributorFilteredRules.length > 10 ? 1 : 1.5;
  };

  // Get heatmap color intensity
  const getHeatmapColor = (value: number, maxValue: number): string => {
    if (maxValue === 0) return HEATMAP_COLORS[0] || '#e0f2fe';
    const ratio = value / maxValue;
    const index = Math.min(Math.floor(ratio * (HEATMAP_COLORS.length - 1)), HEATMAP_COLORS.length - 1);
    return HEATMAP_COLORS[index] || '#e0f2fe';
  };


  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // Special tooltip for trending chart
      if (effectiveChartType === 'trending') {
        const authItem = payload.find((item: any) => item.dataKey === 'authVolume');
        const autoHoldItem = payload.find((item: any) => item.dataKey === 'autoHold');
        
        return (
          <Box
            bg="white"
            p={3}
            borderRadius="md"
            boxShadow="lg"
            borderWidth="1px"
            borderColor="gray.200"
            minW="200px"
          >
            <Text fontSize="sm" fontWeight="bold" mb={2}>
              {label}
            </Text>
            <VStack align="stretch" gap={2}>
              {authItem && (
                <HStack justify="space-between" gap={4}>
                  <HStack gap={2}>
                    <Box
                      w="12px"
                      h="12px"
                      borderRadius="sm"
                      bg="#3b82f6"
                      borderWidth="1px"
                      borderColor="gray.300"
                    />
                    <Text fontSize="xs" color="gray.700" fontWeight="semibold">
                      Daily authorization volumes
                    </Text>
                  </HStack>
                  <Text fontSize="xs" fontWeight="semibold">
                    {authItem.value.toLocaleString()}
                  </Text>
                </HStack>
              )}
              {autoHoldItem && (
                <HStack justify="space-between" gap={4}>
                  <HStack gap={2}>
                    <Box
                      w="12px"
                      h="12px"
                      borderRadius="sm"
                      bg="#ef4444"
                      borderWidth="1px"
                      borderColor="gray.300"
                    />
                    <Text fontSize="xs" color="gray.700" fontWeight="semibold">
                      Auto hold counts
                    </Text>
                  </HStack>
                  <Text fontSize="xs" fontWeight="semibold">
                    {autoHoldItem.value.toLocaleString()}
                  </Text>
                </HStack>
              )}
            </VStack>
          </Box>
        );
      }
      
      // Regular tooltip for other chart types
      const visiblePayload = payload.filter((item: any) => visibleRules.has(item.dataKey));
      const total = visiblePayload.reduce((sum: number, item: any) => sum + (item.value || 0), 0);
      const dataItem = payload[0]?.payload;
      
      let tooltipHeader = label;
      if (dateGrouping === 'weekly' && dataItem?.dateRange) {
        const start = dataItem.dateRange.start;
        const end = dataItem.dateRange.end;
        tooltipHeader = `${formatWeeklyDate(start, end)} (Weekly Summary)`;
      } else if (dateGrouping === 'monthly' && dataItem?.dateRange) {
        const start = dataItem.dateRange.start;
        const end = dataItem.dateRange.end;
        tooltipHeader = `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}–${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} (Monthly Summary)`;
      }
      
      return (
        <Box
          bg="white"
          p={3}
          borderRadius="md"
          boxShadow="lg"
          borderWidth="1px"
          borderColor="gray.200"
          minW="250px"
        >
          <Text fontSize="sm" fontWeight="bold" mb={2}>
            {tooltipHeader}
          </Text>
          <VStack align="stretch" gap={1.5}>
            {visiblePayload.map((item: any, index: number) => {
              const percentage = calculatePercentage(item.value, total);
              const ruleId = item.dataKey;
              const isTop5 = top5Rules.includes(ruleId);
              const stages = RULE_STAGE_MAP[ruleId] || [];
              
              return (
                <VStack key={index} align="stretch" gap={0.5}>
                  <HStack justify="space-between" gap={4}>
                    <HStack gap={2}>
                      <Box
                        w="12px"
                        h="12px"
                        borderRadius="sm"
                        bg={item.color}
                        borderWidth="1px"
                        borderColor="gray.300"
                      />
                      <VStack align="start" gap={0}>
                        <Text fontSize="xs" color="gray.700" fontWeight="semibold">
                          {RULE_DESCRIPTIONS[ruleId] || ruleId}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {ruleId}
                        </Text>
                      </VStack>
                    </HStack>
                    <VStack align="end" gap={0}>
                      <Text fontSize="xs" fontWeight="semibold">
                        {item.value.toLocaleString()}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {percentage}%
                      </Text>
                    </VStack>
                  </HStack>
                  <Text fontSize="xs" color="gray.500">
                    Payment Stage: {stages.join(', ') || 'N/A'}
                  </Text>
                </VStack>
              );
            })}
            <Box pt={1} borderTopWidth="1px" borderColor="gray.200" mt={1}>
              <HStack justify="space-between">
                <Text fontSize="xs" fontWeight="bold" color="gray.700">Total:</Text>
                <Text fontSize="xs" fontWeight="bold">{total.toLocaleString()}</Text>
              </HStack>
            </Box>
          </VStack>
        </Box>
      );
    }
    return null;
  };

  const xAxisConfig = getXAxisConfig(data.length, dateGrouping);
  const showGridlines = data.length <= 30;
  const useLineChart = data.length > 60;

  const chartTypeCollection = createListCollection({
    items: [
      { label: 'Stacked Area', value: 'stacked-area' },
      { label: 'Heatmap', value: 'heatmap' },
      { label: 'Trending', value: 'trending' },
    ],
  });

  const topContributorsCollection = createListCollection({
    items: [
      { label: 'All Rules', value: 'all' },
      { label: 'Top 5', value: 'top5' },
      { label: 'Top 10', value: 'top10' },
    ],
  });

  // Empty state
  if (hasNoRules) {
    return (
      <Box 
        bg="white" 
        p={6} 
        borderRadius="xl" 
        boxShadow="0 2px 8px rgba(0,0,0,0.05)"
        borderWidth="1px"
        borderColor="gray.200"
      >
        <VStack align="center" justify="center" minH="400px" gap={4}>
          <Text fontSize="lg" color="gray.500" fontWeight="medium">
            No rule activity for this combination of filters.
          </Text>
          <Text fontSize="sm" color="gray.400">
            Try adjusting your filter selections to see rule participation data.
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box 
      bg="white" 
      p={6} 
      borderRadius="xl" 
      boxShadow="0 2px 8px rgba(0,0,0,0.05)"
      borderWidth="1px"
      borderColor="gray.200"
      role="region"
      aria-label="TSYS Performance Overview Chart"
    >
      <VStack align="stretch" gap={4}>
        <HStack justify="space-between" align="flex-start" flexWrap="wrap" gap={4}>
          <VStack align="start" gap={1} flex={1}>
            <HStack gap={2} align="center">
              <Text fontSize="xl" fontWeight="bold">
                TSYS Performance Overview
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
                    aria-label="Chart information"
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
                      Rule participation across payment stages over time for TSYS transactions.
                    </Tooltip.Content>
                  </Tooltip.Positioner>
                </Portal>
              </Tooltip.Root>
            </HStack>
          </VStack>
          <HStack gap={3} flexWrap="wrap">
            <Box minW="150px">
              <Text fontSize="xs" fontWeight="semibold" color="gray.600" mb={1}>
                Chart Type
              </Text>
              <Select.Root
                value={[effectiveChartType]}
                onValueChange={(e) => setManualChartType(e.value[0] as 'stacked-area' | 'heatmap' | 'trending')}
                collection={chartTypeCollection}
                size="sm"
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {chartTypeCollection.items.map((item) => (
                        <Select.Item key={item.value} item={item}>
                          {item.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </Box>
            <Box minW="150px">
              <Text fontSize="xs" fontWeight="semibold" color="gray.600" mb={1}>
                Top Contributors
              </Text>
              <Select.Root
                value={[topContributorsFilter]}
                onValueChange={(e) => setTopContributorsFilter(e.value[0] as TopContributorsFilter)}
                collection={topContributorsCollection}
                size="sm"
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {topContributorsCollection.items.map((item) => (
                        <Select.Item key={item.value} item={item}>
                          {item.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </Box>
            {effectiveChartType === 'heatmap' && (
              <Box minW="150px">
                <Text fontSize="xs" fontWeight="semibold" color="gray.600" mb={1}>
                  Density
                </Text>
                <Select.Root
                  value={[heatmapDensity]}
                  onValueChange={(e) => setHeatmapDensity(e.value[0] as 'compact' | 'normal' | 'spacious')}
                  collection={createListCollection({
                    items: [
                      { label: 'Compact', value: 'compact' },
                      { label: 'Normal', value: 'normal' },
                      { label: 'Spacious', value: 'spacious' },
                    ],
                  })}
                  size="sm"
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        <Select.Item item={{ label: 'Compact', value: 'compact' }}>
                          Compact
                          <Select.ItemIndicator />
                        </Select.Item>
                        <Select.Item item={{ label: 'Normal', value: 'normal' }}>
                          Normal
                          <Select.ItemIndicator />
                        </Select.Item>
                        <Select.Item item={{ label: 'Spacious', value: 'spacious' }}>
                          Spacious
                          <Select.ItemIndicator />
                        </Select.Item>
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              </Box>
            )}
            <Text fontSize="xs" color="gray.500">
              Last Updated: {new Date().toLocaleString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </HStack>
        </HStack>

        <Text fontSize="sm" color="gray.600">
          Rule participation across payment stages over time
        </Text>

        {/* Auto-switch banner */}
        {effectiveChartType === 'heatmap' && contributorFilteredRules.length >= 12 && !manualChartType && (
          <Box
            bg="blue.50"
            borderWidth="1px"
            borderColor="blue.200"
            borderRadius="md"
            p={3}
          >
            <HStack justify="space-between" align="center">
              <Text fontSize="sm" color="blue.700">
                Heatmap mode activated to improve readability with large rule sets.
              </Text>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => setManualChartType('stacked-area')}
              >
                <X size={14} />
              </Button>
            </HStack>
          </Box>
        )}

        {/* Chart */}
        <Box width="100%">
          {effectiveChartType === 'trending' ? (
            <Box height="400px" width="100%">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendingData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    domain={[0, 16000]}
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                    label={{ value: 'Count', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#6b7280' }}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="line"
                    iconSize={12}
                  />
                  <Line
                    type="monotone"
                    dataKey="authVolume"
                    name="Daily authorization volumes"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 3 }}
                    activeDot={{ r: 5 }}
                    animationDuration={300}
                  />
                  <Line
                    type="monotone"
                    dataKey="autoHold"
                    name="Auto hold counts"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: '#ef4444', r: 3 }}
                    activeDot={{ r: 5 }}
                    animationDuration={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          ) : effectiveChartType === 'heatmap' ? (
            <Box width="100%">
              {/* Calculate visible rules count for dynamic sizing */}
              {(() => {
                const visibleRulesList = Array.from(visibleRules);
                const ruleCount = visibleRulesList.length;
                const dataCount = data.length;
                
                // Density-based cell sizing
                const densityMultipliers = {
                  compact: { width: 0.8, height: 0.7 },
                  normal: { width: 1.0, height: 1.0 },
                  spacious: { width: 1.3, height: 1.2 },
                };
                const multiplier = densityMultipliers[heatmapDensity];
                
                // Base cell sizes
                const baseCellWidth = ruleCount <= 1 ? 80 : ruleCount <= 5 ? 70 : 50;
                const baseCellHeight = ruleCount <= 1 ? 40 : ruleCount <= 5 ? 32 : 24;
                
                // Apply density multiplier
                const cellWidth = Math.round(baseCellWidth * multiplier.width);
                const cellHeight = Math.round(baseCellHeight * multiplier.height);
                const rowHeight = cellHeight + 2;
                const headerHeight = 20;
                const totalHeight = ruleCount * rowHeight + headerHeight + 4;
                const minHeight = Math.max(150, totalHeight);
                const maxHeight = 300;
                const dynamicHeight = Math.min(maxHeight, minHeight);
                
                // Calculate available width (subtract label width and padding)
                const labelWidth = 110;
                const padding = 16; // 8px on each side
                const gapSize = 0.5 * 4; // 0.5 gap in px (4px per gap unit in Chakra)
                const totalGaps = (dataCount - 1) * gapSize;
                const availableWidth = `calc(100% - ${labelWidth + padding}px)`;
                const cellFlexBasis = dataCount > 0 ? `calc((${availableWidth} - ${totalGaps}px) / ${dataCount})` : `${cellWidth}px`;
                
                return (
                  <Box
                    width="100%"
                    height={`${dynamicHeight}px`}
                    overflow="hidden"
                    position="relative"
                    transition="height 200ms ease-in-out"
                  >
                    <Box
                      width="100%"
                      height="100%"
                      overflowY="auto"
                      position="relative"
                    >
                      <Box width="100%" position="relative">
                        {/* Sticky header with date labels */}
                        <Box
                          position="sticky"
                          top={0}
                          zIndex={10}
                          bg="white"
                          borderBottomWidth="1px"
                          borderBottomColor="gray.200"
                          pb={1}
                        >
                          <HStack gap={0.5} ml={`${labelWidth}px`} pt={1} width={`calc(100% - ${labelWidth}px)`}>
                            {data.map((item, index) => (
                              <Box
                                key={index}
                                flex="1"
                                minW="0"
                                textAlign="center"
                                fontSize="xs"
                                color="gray.600"
                                lineHeight="1.2"
                              >
                                {item.date.length > 8 ? item.date.substring(0, 5) : item.date}
                              </Box>
                            ))}
                          </HStack>
                        </Box>
                        
                        {/* Heatmap rows with sticky labels */}
                        <VStack align="stretch" gap={0.5} p={1}>
                          {visibleRulesList.map((ruleId) => {
                            const isTop5 = top5Rules.includes(ruleId);
                            
                            // Calculate max value for this rule across all dates (normalized per rule)
                            const maxValue = Math.max(...data.map((item) => item[ruleId] || 0));
                            const stages = RULE_STAGE_MAP[ruleId] || [];
                            
                            return (
                              <HStack key={ruleId} gap={0.5} align="center" h={`${rowHeight}px`}>
                                {/* Sticky Y-axis label */}
                                <Box
                                  position="sticky"
                                  left={0}
                                  zIndex={5}
                                  w={`${labelWidth}px`}
                                  minW={`${labelWidth}px`}
                                  bg="white"
                                  borderRightWidth="1px"
                                  borderRightColor="gray.200"
                                  pr={2}
                                  display="flex"
                                  flexDirection="row"
                                  justifyContent="center"
                                  alignItems="center"
                                >
                                  <Text 
                                    fontSize="xs" 
                                    color="gray.700" 
                                    fontWeight={isTop5 ? 'semibold' : 'normal'}
                                    lineClamp={1}
                                    textAlign="center"
                                  >
                                    {RULE_DESCRIPTIONS[ruleId] || ruleId}
                                  </Text>
                                </Box>
                                
                                {/* Heatmap cells - full width distribution */}
                                <HStack gap={0.5} ml={0} flex="1" width={`calc(100% - ${labelWidth}px)`}>
                                  {data.map((item, dateIndex) => {
                                    const value = item[ruleId] || 0;
                                    const total = item.total || 1;
                                    const percentage = calculatePercentage(value, total);
                                    const bgColor = getHeatmapColor(value, maxValue);
                                    
                                    return (
                                      <Tooltip.Root key={dateIndex}>
                                        <Tooltip.Trigger asChild>
                                          <Box
                                            flex="1"
                                            minW="0"
                                            h={`${cellHeight}px`}
                                            bg={bgColor}
                                            borderWidth="1px"
                                            borderColor="gray.200"
                                            borderRadius="sm"
                                            cursor="pointer"
                                            _hover={{ borderColor: 'gray.400', borderWidth: '2px' }}
                                            transition="all 0.2s"
                                          />
                                        </Tooltip.Trigger>
                                        <Portal>
                                          <Tooltip.Positioner>
                                            <Tooltip.Content
                                              bg="gray.900"
                                              color="white"
                                              px={3}
                                              py={2}
                                              borderRadius="md"
                                              fontSize="sm"
                                              boxShadow="lg"
                                            >
                                              <Tooltip.Arrow />
                                              <VStack align="start" gap={1}>
                                                <Text fontWeight="bold">{item.date}</Text>
                                                <Text>{RULE_DESCRIPTIONS[ruleId] || ruleId}</Text>
                                                <Text fontSize="xs">{ruleId}</Text>
                                                <Text fontSize="xs">Count: {value.toLocaleString()}</Text>
                                                <Text fontSize="xs">Share: {percentage}%</Text>
                                                <Text fontSize="xs">Payment Stage: {stages.join(', ') || 'N/A'}</Text>
                                              </VStack>
                                            </Tooltip.Content>
                                          </Tooltip.Positioner>
                                        </Portal>
                                      </Tooltip.Root>
                                    );
                                  })}
                                </HStack>
                              </HStack>
                            );
                          })}
                        </VStack>
                      </Box>
                    </Box>
                  </Box>
                );
              })()}
              
              {/* Color scale explanation */}
              <Text fontSize="xs" color="gray.500" mt={2} textAlign="center">
                Colors represent relative intensity per rule, not absolute scale.
              </Text>
            </Box>
          ) : (
            <Box height="400px" width="100%">
              <ResponsiveContainer width="100%" height="100%">
              {useLineChart ? (
                <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: xAxisConfig.angle !== 0 ? 40 : 5 }}>
                  {showGridlines && <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />}
                  <XAxis 
                    dataKey="date" 
                    {...xAxisConfig}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                    label={{ value: 'Count', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#6b7280' }}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ display: 'none' }}
                  />
                  {displayRules.map((ruleId) => {
                    if (!visibleRules.has(ruleId)) return null;
                    const isTop5 = top5Rules.includes(ruleId);
                    const opacity = getRuleOpacity(ruleId, isTop5);
                    const color = getRuleColor(ruleId, isTop5);
                    
                    return (
                      <Line
                        key={ruleId}
                        type="monotone"
                        dataKey={ruleId}
                        stroke={color}
                        strokeWidth={getStrokeWidth(ruleId, isTop5)}
                        strokeOpacity={opacity}
                        dot={{ fill: color, r: 3, opacity }}
                        activeDot={{ r: 5 }}
                        animationDuration={400}
                      />
                    );
                  })}
                </LineChart>
              ) : (
                <AreaChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: xAxisConfig.angle !== 0 ? 40 : 5 }}>
                  {showGridlines && <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />}
                  <XAxis 
                    dataKey="date" 
                    {...xAxisConfig}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                    label={{ value: 'Count', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#6b7280' }}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ display: 'none' }}
                  />
                  {displayRules.map((ruleId) => {
                    if (!visibleRules.has(ruleId)) return null;
                    const isTop5 = top5Rules.includes(ruleId);
                    const opacity = getRuleOpacity(ruleId, isTop5);
                    const color = getRuleColor(ruleId, isTop5);
                    
                    return (
                      <Area
                        key={ruleId}
                        type={dateGrouping === 'weekly' || dateGrouping === 'monthly' ? 'monotone' : 'linear'}
                        dataKey={ruleId}
                        stackId="rules"
                        fill={color}
                        stroke={color}
                        strokeWidth={getStrokeWidth(ruleId, isTop5)}
                        fillOpacity={opacity}
                        animationDuration={400}
                      />
                    );
                  })}
                </AreaChart>
              )}
              </ResponsiveContainer>
            </Box>
          )}
        </Box>

        {/* Top 5 + Others collapse */}
        {shouldCollapseToTop5 && !expandedOthers && otherRules.length > 0 && (
          <Box
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="md"
            p={3}
            cursor="pointer"
            onClick={() => setExpandedOthers(true)}
            _hover={{ bg: 'gray.50' }}
          >
            <HStack justify="space-between">
              <Text fontSize="sm" fontWeight="medium" color="gray.700">
                Other rules ({otherRules.length})
              </Text>
              <Text fontSize="xs" color="gray.500">
                Click to expand
              </Text>
            </HStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
