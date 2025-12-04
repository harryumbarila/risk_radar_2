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
  Cell,
  Legend,
} from 'recharts';
import EmptyState from '../empty-state/empty-state';

interface ChargebackReasonCodeChartProps {
  dateRange?: { dateRange?: string; customStartDate?: string; customEndDate?: string };
}

// Reason code definitions with categories
const REASON_CODES = [
  { code: '4855', name: 'Card Not Present', category: 'Fraud', color: '#ef4444' },
  { code: '4850', name: 'Card Absent Environment', category: 'Fraud', color: '#dc2626' },
  { code: '4853', name: 'Card Not Present Fraud', category: 'Fraud', color: '#b91c1c' },
  { code: '4859', name: 'Card Not Present - Other', category: 'Fraud', color: '#991b1b' },
  { code: '4837', name: 'No Cardholder Authorization', category: 'Customer Dispute', color: '#3b82f6' },
  { code: '4840', name: 'Fraudulent Processing', category: 'Customer Dispute', color: '#2563eb' },
  { code: '4841', name: 'Cancelled Recurring', category: 'Customer Dispute', color: '#1d4ed8' },
  { code: '4842', name: 'Late Presentment', category: 'Customer Dispute', color: '#1e40af' },
  { code: '4846', name: 'Correct Transaction Currency', category: 'Customer Dispute', color: '#1e3a8a' },
  { code: '4849', name: 'Questionable Merchant Activity', category: 'Customer Dispute', color: '#172554' },
  { code: '4854', name: 'Cardholder Disputes', category: 'Customer Dispute', color: '#0f172a' },
  { code: '4856', name: 'Credit Not Processed', category: 'Customer Dispute', color: '#60a5fa' },
  { code: '4857', name: 'Cancelled Recurring Transaction', category: 'Customer Dispute', color: '#93c5fd' },
  { code: '4860', name: 'Cardholder Does Not Recognize', category: 'Customer Dispute', color: '#bfdbfe' },
  { code: '4870', name: 'Chip Liability Shift', category: 'Processing Error', color: '#10b981' },
  { code: '4871', name: 'Chip/PIN Liability Shift', category: 'Processing Error', color: '#059669' },
  { code: '4802', name: 'Authorization-Related Chargeback', category: 'Processing Error', color: '#047857' },
  { code: '4808', name: 'Authorization Fraud', category: 'Processing Error', color: '#065f46' },
];

// Category colors
const CATEGORY_COLORS: Record<string, string> = {
  'Fraud': '#ef4444',
  'Customer Dispute': '#3b82f6',
  'Processing Error': '#10b981',
};

interface ReasonCodeData {
  code: string;
  name: string;
  category: string;
  count: number;
  percentage: string;
  color: string;
}

// Generate mock reason code data
const generateReasonCodeData = (): ReasonCodeData[] => {
  const data: ReasonCodeData[] = [];
  const totalChargebacks = 1250;
  
  // Distribute chargebacks across reason codes with some variation
  REASON_CODES.forEach((reason) => {
    const baseCount = Math.floor(totalChargebacks / REASON_CODES.length);
    const variation = Math.floor((Math.random() - 0.5) * baseCount * 0.4);
    const count = Math.max(10, baseCount + variation);
    
    data.push({
      code: reason.code,
      name: reason.name,
      category: reason.category,
      count,
      percentage: ((count / totalChargebacks) * 100).toFixed(1),
      color: reason.color,
    });
  });
  
  // Sort by count descending
  return data.sort((a, b) => b.count - a.count);
};

export default function ChargebackReasonCodeChart({ dateRange }: ChargebackReasonCodeChartProps) {
  const data: ReasonCodeData[] = React.useMemo(() => generateReasonCodeData(), []);

  // Group by category for legend
  const categoryData = React.useMemo(() => {
    const grouped: Record<string, number> = {};
    data.forEach((item) => {
      grouped[item.category] = (grouped[item.category] || 0) + item.count;
    });
    return Object.entries(grouped).map(([category, count]) => ({
      category,
      count,
      color: CATEGORY_COLORS[category],
    }));
  }, [data]);

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
          <Text fontSize="sm" fontWeight="bold" mb={1}>
            {data.code} - {data.name}
          </Text>
          <VStack align="start" gap={1} fontSize="xs">
            <HStack justify="space-between" w="full">
              <Text color="gray.600">Count:</Text>
              <Text fontWeight="semibold">{data.count.toLocaleString()}</Text>
            </HStack>
            <HStack justify="space-between" w="full">
              <Text color="gray.600">Percentage:</Text>
              <Text fontWeight="semibold">{data.percentage}%</Text>
            </HStack>
            <HStack justify="space-between" w="full">
              <Text color="gray.600">Category:</Text>
              <Text fontWeight="semibold" color={CATEGORY_COLORS[data.category]}>
                {data.category}
              </Text>
            </HStack>
          </VStack>
        </Box>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return <EmptyState title="No reason code data available" />;
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
      aria-label="Chargeback Reason Code Distribution Chart"
    >
      <VStack align="stretch" gap={4}>
        <HStack gap={2} align="center">
          <Text fontSize="lg" fontWeight="bold">
            Chargeback Reason Code Distribution
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
                  Shows chargeback distribution by reason code, ordered by frequency. Colors are grouped by category: Fraud (red), Customer Dispute (blue), and Processing Error (green).
                </Tooltip.Content>
              </Tooltip.Positioner>
            </Portal>
          </Tooltip.Root>
        </HStack>
        <Text fontSize="sm" color="gray.600">
          Distribution of chargebacks by reason code, sorted by frequency
        </Text>
        <Box height="400px" width="100%">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="code"
                tick={{ fontSize: 12 }}
                width={80}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                radius={[0, 4, 4, 0]}
                isAnimationActive={true}
                animationDuration={400}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </VStack>
    </Box>
  );
}


