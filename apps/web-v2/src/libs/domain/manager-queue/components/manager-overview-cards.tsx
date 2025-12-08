'use client';
import React from 'react';
import {
  Box,
  SimpleGrid,
  VStack,
  HStack,
  Text,
  Badge,
} from '@chakra-ui/react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ManagerQueueItem, AnalystWorkload } from '../types';

interface ManagerOverviewCardsProps {
  queueItems: ManagerQueueItem[];
  analystWorkloads: AnalystWorkload[];
}

export default function ManagerOverviewCards({
  queueItems,
  analystWorkloads,
}: ManagerOverviewCardsProps) {
  const cards = React.useMemo(() => {
    const pendingReviews = queueItems.filter((item) => item.status === 'Pending').length;
    const escalations = queueItems.filter((item) => 
      item.reasonForReview.includes('Escalation')
    ).length;
    const unassigned = queueItems.filter((item) => !item.assignedAnalyst).length;
    
    // Find analyst with highest load
    const highestLoadAnalyst = analystWorkloads.reduce((max, analyst) => 
      analyst.assignedItems > max.assignedItems ? analyst : max,
      analystWorkloads[0] || { analyst: 'N/A', assignedItems: 0 }
    );

    // Mock trend calculations (vs previous week)
    const trends = {
      pendingReviews: { value: 12.5, direction: 'up' as 'up' | 'down' | 'neutral' },
      escalations: { value: 8.3, direction: 'down' as 'up' | 'down' | 'neutral' },
      unassigned: { value: 5.2, direction: 'up' as 'up' | 'down' | 'neutral' },
      highestLoad: { value: 15.0, direction: 'up' as 'up' | 'down' | 'neutral' },
    };

    return [
      {
        title: 'Pending Reviews',
        count: pendingReviews,
        trend: trends.pendingReviews.value,
        trendDirection: trends.pendingReviews.direction,
        color: 'blue',
      },
      {
        title: 'Escalations',
        count: escalations,
        trend: trends.escalations.value,
        trendDirection: trends.escalations.direction,
        color: 'orange',
      },
      {
        title: 'Unassigned Items',
        count: unassigned,
        trend: trends.unassigned.value,
        trendDirection: trends.unassigned.direction,
        color: 'red',
      },
      {
        title: 'Analyst With Highest Load',
        count: highestLoadAnalyst.assignedItems,
        trend: trends.highestLoad.value,
        trendDirection: trends.highestLoad.direction,
        subtitle: highestLoadAnalyst.analyst,
        color: 'purple',
      },
    ];
  }, [queueItems, analystWorkloads]);

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
      {cards.map((card, index) => (
        <Box
          key={index}
          bg="white"
          p={6}
          borderRadius="xl"
          boxShadow="0 2px 8px rgba(0,0,0,0.05)"
          borderWidth="1px"
          borderColor="gray.200"
        >
          <VStack align="start" gap={2}>
            <Text fontSize="sm" color="gray.600" fontWeight="medium">
              {card.title}
            </Text>
            <HStack gap={2} align="baseline">
              <Text fontSize="3xl" fontWeight="bold" color="gray.900">
                {card.count}
              </Text>
              <HStack gap={1} align="center">
                {card.trendDirection === 'up' && (
                  <TrendingUp size={16} color="#ef4444" />
                )}
                {card.trendDirection === 'down' && (
                  <TrendingDown size={16} color="#10b981" />
                )}
                {card.trendDirection === 'neutral' && (
                  <Minus size={16} color="#6b7280" />
                )}
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color={
                    card.trendDirection === 'up'
                      ? 'red.600'
                      : card.trendDirection === 'down'
                      ? 'green.600'
                      : 'gray.600'
                  }
                >
                  {card.trendDirection === 'up' ? '+' : ''}
                  {card.trend.toFixed(1)}%
                </Text>
              </HStack>
            </HStack>
            {card.subtitle && (
              <Text fontSize="xs" color="gray.500" mt={1}>
                {card.subtitle}
              </Text>
            )}
            <Box
              w="full"
              h="4px"
              bg={`${card.color}.100`}
              borderRadius="full"
              mt={2}
            >
              <Box
                w={`${Math.min((card.count / 50) * 100, 100)}%`}
                h="full"
                bg={`${card.color}.500`}
                borderRadius="full"
              />
            </Box>
          </VStack>
        </Box>
      ))}
    </SimpleGrid>
  );
}

