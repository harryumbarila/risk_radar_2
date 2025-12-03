'use client';
import React from 'react';
import { Box, VStack, Text, HStack, Tooltip, Portal, Select, createListCollection, Button, Drawer, Badge, Table, CloseButton, SimpleGrid } from '@chakra-ui/react';
import { Info, X, TrendingUp, TrendingDown, Minus, FileText } from 'lucide-react';
import BatchDrawer from '../../auto-hold/components/batch-drawer/batch-drawer';
import { MerchantTransaction } from '@/data/interfaces/transaction';
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

interface SelectedCell {
  ruleId: string;
  date: string;
  dateIndex: number;
  value: number;
  percentage: number;
  maxValue: number;
  bgColor: string;
}

export default function TSYSUnifiedChart({ 
  dateRange, 
  paymentStage = 'Authorization',
  ruleStageParticipation = 'all',
  selectedRuleIds = [],
  availableRuleIds = [],
  onRuleIdsChange
}: TSYSUnifiedChartProps) {
  const [manualChartType, setManualChartType] = React.useState<'stacked-area' | 'heatmap' | 'trending' | null>(null);
  const [topContributorsFilter, setTopContributorsFilter] = React.useState<TopContributorsFilter>('top5');
  const [expandedOthers, setExpandedOthers] = React.useState(false);
  const [selectedCell, setSelectedCell] = React.useState<SelectedCell | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  
  const days = React.useMemo(() => dateRange ? getDaysFromDateRange(dateRange) : 14, [dateRange]);
  const dateGrouping = React.useMemo(() => getDateGrouping(days), [days]);
  const smoothingWindow = React.useMemo(() => getSmoothingWindow(days), [days]);
  
  // Use rules from FilterBar (selectedRuleIds), filtered by Rule Stage Participation
  // This is the base set of rules to work with
  const baseRuleIds = React.useMemo(() => {
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

  // Use baseRuleIds for calculations (this ensures we always have the full set)
  const filteredRuleIds = baseRuleIds;

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

  // Calculate top rules based on baseRuleIds (always use full set for ranking)
  const top5Rules = React.useMemo(() => {
    return getTopRules(data, baseRuleIds, 5);
  }, [data, baseRuleIds]);

  const top10Rules = React.useMemo(() => {
    return getTopRules(data, baseRuleIds, 10);
  }, [data, baseRuleIds]);

  // Apply Top Contributors filter - this determines which rules to show in charts
  // This should update immediately when topContributorsFilter changes, independent of filter sync
  const contributorFilteredRules = React.useMemo(() => {
    switch (topContributorsFilter) {
      case 'top5':
        // Return top5Rules if available, otherwise return empty array
        return top5Rules.length > 0 ? top5Rules : [];
      case 'top10':
        // Return top10Rules if available, otherwise return empty array
        // Don't wait for calculation - if it's not ready, return empty and it will update when ready
        return top10Rules.length > 0 ? top10Rules : [];
      case 'all':
        return baseRuleIds.length > 0 ? baseRuleIds : [];
      default:
        return baseRuleIds.length > 0 ? baseRuleIds : [];
    }
  }, [topContributorsFilter, top5Rules, top10Rules, baseRuleIds]);

  // Track previous topContributorsFilter to only update when it actually changes
  const prevTopContributorsFilterRef = React.useRef<TopContributorsFilter | null>(null);
  const hasInitializedRef = React.useRef(false);
  
  // Update main filter when Top Contributors changes (but don't block chart updates)
  React.useEffect(() => {
    // Skip if filter hasn't changed (after initial mount)
    if (hasInitializedRef.current && prevTopContributorsFilterRef.current === topContributorsFilter) {
      return;
    }
    
    // Wait for rules to be calculated before updating main filter
    // But don't block - let charts update immediately with whatever is available
    let rulesToSelect: string[] = [];
    switch (topContributorsFilter) {
      case 'top5':
        if (top5Rules.length === 0) {
          return; // Wait for top5Rules to be calculated
        }
        rulesToSelect = top5Rules;
        break;
      case 'top10':
        if (top10Rules.length === 0) {
          return; // Wait for top10Rules to be calculated
        }
        rulesToSelect = top10Rules;
        break;
      case 'all':
        rulesToSelect = availableRuleIds.length > 0 ? availableRuleIds : baseRuleIds;
        break;
    }
    
    // Mark as initialized after first successful run
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
    }
    
    prevTopContributorsFilterRef.current = topContributorsFilter;
    
    // Update main filter asynchronously to not block chart rendering
    if (onRuleIdsChange && rulesToSelect.length > 0) {
      // Use setTimeout to ensure this doesn't block the chart update
      const timeoutId = setTimeout(() => {
        // Only update if rules are different from current selection to avoid loops
        const currentRules = Array.isArray(selectedRuleIds) ? selectedRuleIds : [];
        const rulesAreDifferent = 
          rulesToSelect.length !== currentRules.length ||
          !rulesToSelect.every(rule => currentRules.includes(rule));
        
        if (rulesAreDifferent) {
          onRuleIdsChange(rulesToSelect);
        }
      }, 0);
      
      return () => clearTimeout(timeoutId);
    }
  }, [topContributorsFilter, top5Rules, top10Rules, availableRuleIds, baseRuleIds, onRuleIdsChange, selectedRuleIds]);

  // Determine chart type: auto-switch to heatmap if 12+ rules
  const effectiveChartType = React.useMemo(() => {
    if (manualChartType) return manualChartType;
    if (contributorFilteredRules.length >= 12) return 'heatmap';
    return 'stacked-area';
  }, [manualChartType, contributorFilteredRules.length]);

  // For trending chart, respect Top Contributors filter
  const trendingRules = React.useMemo(() => {
    if (effectiveChartType === 'trending') {
      // Use contributorFilteredRules which already respects Top Contributors filter
      // For trending chart, show up to 10 rules max to avoid visual clutter
      if (contributorFilteredRules.length > 10) {
        return contributorFilteredRules.slice(0, 10);
      }
      return contributorFilteredRules;
    }
    return [];
  }, [effectiveChartType, contributorFilteredRules]);

  // Generate trending data based on filtered rules and data
  const trendingData = React.useMemo(() => {
    if (effectiveChartType === 'trending') {
      // Use top 5 rules for trending chart
      return generateTrendingData(data, trendingRules);
    }
    // Return empty array if not trending (won't be used)
    return [];
  }, [data, trendingRules, effectiveChartType]);

  // For 20+ rules, collapse to Top 5 + Others (only for stacked-area, not heatmap)
  // BUT: Don't collapse if user explicitly selected "Top 10" or "All Rules" - respect their choice
  const shouldCollapseToTop5 = 
    contributorFilteredRules.length >= 20 && 
    effectiveChartType === 'stacked-area' &&
    topContributorsFilter === 'top5'; // Only collapse if user selected Top 5
  
  const displayRules = React.useMemo(() => {
    // If user selected Top 10 or All Rules, always show all contributorFilteredRules
    if (topContributorsFilter === 'top10' || topContributorsFilter === 'all') {
      return contributorFilteredRules;
    }
    
    // For Top 5, apply collapse logic if needed
    if (shouldCollapseToTop5 && !expandedOthers) {
      return top5Rules;
    }
    return contributorFilteredRules;
  }, [shouldCollapseToTop5, expandedOthers, top5Rules, contributorFilteredRules, effectiveChartType, topContributorsFilter]);

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
        // Filter payload to only show visible rules
        const visiblePayload = payload.filter((item: any) => trendingRules.includes(item.dataKey));
        const total = visiblePayload.reduce((sum: number, item: any) => sum + (item.value || 0), 0);
        
        // Show all rules, with scroll if more than 10
        const hasMoreRules = visiblePayload.length > 10;
        const scrollId = `tooltip-scroll-${Math.random().toString(36).substr(2, 9)}`;
        
        return (
          <>
            <style>
              {`
                #${scrollId}::-webkit-scrollbar {
                  width: 6px;
                }
                #${scrollId}::-webkit-scrollbar-track {
                  background: #f1f1f1;
                  border-radius: 4px;
                }
                #${scrollId}::-webkit-scrollbar-thumb {
                  background: #888;
                  border-radius: 4px;
                }
                #${scrollId}::-webkit-scrollbar-thumb:hover {
                  background: #555;
                }
              `}
            </style>
            <Box
              bg="white"
              p={3}
              borderRadius="md"
              boxShadow="lg"
              borderWidth="1px"
              borderColor="gray.200"
              minW="250px"
              maxW="350px"
              position="relative"
              zIndex={1000}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseMove={(e) => e.stopPropagation()}
              onWheel={(e) => {
                e.stopPropagation();
                const target = e.currentTarget.querySelector(`#${scrollId}`) as HTMLElement;
                if (target) {
                  target.scrollTop += e.deltaY;
                }
              }}
            >
              <Text fontSize="sm" fontWeight="bold" mb={2}>
                {label}
              </Text>
              {hasMoreRules && (
                <Text fontSize="xs" color="gray.500" mb={2}>
                  Showing {visiblePayload.length} rules (scroll to see all)
                </Text>
              )}
              <Box
                id={scrollId}
                maxH="400px"
                overflowY="auto"
                overflowX="hidden"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#888 #f1f1f1',
                  pointerEvents: 'auto',
                }}
                onWheel={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  const target = e.currentTarget;
                  target.scrollTop += e.deltaY;
                }}
              >
                <VStack align="stretch" gap={1.5}>
                  {visiblePayload.map((item: any, index: number) => {
                    const ruleId = item.dataKey;
                    const percentage = calculatePercentage(item.value, total);
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
                </VStack>
              </Box>
              <Box pt={1} borderTopWidth="1px" borderColor="gray.200" mt={1}>
                <HStack justify="space-between">
                  <Text fontSize="xs" fontWeight="bold" color="gray.700">Total:</Text>
                  <Text fontSize="xs" fontWeight="bold">{total.toLocaleString()}</Text>
                </HStack>
              </Box>
            </Box>
          </>
        );
      }
      
      // Regular tooltip for stacked area and other chart types
      const visiblePayload = payload.filter((item: any) => visibleRules.has(item.dataKey));
      const total = visiblePayload.reduce((sum: number, item: any) => sum + (item.value || 0), 0);
      const dataItem = payload[0]?.payload;
      
      // Show all rules, with scroll if more than 10
      const hasMoreRules = visiblePayload.length > 10;
      const scrollId = `tooltip-scroll-${Math.random().toString(36).substr(2, 9)}`;
      
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
        <>
          <style>
            {`
              #${scrollId}::-webkit-scrollbar {
                width: 6px;
              }
              #${scrollId}::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 4px;
              }
              #${scrollId}::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 4px;
              }
              #${scrollId}::-webkit-scrollbar-thumb:hover {
                background: #555;
              }
            `}
          </style>
          <Box
            bg="white"
            p={3}
            borderRadius="md"
            boxShadow="lg"
            borderWidth="1px"
            borderColor="gray.200"
            minW="250px"
            maxW="350px"
            position="relative"
            zIndex={1000}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseMove={(e) => e.stopPropagation()}
            onWheel={(e) => {
              e.stopPropagation();
              const target = e.currentTarget.querySelector(`#${scrollId}`) as HTMLElement;
              if (target) {
                target.scrollTop += e.deltaY;
              }
            }}
          >
            <Text fontSize="sm" fontWeight="bold" mb={2}>
              {tooltipHeader}
            </Text>
            {hasMoreRules && (
              <Text fontSize="xs" color="gray.500" mb={2}>
                Showing {visiblePayload.length} rules (scroll to see all)
              </Text>
            )}
            <Box
              id={scrollId}
              maxH="400px"
              overflowY="auto"
              overflowX="hidden"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#888 #f1f1f1',
                pointerEvents: 'auto',
              }}
              onWheel={(e) => {
                e.stopPropagation();
                e.preventDefault();
                const target = e.currentTarget;
                target.scrollTop += e.deltaY;
              }}
            >
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
              </VStack>
            </Box>
            <Box pt={1} borderTopWidth="1px" borderColor="gray.200" mt={1}>
              <HStack justify="space-between">
                <Text fontSize="xs" fontWeight="bold" color="gray.700">Total:</Text>
                <Text fontSize="xs" fontWeight="bold">{total.toLocaleString()}</Text>
              </HStack>
            </Box>
          </Box>
        </>
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
            {/* Density filter removed - no longer needed */}
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
                  {trendingRules.map((ruleId) => {
                    const isTop5 = top5Rules.includes(ruleId);
                    const opacity = getRuleOpacity(ruleId, isTop5);
                    const color = getRuleColor(ruleId, isTop5);
                    
                    return (
                      <Line
                        key={ruleId}
                        type="monotone"
                        dataKey={ruleId}
                        name={RULE_DESCRIPTIONS[ruleId] || ruleId}
                        stroke={color}
                        strokeWidth={getStrokeWidth(ruleId, isTop5)}
                        strokeOpacity={opacity}
                        dot={{ fill: color, r: 3, opacity }}
                        activeDot={{ r: 5 }}
                        animationDuration={300}
                      />
                    );
                  })}
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
                
                // Fixed cell sizing (density filter removed)
                const multiplier = { width: 1.0, height: 1.0 };
                
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
                                    const isSelected = selectedCell?.ruleId === ruleId && selectedCell?.dateIndex === dateIndex;
                                    
                                    const handleCellClick = () => {
                                      // Update selected cell (this will update drawer if already open)
                                      const newSelectedCell = {
                                        ruleId,
                                        date: item.date,
                                        dateIndex,
                                        value,
                                        percentage,
                                        maxValue,
                                        bgColor,
                                      };
                                      setSelectedCell(newSelectedCell);
                                      // Open drawer if not already open, otherwise it will update automatically
                                      if (!isDrawerOpen) {
                                        setIsDrawerOpen(true);
                                      }
                                    };
                                    
                                    return (
                                      <Tooltip.Root key={dateIndex}>
                                        <Tooltip.Trigger asChild>
                                          <Box
                                            flex="1"
                                            minW="0"
                                            h={`${cellHeight}px`}
                                            bg={bgColor}
                                            borderWidth={isSelected ? "3px" : "1px"}
                                            borderColor={isSelected ? "blue.500" : "gray.200"}
                                            borderRadius="sm"
                                            cursor="pointer"
                                            _hover={{ borderColor: isSelected ? 'blue.600' : 'gray.400', borderWidth: isSelected ? '3px' : '2px' }}
                                            transition="all 0.18s ease-in-out"
                                            onClick={handleCellClick}
                                            boxShadow={isSelected ? "0 0 0 2px rgba(59, 130, 246, 0.2)" : "none"}
                                            opacity={isSelected ? 1 : 1}
                                            transform={isSelected ? "scale(1.02)" : "scale(1)"}
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
                                                <Text fontSize="xs" color="gray.400" mt={1}>Click for details</Text>
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

      {/* Heatmap Cell Detail Drawer */}
      {effectiveChartType === 'heatmap' && (
        <>
          <HeatmapCellDrawerWrapper
            isOpen={isDrawerOpen}
            onClose={() => {
              setIsDrawerOpen(false);
              // Keep selectedCell for highlight, clear after animation
              setTimeout(() => setSelectedCell(null), 180);
            }}
            selectedCell={selectedCell}
            paymentStage={paymentStage}
          />
        </>
      )}
    </Box>
  );
}

