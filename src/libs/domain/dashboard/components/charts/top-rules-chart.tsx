'use client';
import React from 'react';
import { Box, VStack, Text, HStack } from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { MockAlert } from '../../utils/mockData';
import { getRuleName } from '../../utils/ruleNames';
import EmptyState from '../empty-state/empty-state';

interface TopRulesChartProps {
  alerts: MockAlert[];
  onRuleClick?: (ruleId: string) => void;
}

export default function TopRulesChart({ alerts, onRuleClick }: TopRulesChartProps) {
  const ruleData = React.useMemo(() => {
    const ruleCounts = new Map<string, number>();
    alerts.forEach((alert) => {
      ruleCounts.set(alert.ruleId, (ruleCounts.get(alert.ruleId) || 0) + 1);
    });

    return Array.from(ruleCounts.entries())
      .map(([ruleId, count]) => ({ 
        ruleId, 
        count,
        ruleName: getRuleName(ruleId),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .reverse(); // Reverse for horizontal bar chart
  }, [alerts]);

  if (ruleData.length === 0) {
    return <EmptyState title="No rule data available" />;
  }

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
          <Text fontSize="sm" fontWeight="bold" mb={1}>
            {data.ruleName}
          </Text>
          <Text fontSize="xs" color="gray.600">
            Count: {data.count}
          </Text>
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
      aria-label="Top 10 Most Triggered Rules Chart"
    >
      <VStack align="stretch" gap={4}>
        <Text fontSize="lg" fontWeight="bold">
          Top 10 Most Triggered Rules
        </Text>
        <Box height="400px" width="100%" position="relative">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={ruleData}
              layout="vertical"
              onClick={(data) => {
                if (data && data.activePayload && onRuleClick) {
                  const ruleId = data.activePayload[0]?.payload?.ruleId;
                  if (ruleId) {
                    onRuleClick(ruleId);
                  }
                }
              }}
              style={{ cursor: onRuleClick ? 'pointer' : 'default' }}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="ruleId"
                tick={{ fontSize: 12 }}
                width={80}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                fill="url(#barGradient)"
                radius={[0, 4, 4, 0]}
                isAnimationActive={true}
                animationDuration={400}
                animationEasing="ease-out"
              >
                {ruleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Count labels at end of bars - positioned absolutely */}
          <Box position="absolute" right={4} top={0} bottom={0} width="40px" pointerEvents="none" display="flex" flexDirection="column" justifyContent="space-around" py={8}>
            {ruleData.map((entry) => (
              <Text
                key={entry.ruleId}
                fontSize="xs"
                fontWeight="semibold"
                color="gray.700"
                textAlign="right"
              >
                {entry.count}
              </Text>
            ))}
          </Box>
        </Box>
      </VStack>
    </Box>
  );
}

