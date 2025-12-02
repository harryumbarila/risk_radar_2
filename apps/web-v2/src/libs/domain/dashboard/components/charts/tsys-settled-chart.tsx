'use client';
import React from 'react';
import { Box, VStack, Text, HStack, Tooltip, Portal } from '@chakra-ui/react';
import { Info } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';

// Mock data for TSYS Settled Data
const generateMockSettledData = () => {
  const days = [];
  const today = new Date();
  let cumulative = 50000;
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const daily = Math.floor(Math.random() * 20000) + 30000;
    cumulative += daily;
    days.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      settled: cumulative,
      daily: daily,
    });
  }
  return days;
};

export default function TSYSSettledChart() {
  const data = React.useMemo(() => generateMockSettledData(), []);

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
        >
          <Text fontSize="sm" fontWeight="bold" mb={2}>
            {data.date}
          </Text>
          <VStack align="stretch" gap={1}>
            <HStack justify="space-between" gap={4}>
              <Text fontSize="xs" color="gray.600">Cumulative Settled:</Text>
              <Text fontSize="xs" fontWeight="semibold">${data.settled.toLocaleString()}</Text>
            </HStack>
            <HStack justify="space-between" gap={4}>
              <Text fontSize="xs" color="purple.600">Daily Settled:</Text>
              <Text fontSize="xs" fontWeight="semibold">${data.daily.toLocaleString()}</Text>
            </HStack>
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
      aria-label="TSYS Settled Data Chart"
    >
      <VStack align="stretch" gap={3}>
        <HStack justify="space-between" align="flex-start">
          <VStack align="start" gap={1}>
            <HStack gap={2} align="center">
              <Text fontSize="lg" fontWeight="bold">
                TSYS Settled Data
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
                      Cumulative settlement amounts from TSYS processor showing total settled funds over the last 14 days.
                    </Tooltip.Content>
                  </Tooltip.Positioner>
                </Portal>
              </Tooltip.Root>
            </HStack>
            <Text fontSize="sm" color="gray.600">
              Cumulative settlement trends
            </Text>
          </VStack>
        </HStack>
        <Box height="250px" width="100%">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 11, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="settled"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.3}
                strokeWidth={2}
                animationDuration={300}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </VStack>
    </Box>
  );
}

