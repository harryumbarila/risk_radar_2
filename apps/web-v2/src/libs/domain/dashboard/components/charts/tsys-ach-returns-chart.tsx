'use client';
import React from 'react';
import { Box, VStack, Text, HStack, Tooltip, Portal } from '@chakra-ui/react';
import { Info } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { generateRuleParticipationData, RULE_IDS, RULE_COLORS, RULE_DESCRIPTIONS, calculatePercentage } from './chart-utils';

export default function TSYSACHReturnsChart() {
  const data = React.useMemo(() => generateRuleParticipationData(14, 800), []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, item: any) => sum + (item.value || 0), 0);
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
            {payload.map((item: any, index: number) => {
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

  return (
    <Box 
      bg="white" 
      p={6} 
      borderRadius="xl" 
      boxShadow="0 2px 8px rgba(0,0,0,0.05)"
      borderWidth="1px"
      borderColor="gray.200"
      role="region"
      aria-label="TSYS ACH Returns Chart"
    >
      <VStack align="stretch" gap={3}>
        <HStack justify="space-between" align="flex-start">
          <VStack align="start" gap={1}>
            <HStack gap={2} align="center">
              <Text fontSize="lg" fontWeight="bold">
                TSYS ACH Returns
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
                      Distribution of rule participation over time for TSYS ACH return transactions.
                    </Tooltip.Content>
                  </Tooltip.Positioner>
                </Portal>
              </Tooltip.Root>
            </HStack>
            <Text fontSize="sm" color="gray.600">
              Distribution of rule participation over time
            </Text>
          </VStack>
        </HStack>
        <Box height="300px" width="100%">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
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
                iconType="square"
                iconSize={12}
                align="right"
                verticalAlign="top"
                content={({ payload }) => (
                  <Box display="flex" flexWrap="wrap" gap={2} justifyContent="flex-end" px={2}>
                    {payload?.map((entry, index) => (
                      <HStack key={index} gap={1.5}>
                        <Box
                          w="12px"
                          h="12px"
                          borderRadius="sm"
                          bg={entry.color}
                          borderWidth="1px"
                          borderColor="gray.300"
                        />
                        <Text fontSize="xs" color="gray.600">
                          {RULE_DESCRIPTIONS[entry.value as string] || entry.value}
                        </Text>
                      </HStack>
                    ))}
                  </Box>
                )}
              />
              {RULE_IDS.map((ruleId) => (
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
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </VStack>
    </Box>
  );
}
