'use client';
import React from 'react';
import { Box, VStack, Text } from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import type { MockAlert, Source } from '../../utils/mockData';
import EmptyState from '../empty-state/empty-state';

interface SourceDistributionChartProps {
  alerts: MockAlert[];
  onSourceClick?: (source: Source) => void;
}

const sourceColors: Record<Source, string> = {
  TSYS: '#3b82f6',
  Fluidpay: '#10b981',
  Paya: '#f59e0b',
  Other: '#6b7280',
};

export default function SourceDistributionChart({
  alerts,
  onSourceClick,
}: SourceDistributionChartProps) {
  const sourceData = React.useMemo(() => {
    const sources: Record<Source, number> = {
      TSYS: 0,
      Fluidpay: 0,
      Paya: 0,
      Other: 0,
    };

    alerts.forEach((alert) => {
      sources[alert.source]++;
    });

    return Object.entries(sources).map(([source, count]) => ({
      source,
      count,
      percentage: alerts.length > 0 ? ((count / alerts.length) * 100).toFixed(1) : 0,
    }));
  }, [alerts]);

  if (alerts.length === 0) {
    return <EmptyState title="No distribution data available" />;
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
      aria-label="Distribution by Source/Processor Chart"
    >
      <VStack align="stretch" gap={4}>
        <Text fontSize="lg" fontWeight="bold">
          Distribution by Source/Processor
        </Text>
        <Box height="300px" width="100%">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sourceData}
              onClick={(data: any) => {
                if (data && 'activePayload' in data && data.activePayload && onSourceClick) {
                  const source = data.activePayload[0]?.payload?.source as Source;
                  if (source) {
                    onSourceClick(source);
                  }
                }
              }}
              style={{ cursor: onSourceClick ? 'pointer' : 'default' }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="source" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number, name: string, props: any) => [
                  `${value} (${props.payload.percentage}%)`,
                  'Alerts',
                ]}
              />
              <Bar
                dataKey="count"
                radius={[4, 4, 0, 0]}
                isAnimationActive={true}
                animationDuration={400}
                animationEasing="ease-out"
              >
                {sourceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={sourceColors[entry.source as Source]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </VStack>
    </Box>
  );
}