// Mock transaction data generator with full fields
function generateMockTransactions(count: number, date: string, ruleId: string): MerchantTransaction[] {
  const processors = ['TSYS', 'FSP'];
  const sources = ['Talus Pay', 'Global365', 'SIT', 'SC Flow'];
  const exceptions = ['High Amount', 'Rapid Volume', 'Unusual Pattern', 'Foreign Card', 'None'];
  const dbaNames = ['Acme Corp', 'Tech Solutions Inc', 'Global Retail', 'Digital Services', 'Commerce Hub', 'Trade Partners', 'Business Solutions'];
  
  const baseDate = new Date(date);
  
  return Array.from({ length: count }, (_, i) => {
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);
    const txDate = new Date(baseDate);
    txDate.setHours(randomHours, randomMinutes, 0, 0);
    
    return {
      id: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      merchant: dbaNames[Math.floor(Math.random() * dbaNames.length)],
      dbaName: dbaNames[Math.floor(Math.random() * dbaNames.length)],
      amount: `$${(Math.random() * 10000 + 100).toFixed(2)}`,
      processor: processors[Math.floor(Math.random() * processors.length)],
      mid: `MID-${Math.floor(Math.random() * 10000)}`,
      exception: exceptions[Math.floor(Math.random() * exceptions.length)],
      date: txDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      createdAt: txDate.toISOString(),
      status: 'Unreviewed' as const,
      source: sources[Math.floor(Math.random() * sources.length)],
      ahRuleApplied: [ruleId],
    };
  });
}

