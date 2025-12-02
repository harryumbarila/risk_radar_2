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
  Legend,
} from 'recharts';
import type { MockAlert } from '../../utils/mockData';

interface TrendChartProps {
  alerts: MockAlert[];
  onWeekClick?: (week: number) => void;
}

// Generate mock data for daily authorization volumes and auto hold counts
const generateDailyData = () => {
  const data = [];
  const today = new Date();
  
  // Generate data for the last 14 days
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Authorization volumes: high values with fluctuations (10,000-15,500)
    const authVolume = Math.floor(Math.random() * 5500) + 10000;
    
    // Auto hold counts: consistently low (200-600)
    const autoHold = Math.floor(Math.random() * 400) + 200;
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      dateValue: date.toISOString().split('T')[0],
      authVolume,
      autoHold,
    });
  }
  
  return data;
};

export default function TrendChart({ alerts, onWeekClick }: TrendChartProps) {
  const dailyData = React.useMemo(() => generateDailyData(), []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
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
            {label}
          </Text>
          <VStack align="stretch" gap={1}>
            {payload.map((item: any, index: number) => (
              <HStack key={index} justify="space-between" gap={4}>
                <Text fontSize="xs" color={item.color}>
                  {item.name}:
                </Text>
                <Text fontSize="xs" fontWeight="semibold">
                  {item.value.toLocaleString()}
                </Text>
              </HStack>
            ))}
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
      aria-label="Daily Authorization and Auto Hold Trend Chart"
    >
      <VStack align="stretch" gap={3}>
        <HStack justify="space-between" align="flex-start">
          <VStack align="start" gap={1}>
            <HStack gap={2} align="center">
              <Text fontSize="lg" fontWeight="bold">
                Daily Authorization and Auto Hold Trend
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
                      Daily authorization volumes and auto hold counts over the last 14 days. Shows the relationship between total authorizations and auto hold transactions.
                    </Tooltip.Content>
                  </Tooltip.Positioner>
                </Portal>
              </Tooltip.Root>
            </HStack>
            <Text fontSize="sm" color="gray.600">
              Daily authorization volumes and auto hold counts
            </Text>
          </VStack>
        </HStack>
        <Box height="300px" width="100%">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
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
      </VStack>
    </Box>
  );
}
