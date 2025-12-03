'use client';
import React from 'react';
import { Box, VStack, Text, HStack, Tooltip, Portal } from '@chakra-ui/react';
import { Info } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { FilterState } from '../filter-bar/filter-bar';
import EmptyState from '../empty-state/empty-state';

interface ChargebackRateChartProps {
  dateRange?: FilterState;
}

// Chargeback reason code categories
const REASON_CODE_CATEGORIES: Record<string, string> = {
  '4855': 'Fraud',
  '4850': 'Fraud',
  '4853': 'Fraud',
  '4859': 'Fraud',
  '4837': 'Customer Dispute',
  '4840': 'Customer Dispute',
  '4841': 'Customer Dispute',
  '4842': 'Customer Dispute',
  '4846': 'Customer Dispute',
  '4849': 'Customer Dispute',
  '4854': 'Customer Dispute',
  '4856': 'Customer Dispute',
  '4857': 'Customer Dispute',
  '4860': 'Customer Dispute',
  '4870': 'Processing Error',
  '4871': 'Processing Error',
  '4802': 'Processing Error',
  '4808': 'Processing Error',
};

// Generate mock chargeback data
const generateChargebackData = (days: number) => {
  const data = [];
  const today = new Date();
  const baseTransactions = 50000; // Base transaction volume
  const baseChargebackRate = 0.008; // 0.8% base rate
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Add some variation to the rate
    const variation = (Math.random() - 0.5) * 0.003; // ±0.15% variation
    const rate = Math.max(0.002, Math.min(0.015, baseChargebackRate + variation));
    
    // Calculate transactions and chargebacks
    const transactions = baseTransactions + Math.floor((Math.random() - 0.5) * 10000);
    const chargebacks = Math.floor(transactions * rate);
    
    // Generate dominant reason codes (top 3)
    const reasonCodes = Object.keys(REASON_CODE_CATEGORIES);
    const shuffled = [...reasonCodes].sort(() => Math.random() - 0.5);
    const dominantReasons = shuffled.slice(0, 3).map(code => ({
      code,
      count: Math.floor(chargebacks * (0.3 + Math.random() * 0.2)),
      category: REASON_CODE_CATEGORIES[code],
    }));
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: date.toISOString().split('T')[0],
      chargebacks,
      transactions,
      rate: rate * 100, // Convert to percentage
      dominantReasons,
    });
  }
  
  return data;
};

export default function ChargebackRateChart({ dateRange }: ChargebackRateChartProps) {
  const days = React.useMemo(() => {
    if (!dateRange) return 30;
    if (dateRange.dateRange === 'custom') {
      if (dateRange.customStartDate && dateRange.customEndDate) {
        const start = new Date(dateRange.customStartDate);
        const end = new Date(dateRange.customEndDate);
        return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      }
      return 30;
    }
    return parseInt(dateRange.dateRange) || 30;
  }, [dateRange]);

  const data = React.useMemo(() => generateChargebackData(days), [days]);

  const threshold = 1.0; // 1% threshold line

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
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
            {data.fullDate}
          </Text>
          <VStack align="start" gap={1} fontSize="xs">
            <HStack justify="space-between" w="full">
              <Text color="gray.600">Chargebacks:</Text>
              <Text fontWeight="semibold">{data.chargebacks.toLocaleString()}</Text>
            </HStack>
            <HStack justify="space-between" w="full">
              <Text color="gray.600">Total Transactions:</Text>
              <Text fontWeight="semibold">{data.transactions.toLocaleString()}</Text>
            </HStack>
            <HStack justify="space-between" w="full">
              <Text color="gray.600">Rate:</Text>
              <Text fontWeight="semibold" color={data.rate > threshold ? 'red.600' : 'gray.900'}>
                {data.rate.toFixed(2)}%
              </Text>
            </HStack>
            {data.dominantReasons && data.dominantReasons.length > 0 && (
              <Box mt={2} pt={2} borderTopWidth="1px" borderColor="gray.200" w="full">
                <Text fontSize="xs" fontWeight="semibold" color="gray.700" mb={1}>
                  Dominant Reason Codes:
                </Text>
                {data.dominantReasons.map((reason: any, idx: number) => (
                  <Text key={idx} fontSize="xs" color="gray.600">
                    • {reason.code} ({reason.category}): {reason.count}
                  </Text>
                ))}
              </Box>
            )}
          </VStack>
        </Box>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return <EmptyState title="No chargeback data available" />;
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
      aria-label="Chargeback Rate Over Time Chart"
    >
      <VStack align="stretch" gap={4}>
        <HStack gap={2} align="center">
          <Text fontSize="lg" fontWeight="bold">
            Chargeback Rate Over Time
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
                  Shows chargeback rate percentage over time. The red threshold line indicates the 1% risk level. Hover to see detailed metrics including chargeback count, total transactions, and dominant reason codes.
                </Tooltip.Content>
              </Tooltip.Positioner>
            </Portal>
          </Tooltip.Root>
        </HStack>
        <Text fontSize="sm" color="gray.600">
          Daily chargeback rate with 1% threshold indicator
        </Text>
        <Box height="350px" width="100%">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
                interval={Math.floor(data.length / 10)}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft', fontSize: 12 }}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <ReferenceLine 
                y={threshold} 
                stroke="#ef4444" 
                strokeDasharray="5 5"
                strokeWidth={2}
                label={{ value: '1% Threshold', position: 'right', fontSize: 11, fill: '#ef4444' }}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 3 }}
                activeDot={{ r: 5 }}
                isAnimationActive={true}
                animationDuration={400}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </VStack>
    </Box>
  );
}