// Heatmap Cell Detail Drawer Component
interface HeatmapCellDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCell: SelectedCell | null;
  paymentStage: PaymentStage;
  onTransactionClick?: (tx: MerchantTransaction) => void;
}

function HeatmapCellDrawer({ isOpen, onClose, selectedCell, paymentStage, onTransactionClick }: HeatmapCellDrawerProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(25);
  const [selectedTransaction, setSelectedTransaction] = React.useState<MerchantTransaction | null>(null);
  const bodyRef = React.useRef<HTMLDivElement>(null);
  
  // Expose selectedTransaction to parent via callback
  React.useEffect(() => {
    if (selectedTransaction && onTransactionClick) {
      onTransactionClick(selectedTransaction);
      setSelectedTransaction(null); // Reset after callback
    }
  }, [selectedTransaction, onTransactionClick]);

  // Regenerate all transactions when selectedCell changes
  const allTransactions = React.useMemo(() => 
    selectedCell && selectedCell.value > 0 
      ? generateMockTransactions(selectedCell.value, selectedCell.date, selectedCell.ruleId)
      : []
  , [selectedCell?.ruleId, selectedCell?.dateIndex, selectedCell?.value, selectedCell?.date]);

  // Calculate pagination
  const totalPages = Math.ceil(allTransactions.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTransactions = allTransactions.slice(startIndex, endIndex);

  // Reset to page 1 when cell changes
  React.useEffect(() => {
    setCurrentPage(1);
    // Scroll to top when drawer opens or cell changes
    if (isOpen && bodyRef.current) {
      setTimeout(() => {
        bodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [selectedCell?.ruleId, selectedCell?.dateIndex, isOpen]);

  // Calculate trend vs previous day (mock)
  const previousDayValue = selectedCell ? Math.floor(selectedCell.value * (0.7 + Math.random() * 0.6)) : 0;
  const trend = selectedCell 
    ? selectedCell.value > previousDayValue 
      ? 'up' 
      : selectedCell.value < previousDayValue 
        ? 'down' 
        : 'neutral'
    : 'neutral';
  const trendPercentage = selectedCell && previousDayValue > 0
    ? Math.abs(((selectedCell.value - previousDayValue) / previousDayValue) * 100).toFixed(1)
    : '0';

  // Handle ESC key
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!selectedCell) return null;

  const stages = RULE_STAGE_MAP[selectedCell.ruleId] || [];
  const hasTransactions = allTransactions.length > 0;

  return (
    <Drawer.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="end" size="md">
      <Portal>
        <Drawer.Backdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <Drawer.Positioner>
          <Drawer.Content
            width={{ base: 'full', md: '45%', lg: '45%' }}
            maxW={{ base: 'full', md: '800px' }}
            height="full"
            display="flex"
            flexDirection="column"
            bg="white"
            boxShadow="xl"
            borderRadius="none"
            transition="transform 0.18s ease-in-out"
          >
            {/* Compact Summary Header */}
            <Drawer.Header
              position="sticky"
              top={0}
              zIndex={10}
              bg="white"
              borderBottomWidth="1px"
              borderBottomColor="gray.200"
              pb={3}
              pt={4}
            >
              <HStack justify="space-between" align="start" mb={2}>
                <VStack align="start" gap={0.5} flex={1}>
                  <HStack gap={2} align="center" flexWrap="wrap">
                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                      {selectedCell.date}
                    </Text>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                      {RULE_DESCRIPTIONS[selectedCell.ruleId] || selectedCell.ruleId}
                    </Text>
                    <Badge colorPalette="blue" variant="subtle" fontSize="xs">
                      {selectedCell.ruleId}
                    </Badge>
                    <Text fontSize="xs" color="gray.500">
                      {stages.join(', ') || paymentStage}
                    </Text>
                  </HStack>
                  <SimpleGrid columns={4} gap={3} w="full" mt={2}>
                    <VStack align="start" gap={0}>
                      <Text fontSize="xs" color="gray.500">Total</Text>
                      <Text fontSize="sm" fontWeight="bold">{selectedCell.value.toLocaleString()}</Text>
                    </VStack>
                    <VStack align="start" gap={0}>
                      <Text fontSize="xs" color="gray.500">Share</Text>
                      <Text fontSize="sm" fontWeight="bold">{selectedCell.percentage.toFixed(1)}%</Text>
                    </VStack>
                    <VStack align="start" gap={0}>
                      <Text fontSize="xs" color="gray.500">Trend</Text>
                      <HStack gap={1} align="center">
                        {trend === 'up' && <TrendingUp size={12} color="#10b981" />}
                        {trend === 'down' && <TrendingDown size={12} color="#ef4444" />}
                        {trend === 'neutral' && <Minus size={12} color="#6b7280" />}
                        <Text fontSize="xs" fontWeight="semibold" color={trend === 'up' ? 'green.600' : trend === 'down' ? 'red.600' : 'gray.600'}>
                          {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}{trendPercentage}%
                        </Text>
                      </HStack>
                    </VStack>
                    <VStack align="start" gap={0}>
                      <Text fontSize="xs" color="gray.500">Intensity</Text>
                      <HStack gap={1} align="center">
                        <Box
                          w="24px"
                          h="12px"
                          bg={selectedCell.bgColor}
                          borderWidth="1px"
                          borderColor="gray.300"
                          borderRadius="sm"
                        />
                        <Text fontSize="xs" color="gray.600">
                          {((selectedCell.value / selectedCell.maxValue) * 100).toFixed(0)}%
                        </Text>
                      </HStack>
                    </VStack>
                  </SimpleGrid>
                </VStack>
                <CloseButton onClick={onClose} aria-label="Close drawer" size="sm" />
              </HStack>
            </Drawer.Header>

            {/* Body with Full Transaction Table */}
            <Drawer.Body ref={bodyRef} overflowY="auto" flex={1} p={0}>
              {hasTransactions ? (
                <Box width="100%" height="100%" display="flex" flexDirection="column">
                  {/* Table Container */}
                  <Box flex={1} overflowY="auto" width="100%">
                    <Table.Root size="sm" variant="plain">
                      <Table.Header position="sticky" top={0} zIndex={5} bg="white" borderBottomWidth="1px" borderBottomColor="gray.200">
                        <Table.Row>
                          <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600" py={2} px={4}>
                            Transaction ID
                          </Table.ColumnHeader>
                          <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600" py={2} px={4}>
                            Merchant DBA
                          </Table.ColumnHeader>
                          <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600" py={2} px={4}>
                            MID
                          </Table.ColumnHeader>
                          <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600" py={2} px={4} textAlign="right">
                            Amount
                          </Table.ColumnHeader>
                          <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600" py={2} px={4}>
                            Timestamp
                          </Table.ColumnHeader>
                          <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600" py={2} px={4}>
                            Processor
                          </Table.ColumnHeader>
                          <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600" py={2} px={4}>
                            Source
                          </Table.ColumnHeader>
                          <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600" py={2} px={4}>
                            Exception
                          </Table.ColumnHeader>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {paginatedTransactions.map((tx, index) => (
                          <Table.Row
                            key={tx.id}
                            cursor="pointer"
                            _hover={{ bg: 'gray.50' }}
                            bg={index % 2 === 0 ? 'white' : 'gray.50'}
                            onClick={() => setSelectedTransaction(tx)}
                          >
                            <Table.Cell py={2} px={4}>
                              <Text fontSize="xs" fontFamily="mono" color="gray.700">
                                {tx.id.substring(0, 12)}...
                              </Text>
                            </Table.Cell>
                            <Table.Cell py={2} px={4}>
                              <Text fontSize="xs" fontWeight="medium" color="gray.900">
                                {tx.dbaName || tx.merchant}
                              </Text>
                            </Table.Cell>
                            <Table.Cell py={2} px={4}>
                              <Text fontSize="xs" color="gray.600">
                                {tx.mid}
                              </Text>
                            </Table.Cell>
                            <Table.Cell py={2} px={4} textAlign="right">
                              <Text fontSize="xs" fontWeight="semibold" color="gray.900">
                                {tx.amount}
                              </Text>
                            </Table.Cell>
                            <Table.Cell py={2} px={4}>
                              <Text fontSize="xs" color="gray.600">
                                {tx.date}
                              </Text>
                            </Table.Cell>
                            <Table.Cell py={2} px={4}>
                              <Badge colorPalette="blue" variant="subtle" fontSize="xs">
                                {tx.processor}
                              </Badge>
                            </Table.Cell>
                            <Table.Cell py={2} px={4}>
                              <Text fontSize="xs" color="gray.600">
                                {tx.source || '—'}
                              </Text>
                            </Table.Cell>
                            <Table.Cell py={2} px={4}>
                              {tx.exception && tx.exception !== 'None' ? (
                                <Badge colorPalette="orange" variant="subtle" fontSize="xs">
                                  {tx.exception}
                                </Badge>
                              ) : (
                                <Text fontSize="xs" color="gray.400">
                                  —
                                </Text>
                              )}
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Root>
                  </Box>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <Box
                      position="sticky"
                      bottom={0}
                      bg="white"
                      borderTopWidth="1px"
                      borderTopColor="gray.200"
                      p={3}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      flexWrap="wrap"
                      gap={3}
                    >
                      <HStack gap={2} align="center">
                        <Text fontSize="xs" color="gray.600">
                          Showing {startIndex + 1}-{Math.min(endIndex, allTransactions.length)} of {allTransactions.length}
                        </Text>
                        <Select.Root
                          value={[pageSize.toString()]}
                          onValueChange={(e) => {
                            setPageSize(Number(e.value[0]));
                            setCurrentPage(1);
                          }}
                          size="xs"
                          collection={createListCollection({
                            items: [
                              { label: '20 per page', value: '20' },
                              { label: '25 per page', value: '25' },
                              { label: '50 per page', value: '50' },
                            ],
                          })}
                        >
                          <Select.HiddenSelect />
                          <Select.Control>
                            <Select.Trigger>
                              <Select.ValueText />
                            </Select.Trigger>
                          </Select.Control>
                          <Portal>
                            <Select.Positioner>
                              <Select.Content>
                                {[20, 25, 50].map((size) => (
                                  <Select.Item key={size} item={{ label: `${size} per page`, value: size.toString() }}>
                                    {size} per page
                                  </Select.Item>
                                ))}
                              </Select.Content>
                            </Select.Positioner>
                          </Portal>
                        </Select.Root>
                      </HStack>
                      <HStack gap={2}>
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        <Text fontSize="xs" color="gray.600" minW="80px" textAlign="center">
                          Page {currentPage} of {totalPages}
                        </Text>
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </HStack>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box
                  p={12}
                  bg="gray.50"
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="gray.200"
                  textAlign="center"
                  m={6}
                >
                  <VStack gap={3}>
                    <Box color="gray.400">
                      <FileText size={48} />
                    </Box>
                    <VStack gap={1}>
                      <Text fontSize="sm" color="gray.500" fontWeight="medium">
                        No transactions found
                      </Text>
                      <Text fontSize="xs" color="gray.400">
                        No transactions found for this date and rule.
                      </Text>
                    </VStack>
                  </VStack>
                </Box>
              )}
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}

// Wrapper component that manages both the heatmap drawer and transaction batch drawer
function HeatmapCellDrawerWrapper(props: Omit<HeatmapCellDrawerProps, 'onTransactionClick'>) {
  const [selectedTransaction, setSelectedTransaction] = React.useState<MerchantTransaction | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  
  React.useEffect(() => {
    if (selectedTransaction && triggerRef.current) {
      // Small delay to ensure the button is rendered
      setTimeout(() => {
        triggerRef.current?.click();
        setSelectedTransaction(null); // Reset after opening
      }, 100);
    }
  }, [selectedTransaction]);
  
  return (
    <>
      <HeatmapCellDrawer
        {...props}
        onTransactionClick={setSelectedTransaction}
      />
      {selectedTransaction && (
        <Box position="absolute" left="-9999px" opacity={0} pointerEvents="none" aria-hidden="true">
          <BatchDrawer
            batch={[selectedTransaction]}
            trigger={
              <Button
                ref={triggerRef}
                aria-hidden="true"
              >
                Open Transaction
              </Button>
            }
          />
        </Box>
      )}
    </>
  );
}

