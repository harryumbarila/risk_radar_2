'use client';
import React from 'react';
import { Box, VStack, Text, HStack } from '@chakra-ui/react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { MockAlert } from '../../utils/mockData';
import EmptyState from '../empty-state/empty-state';

interface TrendChartProps {
  alerts: MockAlert[];
  onWeekClick?: (week: number) => void;
}

export default function TrendChart({ alerts, onWeekClick }: TrendChartProps) {
  // Group alerts by week and risk level
  const weekData = React.useMemo(() => {
    const weeks = new Map<number, { high: number; medium: number; low: number }>();
    
    alerts.forEach((alert) => {
      const date = new Date(alert.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
      const weekNum = Math.floor((Date.now() - weekStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
      
      if (!weeks.has(weekNum)) {
        weeks.set(weekNum, { high: 0, medium: 0, low: 0 });
      }
      const week = weeks.get(weekNum)!;
      week[alert.risk]++;
    });

    return Array.from(weeks.entries())
      .map(([week, data]) => ({
        week: `Week ${week}`,
        weekNum: week,
        High: data.high,
        Medium: data.medium,
        Low: data.low,
        Total: data.high + data.medium + data.low,
      }))
      .sort((a, b) => a.weekNum - b.weekNum)
      .slice(-12); // Last 12 weeks
  }, [alerts]);

  if (weekData.length === 0) {
    return <EmptyState title="No trend data available" />;
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
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
            {label}
          </Text>
          <VStack align="stretch" gap={1}>
            <HStack justify="space-between" gap={4}>
              <Text fontSize="xs" color="red.600">High:</Text>
              <Text fontSize="xs" fontWeight="semibold">{data.High}</Text>
            </HStack>
            <HStack justify="space-between" gap={4}>
              <Text fontSize="xs" color="orange.600">Medium:</Text>
              <Text fontSize="xs" fontWeight="semibold">{data.Medium}</Text>
            </HStack>
            <HStack justify="space-between" gap={4}>
              <Text fontSize="xs" color="green.600">Low:</Text>
              <Text fontSize="xs" fontWeight="semibold">{data.Low}</Text>
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
      aria-label="Weekly Risk Trend Chart"
    >
      <VStack align="stretch" gap={4}>
        <Text fontSize="lg" fontWeight="bold">
          Weekly Risk Trend
        </Text>
        <Box height="300px" width="100%">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={weekData}
              onClick={(data: any) => {
                if (data && 'activePayload' in data && data.activePayload && onWeekClick) {
                  const weekNum = data.activePayload[0]?.payload?.weekNum;
                  if (weekNum !== undefined) {
                    onWeekClick(weekNum);
                  }
                }
              }}
              style={{ cursor: onWeekClick ? 'pointer' : 'default' }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {/* Order: Low (bottom), Medium (middle), High (top) */}
              <Area
                type="monotone"
                dataKey="Low"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
                animationDuration={300}
                animationEasing="ease-out"
              />
              <Area
                type="monotone"
                dataKey="Medium"
                stackId="1"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.6}
                animationDuration={300}
                animationEasing="ease-out"
              />
              <Area
                type="monotone"
                dataKey="High"
                stackId="1"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.6}
                animationDuration={300}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </VStack>
    </Box>
  );
}

