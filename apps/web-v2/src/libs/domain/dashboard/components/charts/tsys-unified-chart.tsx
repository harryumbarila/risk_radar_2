'use client';
import React from 'react';
import { Box, VStack, Text, HStack, Tooltip, Portal, Select, createListCollection, Badge, Button, Checkbox } from '@chakra-ui/react';
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
import type { FilterState } from '../../filter-bar/filter-bar';
import {
  generateRuleParticipationData,
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

export type PaymentStage = 'Authorization' | 'Capture' | 'Settlement' | 'ACH Returns';
export type RuleStageParticipation = 'all' | 'auth-only' | 'multi-stage' | 'settlement-only' | 'ach-only';
export type TopContributorsFilter = 'all' | 'top5' | 'top10' | 'payment-stage-only';

interface TSYSUnifiedChartProps {
  dateRange?: FilterState;
  paymentStage?: PaymentStage;
  ruleStageParticipation?: RuleStageParticipation;
  selectedRuleIds?: string[]; // Rules selected from FilterBar
}

// Define which rules apply to which stages
const RULE_STAGE_MAP: Record<string, PaymentStage[]> = {
  AH001: ['Authorization', 'Capture'],
  AH002: ['Authorization'],
  AH003: ['Authorization', 'Capture', 'Settlement'],
  AH004: ['Authorization', 'Capture'],
  AH005: ['Authorization'],
  AH006: ['Settlement'],
  AH007: ['ACH Returns'],
  // Generate mappings for remaining rules
  ...Object.fromEntries(
    Array.from({ length: 38 }, (_, i) => {
      const num = i + 8;
      const ruleId = `AH${num.toString().padStart(3, '0')}`;
      const stages = [
        ['Authorization'],
        ['Capture'],
        ['Settlement'],
        ['ACH Returns'],
        ['Authorization', 'Capture'],
        ['Authorization', 'Settlement'],
        ['Capture', 'Settlement'],
        ['Authorization', 'Capture', 'Settlement'],
      ];
      return [ruleId, stages[i % stages.length]];
    })
  ),
};

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
  selectedRuleIds = []
}: TSYSUnifiedChartProps) {
  const [manualChartType, setManualChartType] = React.useState<'stacked-area' | 'heatmap' | null>(null);
  const [focusedRule, setFocusedRule] = React.useState<string | null>(null);
  const [focusMode, setFocusMode] = React.useState<'off' | 'single' | 'subset'>('off');
  const [focusedSubset, setFocusedSubset] = React.useState<Set<string>>(new Set());
  const [topContributorsFilter, setTopContributorsFilter] = React.useState<TopContributorsFilter>('all');
  const [expandedOthers, setExpandedOthers] = React.useState(false);
  
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
      case 'payment-stage-only':
        return filteredRuleIds.filter((ruleId) => {
          const stages = RULE_STAGE_MAP[ruleId] || [];
          return stages.includes(paymentStage);
        });
      default:
        return filteredRuleIds;
    }
  }, [topContributorsFilter, top5Rules, top10Rules, filteredRuleIds, paymentStage]);

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

  // Visible rules: based on focus mode
  const visibleRules = React.useMemo(() => {
    if (focusMode === 'single' && focusedRule) {
      return new Set([focusedRule]);
    }
    if (focusMode === 'subset' && focusedSubset.size > 0) {
      return focusedSubset;
    }
    return new Set(displayRules);
  }, [focusMode, focusedRule, focusedSubset, displayRules]);

  // Empty state check
  const hasNoRules = filteredRuleIds.length === 0 || displayRules.length === 0;

  // Get rule color
  const getRuleColor = (ruleId: string, isTop5: boolean): string => {
    return RULE_COLORS[ruleId] || '#94a3b8';
  };

  // Get rule opacity
  const getRuleOpacity = (ruleId: string, isTop5: boolean): number => {
    if (focusMode === 'single' && focusedRule === ruleId) {
      return 1.0;
    }
    if (focusMode === 'single' && focusedRule && focusedRule !== ruleId) {
      return 0.15;
    }
    if (focusMode === 'subset' && focusedSubset.has(ruleId)) {
      return 1.0;
    }
    if (focusMode === 'subset' && focusedSubset.size > 0 && !focusedSubset.has(ruleId)) {
      return 0.15;
    }
    if (isTop5) {
      return 1.0;
    }
    return contributorFilteredRules.length > 10 ? 0.5 : 1.0;
  };

  // Get stroke width
  const getStrokeWidth = (ruleId: string, isTop5: boolean): number => {
    if (focusMode === 'single' && focusedRule === ruleId) {
      return 2.5;
    }
    if (isTop5) {
      return 1.5;
    }
    return contributorFilteredRules.length > 10 ? 1 : 1.5;
  };

  // Get heatmap color intensity
  const getHeatmapColor = (value: number, maxValue: number): string => {
    if (maxValue === 0) return HEATMAP_COLORS[0];
    const ratio = value / maxValue;
    const index = Math.min(Math.floor(ratio * (HEATMAP_COLORS.length - 1)), HEATMAP_COLORS.length - 1);
    return HEATMAP_COLORS[index];
  };

  const handleRuleHover = (ruleId: string | null) => {
    if (focusMode === 'off') {
      setFocusedRule(ruleId);
    }
  };

  const handleRuleClick = (ruleId: string) => {
    if (focusMode === 'subset') {
      setFocusedSubset((prev) => {
        const next = new Set(prev);
        if (next.has(ruleId)) {
          next.delete(ruleId);
        } else {
          next.add(ruleId);
        }
        return next;
      });
    } else if (focusMode === 'single') {
      if (focusedRule === ruleId) {
        setFocusedRule(null);
      } else {
        setFocusedRule(ruleId);
      }
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
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
    ],
  });

  const topContributorsCollection = createListCollection({
    items: [
      { label: 'All Rules', value: 'all' },
      { label: 'Top 5', value: 'top5' },
      { label: 'Top 10', value: 'top10' },
      { label: 'Payment Stage Only', value: 'payment-stage-only' },
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
        <HStack justify="space-between" align="flex-start">
          <VStack align="start" gap={1}>
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
          <HStack gap={3}>
            <Box minW="150px">
              <Text fontSize="xs" fontWeight="semibold" color="gray.600" mb={1}>
                Chart Type
              </Text>
              <Select.Root
                value={[effectiveChartType]}
                onValueChange={(e) => setManualChartType(e.value[0] as 'stacked-area' | 'heatmap')}
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

        {/* Controls */}
        <HStack gap={4} flexWrap="wrap">
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

          <Box minW="150px">
            <Text fontSize="xs" fontWeight="semibold" color="gray.600" mb={1}>
              Focus Mode
            </Text>
            <Select.Root
              value={[focusMode]}
              onValueChange={(e) => {
                const mode = e.value[0] as 'off' | 'single' | 'subset';
                setFocusMode(mode);
                if (mode === 'off') {
                  setFocusedRule(null);
                  setFocusedSubset(new Set());
                }
              }}
              collection={createListCollection({
                items: [
                  { label: 'Off', value: 'off' },
                  { label: 'Single Rule', value: 'single' },
                  { label: 'Selected Subset', value: 'subset' },
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
                    <Select.Item item={{ label: 'Off', value: 'off' }}>
                      Off
                      <Select.ItemIndicator />
                    </Select.Item>
                    <Select.Item item={{ label: 'Single Rule', value: 'single' }}>
                      Single Rule
                      <Select.ItemIndicator />
                    </Select.Item>
                    <Select.Item item={{ label: 'Selected Subset', value: 'subset' }}>
                      Selected Subset
                      <Select.ItemIndicator />
                    </Select.Item>
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </Box>

          {/* Focus subset chips */}
          {focusMode === 'subset' && (
            <Box flex={1}>
              <Text fontSize="xs" fontWeight="semibold" color="gray.600" mb={1}>
                Selected Rules
              </Text>
              <HStack gap={2} flexWrap="wrap">
                {Array.from(focusedSubset).map((ruleId) => (
                  <Badge
                    key={ruleId}
                    colorPalette="blue"
                    variant="subtle"
                    px={2}
                    py={1}
                    borderRadius="md"
                    cursor="pointer"
                    onClick={() => handleRuleClick(ruleId)}
                  >
                    {RULE_DESCRIPTIONS[ruleId] || ruleId}
                    <Button
                      size="xs"
                      variant="ghost"
                      ml={1}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRuleClick(ruleId);
                      }}
                    >
                      <X size={12} />
                    </Button>
                  </Badge>
                ))}
                {focusedSubset.size === 0 && (
                  <Text fontSize="xs" color="gray.400">
                    Click rules in chart to add to subset
                  </Text>
                )}
              </HStack>
            </Box>
          )}
        </HStack>

        {/* Chart */}
        <Box height="400px" width="100%">
          {effectiveChartType === 'heatmap' ? (
            <Box height="100%" width="100%" overflowX="auto">
              <Box minW="600px">
                <VStack align="stretch" gap={2}>
                  {/* X-axis labels */}
                  <HStack gap={1} ml="120px">
                    {data.map((item, index) => (
                      <Box
                        key={index}
                        w="40px"
                        textAlign="center"
                        fontSize="xs"
                        color="gray.600"
                        lineHeight="1.2"
                      >
                        {item.date.length > 8 ? item.date.substring(0, 5) : item.date}
                      </Box>
                    ))}
                  </HStack>
                  
                  {/* Heatmap cells */}
                  <Box overflowY="auto" maxH="350px">
                    <VStack align="stretch" gap={1}>
                      {displayRules.map((ruleId) => {
                        const isTop5 = top5Rules.includes(ruleId);
                        const isVisible = visibleRules.has(ruleId);
                        if (!isVisible) return null;
                        
                        // Calculate max value for this rule across all dates
                        const maxValue = Math.max(...data.map((item) => item[ruleId] || 0));
                        const stages = RULE_STAGE_MAP[ruleId] || [];
                        
                        return (
                          <HStack key={ruleId} gap={1} align="center">
                            {/* Y-axis label */}
                            <Box
                              w="120px"
                              fontSize="xs"
                              color="gray.700"
                              fontWeight={isTop5 ? 'semibold' : 'normal'}
                              textAlign="right"
                              pr={2}
                              lineHeight="1.2"
                            >
                              <Text fontSize="xs" lineClamp={1}>
                                {RULE_DESCRIPTIONS[ruleId] || ruleId}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                {ruleId}
                              </Text>
                            </Box>
                            
                            {/* Heatmap cells */}
                            {data.map((item, dateIndex) => {
                              const value = item[ruleId] || 0;
                              const total = item.total || 1;
                              const percentage = calculatePercentage(value, total);
                              const bgColor = getHeatmapColor(value, maxValue);
                              const stages = RULE_STAGE_MAP[ruleId] || [];
                              
                              return (
                                <Tooltip.Root key={dateIndex}>
                                  <Tooltip.Trigger asChild>
                                    <Box
                                      w="40px"
                                      h="40px"
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
                        );
                      })}
                    </VStack>
                  </Box>
                </VStack>
              </Box>
            </Box>
          ) : (
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
