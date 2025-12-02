'use client';
import React from 'react';
import { Box, VStack, Text, HStack, Tooltip, Portal, Checkbox } from '@chakra-ui/react';
import { Info } from 'lucide-react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
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
  getChartType,
  getAggregationLevel,
  getXAxisConfig,
} from './chart-utils';

interface TSYSAuthChartProps {
  dateRange?: FilterState;
}

export default function TSYSAuthChart({ dateRange }: TSYSAuthChartProps) {
  const days = React.useMemo(() => dateRange ? getDaysFromDateRange(dateRange) : 14, [dateRange]);
  const chartType = React.useMemo(() => getChartType(days), [days]);
  const aggregation = React.useMemo(() => getAggregationLevel(days), [days]);
  const [visibleRules, setVisibleRules] = React.useState<Set<string>>(new Set(RULE_IDS));
  const [showPercent, setShowPercent] = React.useState(false);
  
  const data = React.useMemo(() => {
    const rawData = generateRuleParticipationData(days, 1200, aggregation);
    
    // If showing percentage, convert to percentages
    if (showPercent && chartType === 'area') {
      return rawData.map((item) => {
        const total = item.total;
        const percentItem: Record<string, any> = { ...item };
        RULE_IDS.forEach((ruleId) => {
          percentItem[ruleId] = calculatePercentage(item[ruleId], total);
        });
        percentItem.total = 100;
        return percentItem;
      });
    }
    
    return rawData;
  }, [days, aggregation, chartType, showPercent]);

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
          <VStack align="stretch" gap={1.5}>
            {visiblePayload.map((item: any, index: number) => {
              const percentage = showPercent && chartType === 'area' 
                ? item.value 
                : calculatePercentage(item.value, total);
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
                      {showPercent && chartType === 'area' 
                        ? `${item.value.toFixed(1)}%`
                        : item.value.toLocaleString()}
                    </Text>
                    {!showPercent && (
                      <Text fontSize="xs" color="gray.500">
                        {percentage}%
                      </Text>
                    )}
                  </VStack>
                </HStack>
              );
            })}
            {!showPercent && (
              <Box pt={1} borderTopWidth="1px" borderColor="gray.200" mt={1}>
                <HStack justify="space-between">
                  <Text fontSize="xs" fontWeight="bold" color="gray.700">Total:</Text>
                  <Text fontSize="xs" fontWeight="bold">{total.toLocaleString()}</Text>
                </HStack>
              </Box>
            )}
          </VStack>
        </Box>
      );
    }
    return null;
  };

  const xAxisConfig = getXAxisConfig(data.length);

  return (
    <Box 
      bg="white" 
      p={6} 
      borderRadius="xl" 
      boxShadow="0 2px 8px rgba(0,0,0,0.05)"
      borderWidth="1px"
      borderColor="gray.200"
      role="region"
      aria-label="TSYS Auth Data Auto Hold Chart"
    >
      <VStack align="stretch" gap={3}>
        <HStack justify="space-between" align="flex-start">
          <VStack align="start" gap={1}>
            <HStack gap={2} align="center">
              <Text fontSize="lg" fontWeight="bold">
                TSYS Auth Data (Auto Hold)
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
                      Distribution of rule participation over time for TSYS authorization data with auto hold applied.
                    </Tooltip.Content>
                  </Tooltip.Positioner>
                </Portal>
              </Tooltip.Root>
            </HStack>
            <Text fontSize="sm" color="gray.600">
              Distribution of rule participation over time
            </Text>
          </VStack>
          {chartType === 'area' && days >= 15 && days <= 60 && (
            <HStack gap={2}>
              <Checkbox.Root
                checked={showPercent}
                onCheckedChange={(e) => setShowPercent(e.checked ?? false)}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
              </Checkbox.Root>
              <Text fontSize="xs" color="gray.600">Show %</Text>
            </HStack>
          )}
        </HStack>
        <Box height="300px" width="100%">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: xAxisConfig.angle !== 0 ? 40 : 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                  angle={xAxisConfig.angle}
                  textAnchor={xAxisConfig.angle < 0 ? 'end' : 'middle'}
                  interval={xAxisConfig.interval}
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
                  iconType="square"
                  iconSize={12}
                  align="right"
                  verticalAlign="top"
                  content={({ payload }) => (
                    <Box display="flex" flexWrap="wrap" gap={2} justifyContent="flex-end" px={2}>
                      {payload?.map((entry, index) => {
                        const ruleId = entry.value as string;
                        const isVisible = visibleRules.has(ruleId);
                        return (
                          <HStack
                            key={index}
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
                              bg={entry.color}
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
                  )}
                />
                {RULE_IDS.map((ruleId) => {
                  if (!visibleRules.has(ruleId)) return null;
                  return (
                    <Bar
                      key={ruleId}
                      dataKey={ruleId}
                      stackId="rules"
                      fill={RULE_COLORS[ruleId]}
                      radius={ruleId === RULE_IDS[RULE_IDS.length - 1] ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                      stroke={RULE_COLORS[ruleId]}
                      strokeWidth={0}
                      animationDuration={400}
                    >
                      {data.map((entry, index) => (
                        <Cell 
                          key={`cell-${ruleId}-${index}`}
                          style={{ 
                            outline: 'none',
                            transition: 'opacity 0.2s',
                          }}
                        />
                      ))}
                    </Bar>
                  );
                })}
              </BarChart>
            ) : (
              <AreaChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: xAxisConfig.angle !== 0 ? 40 : 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                  angle={xAxisConfig.angle}
                  textAnchor={xAxisConfig.angle < 0 ? 'end' : 'middle'}
                  interval={xAxisConfig.interval}
                />
                <YAxis 
                  domain={showPercent ? [0, 100] : [0, 'auto']}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                  label={{ 
                    value: showPercent ? 'Percentage' : 'Count', 
                    angle: -90, 
                    position: 'insideLeft', 
                    fontSize: 11, 
                    fill: '#6b7280' 
                  }}
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="square"
                  iconSize={12}
                  align="right"
                  verticalAlign="top"
                  content={({ payload }) => (
                    <Box display="flex" flexWrap="wrap" gap={2} justifyContent="flex-end" px={2}>
                      {payload?.map((entry, index) => {
                        const ruleId = entry.value as string;
                        const isVisible = visibleRules.has(ruleId);
                        return (
                          <HStack
                            key={index}
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
                              bg={entry.color}
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
                  )}
                />
                {RULE_IDS.map((ruleId) => {
                  if (!visibleRules.has(ruleId)) return null;
                  return (
                    <Area
                      key={ruleId}
                      type={aggregation === 'weekly' || aggregation === 'monthly' ? 'monotone' : 'linear'}
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
      </VStack>
    </Box>
  );
}
