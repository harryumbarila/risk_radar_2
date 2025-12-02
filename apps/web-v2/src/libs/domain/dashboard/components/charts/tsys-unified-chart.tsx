'use client';
import React from 'react';
import { Box, VStack, Text, HStack, Tooltip, Portal, Select, createListCollection, Popover, Button } from '@chakra-ui/react';
import { Info, ChevronDown } from 'lucide-react';
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
} from './chart-utils';

export type PaymentStage = 'Authorization' | 'Capture' | 'Settlement' | 'ACH Returns';
export type RuleStageParticipation = 'all' | 'auth-only' | 'multi-stage' | 'settlement-only' | 'ach-only';

interface TSYSUnifiedChartProps {
  dateRange?: FilterState;
}

// Define which rules apply to which stages
const RULE_STAGE_MAP: Record<string, PaymentStage[]> = {
  AH001: ['Authorization', 'Capture'], // Multi-stage
  AH002: ['Authorization'], // Auth-only
  AH003: ['Authorization', 'Capture', 'Settlement'], // Multi-stage
  AH004: ['Authorization', 'Capture'], // Multi-stage
  AH005: ['Authorization'], // Auth-only
  AH006: ['Settlement'], // Settlement-only
  AH007: ['ACH Returns'], // ACH-only
};

const PAYMENT_STAGE_BASE_COUNTS: Record<PaymentStage, number> = {
  'Authorization': 1200,
  'Capture': 1000,
  'Settlement': 1500,
  'ACH Returns': 800,
};

