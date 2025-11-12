'use client';
import React from 'react';
import { Box, VStack, Text, HStack } from '@chakra-ui/react';
import type { MockAlert } from '../../utils/mockData';
import EmptyState from '../empty-state/empty-state';

interface HeatmapChartProps {
  alerts: MockAlert[];
  onCellClick?: (day: number, hour: number) => void;
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function HeatmapChart({ alerts, onCellClick }: HeatmapChartProps) {
  const heatmapData = React.useMemo(() => {
    const data: number[][] = Array(7)
      .fill(0)
      .map(() => Array(24).fill(0));

    alerts.forEach((alert) => {
      const date = new Date(alert.date);
      const day = date.getDay();
      const hour = alert.hour;
      const dayData = data[day];
      if (dayData && hour >= 0 && hour < 24) {
        dayData[hour]++;
      }
    });

    const maxCount = Math.max(...data.flat());

    return { data, maxCount };
  }, [alerts]);

  if (alerts.length === 0) {
    return <EmptyState title="No heatmap data available" />;
  }

  const getIntensity = (count: number, max: number) => {
    if (max === 0) return 0;
    const ratio = count / max;
    // Increase contrast: use square root for better visual distinction
    return Math.min(1, Math.sqrt(ratio));
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
      aria-label="Day-Hour Alert Heatmap"
    >
      <VStack align="stretch" gap={4}>
        <Text fontSize="lg" fontWeight="bold">
          Day-Hour Alert Heatmap
        </Text>
        <Box overflowX="auto">
          <Box minW="800px">
            <HStack gap={1} mb={2}>
              <Box w="40px" />
              {Array.from({ length: 24 }, (_, i) => (
                <Box
                  key={i}
                  w="24px"
                  textAlign="center"
                  fontSize="xs"
                  color="gray.600"
                >
                  {i}
                </Box>
              ))}
            </HStack>
            {heatmapData.data.map((dayData, day) => (
              <HStack key={day} gap={1} mb={1}>
                <Box w="40px" fontSize="xs" color="gray.600" textAlign="right" pr={2}>
                  {days[day]}
                </Box>
                {dayData.map((count, hour) => {
                  const intensity = getIntensity(count, heatmapData.maxCount);
                  // Increased contrast: darker colors for better visibility
                  const opacity = Math.max(0.2, intensity);
                  const bgColor = `rgba(59, 130, 246, ${opacity})`;
                  const total = alerts.length;
                  const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;

                  return (
                    <Box
                      key={hour}
                      w="24px"
                      h="24px"
                      bg={bgColor}
                      border="1px solid"
                      borderColor={count > 0 ? 'blue.300' : 'gray.200'}
                      borderRadius="sm"
                      cursor={onCellClick ? 'pointer' : 'default'}
                      onClick={() => onCellClick?.(day, hour)}
                      _hover={{ 
                        borderColor: 'blue.500', 
                        borderWidth: '2px',
                        transform: 'scale(1.1)',
                        zIndex: 10,
                      }}
                      transition="all 0.15s ease"
                      title={`${days[day]} ${hour}:00\nAlerts: ${count}\n(${percentage}% of total)`}
                      aria-label={`${count} alerts on ${days[day]} at ${hour}:00`}
                    />
                  );
                })}
              </HStack>
            ))}
          </Box>
        </Box>
        <HStack justify="space-between" fontSize="xs" color="gray.600">
          <Text>Fewer alerts</Text>
          <HStack gap={1}>
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const intensity = Math.floor(ratio * 255);
              return (
                <Box
                  key={ratio}
                  w="16px"
                  h="16px"
                  bg={`rgba(59, 130, 246, ${ratio})`}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="sm"
                />
              );
            })}
          </HStack>
          <Text>More alerts</Text>
        </HStack>
      </VStack>
    </Box>
  );
}

