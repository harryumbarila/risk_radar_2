'use client';
import React from 'react';
import { Box, VStack, Text, HStack, Tooltip, Portal, Popover, Button, Select, Input, createListCollection, Checkbox } from '@chakra-ui/react';
import { Info, ChevronDown, Search } from 'lucide-react';
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
  Cell,
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

export default function TSYSUnifiedChart({ 
  dateRange, 
  paymentStage = 'Authorization',
  ruleStageParticipation = 'all',
  selectedRuleIds = []
}: TSYSUnifiedChartProps) {
  const [chartType, setChartType] = React.useState<'stacked-area' | 'heatmap'>('stacked-area');
  const [focusedRule, setFocusedRule] = React.useState<string | null>(null);
  const [legendSearch, setLegendSearch] = React.useState('');
  
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

  // Calculate top 5 rules for visual emphasis
  const top5Rules = React.useMemo(() => {
    return getTopRules(data, filteredRuleIds, 5);
  }, [data, filteredRuleIds]);

  // Display all filtered rules (controlled by FilterBar)
  const displayRules = React.useMemo(() => {
    return filteredRuleIds;
  }, [filteredRuleIds]);

  // Visible rules: all displayRules, unless focused
  const visibleRules = React.useMemo(() => {
    if (focusedRule) {
      return new Set([focusedRule]);
    }
    return new Set(displayRules);
  }, [focusedRule, displayRules]);

  // Filter rules by search
  const filteredDisplayRules = React.useMemo(() => {
    if (!legendSearch) return displayRules;
    const searchLower = legendSearch.toLowerCase();
    return displayRules.filter((ruleId) => {
      const description = RULE_DESCRIPTIONS[ruleId] || ruleId;
      return ruleId.toLowerCase().includes(searchLower) || 
             description.toLowerCase().includes(searchLower);
    });
  }, [displayRules, legendSearch]);

  // Get rule color with opacity based on focus/selection
  const getRuleColor = (ruleId: string, isTop5: boolean): string => {
    const baseColor = RULE_COLORS[ruleId] || '#94a3b8';
    
    if (focusedRule === ruleId) {
      return baseColor; // Full opacity for focused
    }
    
    if (focusedRule && focusedRule !== ruleId) {
      return baseColor; // Will be set to 15% opacity via fillOpacity
    }
    
    if (isTop5) {
      return baseColor; // Full opacity for top 5
    }
    
    // Desaturate non-top-5 rules
    return baseColor;
  };

  // Get rule opacity
  const getRuleOpacity = (ruleId: string, isTop5: boolean): number => {
    if (focusedRule === ruleId) {
      return 1.0; // Full opacity for focused
    }
    
    if (focusedRule && focusedRule !== ruleId) {
      return 0.15; // Fade others when focused
    }
    
    if (isTop5) {
      return 1.0; // Full opacity for top 5
    }
    
    // For non-top-5 rules, use 50% opacity when there are many rules (10+)
    return filteredRuleIds.length > 10 ? 0.5 : 1.0;
  };

  // Get stroke width
  const getStrokeWidth = (ruleId: string, isTop5: boolean): number => {
    if (focusedRule === ruleId) {
      return 2.5;
    }
    if (isTop5) {
      return 1.5;
    }
    // For non-top-5 rules, use thinner stroke when there are many rules (10+)
    return filteredRuleIds.length > 10 ? 1 : 1.5;
  };

  const handleRuleHover = (ruleId: string | null) => {
    setFocusedRule(ruleId);
  };

  const handleRuleClick = (ruleId: string) => {
    if (focusedRule === ruleId) {
      setFocusedRule(null);
    } else {
      setFocusedRule(ruleId);
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
              // Mock historical average (in real app, this would come from backend)
              const historicalAvg = isTop5 ? percentage * 0.9 : percentage * 1.1;
              const change = percentage - historicalAvg;
              
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
                  {focusedRule === ruleId && (
                    <Text fontSize="xs" color={change >= 0 ? 'green.600' : 'red.600'}>
                      {change >= 0 ? '+' : ''}{change.toFixed(1)}% vs historical avg
                    </Text>
                  )}
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
                value={[chartType]}
                onValueChange={(e) => setChartType(e.value[0] as 'stacked-area' | 'heatmap')}
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

        {/* Chart */}
        <Box height="400px" width="100%">
          {chartType === 'heatmap' ? (
            <Box height="100%" width="100%" overflowX="auto">
              <Box minW="600px">
                <VStack align="stretch" gap={2}>
                  {/* X-axis labels */}
                  <HStack gap={1} ml="120px">
                    {data.slice(0, Math.min(20, data.length)).map((item, index) => (
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
                      {displayRules.slice(0, 30).map((ruleId) => {
                        const isTop5 = top5Rules.includes(ruleId);
                        const isVisible = visibleRules.has(ruleId);
                        if (!isVisible) return null;
                        
                        // Calculate max value for this rule across all dates
                        const maxValue = Math.max(...data.map((item) => item[ruleId] || 0));
                        
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
                            {data.slice(0, Math.min(20, data.length)).map((item, dateIndex) => {
                              const value = item[ruleId] || 0;
                              const intensity = maxValue > 0 ? value / maxValue : 0;
                              const opacity = Math.max(0.2, Math.min(1, intensity));
                              const color = getRuleColor(ruleId, isTop5);
                              
                              // Convert color to rgba for opacity
                              const rgbMatch = color.match(/\d+/g);
                              let bgColor = color;
                              if (rgbMatch && rgbMatch.length >= 3) {
                                bgColor = `rgba(${rgbMatch[0]}, ${rgbMatch[1]}, ${rgbMatch[2]}, ${opacity})`;
                              } else if (color.startsWith('#')) {
                                // Convert hex to rgba
                                const r = parseInt(color.slice(1, 3), 16);
                                const g = parseInt(color.slice(3, 5), 16);
                                const b = parseInt(color.slice(5, 7), 16);
                                bgColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                              } else {
                                bgColor = color;
                              }
                              
                              const percentage = item.total > 0 ? calculatePercentage(value, item.total) : 0;
                              
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
                                          <Text fontSize="xs">Count: {value.toLocaleString()}</Text>
                                          <Text fontSize="xs">Participation: {percentage}%</Text>
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


        {/* Responsive Legend */}
        <Box>
          {/* Desktop/Tablet: Legend below chart */}
          <Box display={{ base: 'none', md: 'block' }}>
            <VStack align="stretch" gap={3}>
              {/* Search bar */}
              <Box position="relative">
                <Input
                  placeholder="Search rules..."
                  size="sm"
                  value={legendSearch}
                  onChange={(e) => setLegendSearch(e.target.value)}
                  pl={8}
                />
                <Box
                  position="absolute"
                  left={2}
                  top="50%"
                  transform="translateY(-50%)"
                  color="gray.400"
                >
                  <Search size={16} />
                </Box>
              </Box>
              
              {/* Scrollable legend */}
              <Box
                maxH="200px"
                overflowY="auto"
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="md"
                p={3}
              >
                <VStack align="stretch" gap={2}>
                  {filteredDisplayRules.map((ruleId) => {
                    const isTop5 = top5Rules.includes(ruleId);
                    const isVisible = visibleRules.has(ruleId);
                    const isFocused = focusedRule === ruleId;
                    const opacity = getRuleOpacity(ruleId, isTop5);
                    const color = getRuleColor(ruleId, isTop5);
                    
                    return (
                      <HStack
                        key={ruleId}
                        gap={2}
                        p={2}
                        borderRadius="md"
                        bg={isFocused ? 'blue.50' : 'transparent'}
                        borderWidth={isFocused ? '2px' : '1px'}
                        borderColor={isFocused ? 'blue.300' : 'transparent'}
                        cursor="pointer"
                        onClick={() => handleRuleClick(ruleId)}
                        onMouseEnter={() => handleRuleHover(ruleId)}
                        onMouseLeave={() => handleRuleHover(null)}
                        transition="all 0.2s"
                      >
                        <Box
                          w="16px"
                          h="16px"
                          borderRadius="sm"
                          bg={color}
                          borderWidth="1px"
                          borderColor="gray.300"
                          opacity={opacity}
                        />
                        <VStack align="start" gap={0} flex={1}>
                          <Text fontSize="xs" fontWeight={isTop5 ? 'semibold' : 'normal'} color="gray.700">
                            {RULE_DESCRIPTIONS[ruleId] || ruleId}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {ruleId}
                          </Text>
                        </VStack>
                        {isTop5 && (
                          <Text fontSize="xs" color="blue.600" fontWeight="semibold">
                            Top 5
                          </Text>
                        )}
                      </HStack>
                    );
                  })}
                </VStack>
              </Box>
            </VStack>
          </Box>

          {/* Mobile: Legend dropdown */}
          <Box display={{ base: 'block', md: 'none' }}>
            <Popover.Root positioning={{ placement: 'bottom-start' }}>
              <Popover.Trigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  width="100%"
                  justifyContent="space-between"
                >
                  <Text fontSize="sm">
                    {visibleRules.size === filteredRuleIds.length 
                      ? 'All rules visible' 
                      : `${visibleRules.size} of ${filteredRuleIds.length} rules visible`}
                  </Text>
                  <ChevronDown size={16} />
                </Button>
              </Popover.Trigger>
              <Portal>
                <Popover.Positioner>
                  <Popover.Content maxW="300px" maxH="400px">
                    <Popover.Arrow />
                    <VStack align="stretch" gap={2} p={3}>
                      <Input
                        placeholder="Search rules..."
                        size="sm"
                        value={legendSearch}
                        onChange={(e) => setLegendSearch(e.target.value)}
                      />
                      <Box overflowY="auto" maxH="300px">
                        <VStack align="stretch" gap={2}>
                          {filteredDisplayRules.map((ruleId) => {
                            const isTop5 = top5Rules.includes(ruleId);
                            const isVisible = visibleRules.has(ruleId);
                            const isFocused = focusedRule === ruleId;
                            const color = getRuleColor(ruleId, isTop5);
                            
                            return (
                              <HStack
                                key={ruleId}
                                gap={2}
                                cursor="pointer"
                                onClick={() => handleRuleClick(ruleId)}
                                onMouseEnter={() => handleRuleHover(ruleId)}
                                onMouseLeave={() => handleRuleHover(null)}
                                p={1}
                                borderRadius="sm"
                                bg={isFocused ? 'blue.50' : 'transparent'}
                              >
                                <Box
                                  w="12px"
                                  h="12px"
                                  borderRadius="sm"
                                  bg={color}
                                  borderWidth="1px"
                                  borderColor="gray.300"
                                />
                                <Text fontSize="xs" color="gray.600">
                                  {RULE_DESCRIPTIONS[ruleId] || ruleId}
                                </Text>
                              </HStack>
                            );
                          })}
                        </VStack>
                      </Box>
                    </VStack>
                  </Popover.Content>
                </Popover.Positioner>
              </Portal>
            </Popover.Root>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
}