export default function TSYSUnifiedChart({ dateRange }: TSYSUnifiedChartProps) {
  const [paymentStage, setPaymentStage] = React.useState<PaymentStage>('Authorization');
  const [ruleStageParticipation, setRuleStageParticipation] = React.useState<RuleStageParticipation>('all');
  const [visibleRules, setVisibleRules] = React.useState<Set<string>>(new Set(RULE_IDS));
  
  const days = React.useMemo(() => dateRange ? getDaysFromDateRange(dateRange) : 14, [dateRange]);
  const dateGrouping = React.useMemo(() => getDateGrouping(days), [days]);
  const smoothingWindow = React.useMemo(() => getSmoothingWindow(days), [days]);
  
  // Determine which rules to show based on Rule Stage Participation filter
  const filteredRuleIds = React.useMemo(() => {
    if (ruleStageParticipation === 'all') return RULE_IDS;
    
    return RULE_IDS.filter((ruleId) => {
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
  }, [ruleStageParticipation]);

  // Update visible rules when filter changes
  React.useEffect(() => {
    setVisibleRules(new Set(filteredRuleIds));
  }, [filteredRuleIds]);

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

  const toggleRule = (ruleId: string) => {
    setVisibleRules((prev) => {
      const next = new Set(prev);
      if (next.has(ruleId)) {
        next.delete(ruleId);
      } else {
        next.add(ruleId);
      }
      return next;
    });
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
          minW="200px"
        >
          <Text fontSize="sm" fontWeight="bold" mb={2}>
            {tooltipHeader}
          </Text>
          <VStack align="stretch" gap={1.5}>
            {visiblePayload.map((item: any, index: number) => {
              const percentage = calculatePercentage(item.value, total);
              return (
                <HStack key={index} justify="space-between" gap={4}>
                  <HStack gap={2}>
                    <Box
                      w="12px"
                      h="12px"
                      borderRadius="sm"
                      bg={item.color}
                      borderWidth="1px"
                      borderColor="gray.300"
                    />
                    <Text fontSize="xs" color="gray.700" fontWeight="medium">
                      {RULE_DESCRIPTIONS[item.dataKey] || item.dataKey}:
                    </Text>
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
  const useLineChart = data.length > 60; // Use line chart for very long ranges

  const paymentStageCollection = createListCollection({
    items: [
      { label: 'Authorization', value: 'Authorization' },
      { label: 'Capture', value: 'Capture' },
      { label: 'Settlement', value: 'Settlement' },
      { label: 'ACH Returns', value: 'ACH Returns' },
    ],
  });

  const ruleStageCollection = createListCollection({
    items: [
      { label: 'All rules', value: 'all' },
      { label: 'Auth-only rules', value: 'auth-only' },
      { label: 'Multi-stage rules', value: 'multi-stage' },
      { label: 'Settlement-only rules', value: 'settlement-only' },
      { label: 'ACH-only rules', value: 'ach-only' },
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
            <Text fontSize="sm" color="gray.600">
              Rule participation across payment stages over time
            </Text>
          </VStack>
          <Text fontSize="xs" color="gray.500">
            Last Updated: {new Date().toLocaleString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </HStack>

        {/* Filters */}
        <HStack gap={4} flexWrap={{ base: 'wrap', md: 'nowrap' }}>
          <Box flex={1} minW={{ base: '100%', md: '200px' }}>
            <Text fontSize="xs" fontWeight="semibold" color="gray.600" mb={1}>
              Payment Stage
            </Text>
            <Select.Root
              value={[paymentStage]}
              onValueChange={(e) => setPaymentStage(e.value[0] as PaymentStage)}
              collection={paymentStageCollection}
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
                    {paymentStageCollection.items.map((item) => (
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
          <Box flex={1} minW={{ base: '100%', md: '200px' }}>
            <Text fontSize="xs" fontWeight="semibold" color="gray.600" mb={1}>
              Rule Stage Participation
            </Text>
            <Select.Root
              value={[ruleStageParticipation]}
              onValueChange={(e) => setRuleStageParticipation(e.value[0] as RuleStageParticipation)}
              collection={ruleStageCollection}
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
                    {ruleStageCollection.items.map((item) => (
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
        </HStack>

        {/* Chart */}
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
                {filteredRuleIds.map((ruleId) => {
                  if (!visibleRules.has(ruleId)) return null;
                  return (
                    <Line
                      key={ruleId}
                      type="monotone"
                      dataKey={ruleId}
                      stroke={RULE_COLORS[ruleId]}
                      strokeWidth={2}
                      dot={{ fill: RULE_COLORS[ruleId], r: 3 }}
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
                {filteredRuleIds.map((ruleId) => {
                  if (!visibleRules.has(ruleId)) return null;
                  return (
                    <Area
                      key={ruleId}
                      type={dateGrouping === 'weekly' || dateGrouping === 'monthly' ? 'monotone' : 'linear'}
                      dataKey={ruleId}
                      stackId="rules"
                      fill={RULE_COLORS[ruleId]}
                      stroke={RULE_COLORS[ruleId]}
                      strokeWidth={1.5}
                      fillOpacity={0.6}
                      animationDuration={400}
                    />
                  );
                })}
              </AreaChart>
            )}
          </ResponsiveContainer>
        </Box>

        {/* Responsive Legend */}
        <Box>
          {/* Desktop/Tablet: Legend below chart */}
          <Box display={{ base: 'none', md: 'block' }}>
            <Box 
              display="flex" 
              flexWrap="wrap" 
              gap={2} 
              justifyContent={{ base: 'flex-start', lg: 'flex-end' }}
              px={2}
            >
              {filteredRuleIds.map((ruleId) => {
                const isVisible = visibleRules.has(ruleId);
                return (
                  <HStack
                    key={ruleId}
                    gap={1.5}
                    cursor="pointer"
                    onClick={() => toggleRule(ruleId)}
                    opacity={isVisible ? 1 : 0.4}
                    transition="opacity 0.2s"
                  >
                    <Box
                      w="12px"
                      h="12px"
                      borderRadius="sm"
                      bg={RULE_COLORS[ruleId]}
                      borderWidth="1px"
                      borderColor="gray.300"
                    />
                    <Text fontSize="xs" color="gray.600">
                      {RULE_DESCRIPTIONS[ruleId] || ruleId}
                    </Text>
                  </HStack>
                );
              })}
            </Box>
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
                  <Popover.Content maxW="300px">
                    <Popover.Arrow />
                    <VStack align="stretch" gap={2} p={3}>
                      {filteredRuleIds.map((ruleId) => {
                        const isVisible = visibleRules.has(ruleId);
                        return (
                          <HStack
                            key={ruleId}
                            gap={2}
                            cursor="pointer"
                            onClick={() => toggleRule(ruleId)}
                            opacity={isVisible ? 1 : 0.4}
                            transition="opacity 0.2s"
                          >
                            <Box
                              w="12px"
                              h="12px"
                              borderRadius="sm"
                              bg={RULE_COLORS[ruleId]}
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

