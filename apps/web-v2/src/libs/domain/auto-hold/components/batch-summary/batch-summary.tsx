'use client';
import React from 'react';
import { Box, VStack, HStack, Text, SimpleGrid, Badge, Tooltip } from '@chakra-ui/react';
import { Calendar, DollarSign, Clock, Database, AlertTriangle } from 'lucide-react';

export interface BatchSummaryData {
  totalTransactions: number;
  totalAmount: string;
  timeWindow: {
    start: string;
    end: string;
  };
  cronJobSource: string;
  exceptionTypes: string[];
  exceptionCounts?: Record<string, number>;
}

interface BatchSummaryProps {
  data: BatchSummaryData;
}

export default function BatchSummary({ data }: BatchSummaryProps) {
  return (
    <Box
      bg="white"
      p={6}
      borderRadius="xl"
      boxShadow="0 2px 8px rgba(0,0,0,0.05)"
      borderWidth="1px"
      borderColor="gray.200"
    >
      <VStack align="stretch" gap={4}>
        <Text fontSize="lg" fontWeight="bold" color="gray.900">
          Batch Summary
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
          {/* Total Transactions */}
          <Box
            p={4}
            bg="gray.50"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.200"
          >
            <HStack gap={2} mb={2}>
              <Box color="blue.500">
                <Database size={20} />
              </Box>
              <Text fontSize="xs" color="gray.600" fontWeight="medium" textTransform="uppercase">
                Total Transactions
              </Text>
            </HStack>
            <Text fontSize="2xl" fontWeight="bold" color="gray.900">
              {data.totalTransactions}
            </Text>
          </Box>

          {/* Total Amount */}
          <Box
            p={4}
            bg="gray.50"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.200"
          >
            <HStack gap={2} mb={2}>
              <Box color="green.500">
                <DollarSign size={20} />
              </Box>
              <Text fontSize="xs" color="gray.600" fontWeight="medium" textTransform="uppercase">
                Total Amount
              </Text>
            </HStack>
            <Text fontSize="2xl" fontWeight="bold" color="gray.900">
              {data.totalAmount}
            </Text>
          </Box>

          {/* Time Window */}
          <Box
            p={4}
            bg="gray.50"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.200"
          >
            <HStack gap={2} mb={2}>
              <Box color="purple.500">
                <Clock size={20} />
              </Box>
              <Text fontSize="xs" color="gray.600" fontWeight="medium" textTransform="uppercase">
                Time Window
              </Text>
            </HStack>
            <VStack align="start" gap={1}>
              <Text fontSize="sm" color="gray.700">
                <Text as="span" fontWeight="semibold">Start:</Text> {data.timeWindow.start}
              </Text>
              <Text fontSize="sm" color="gray.700">
                <Text as="span" fontWeight="semibold">End:</Text> {data.timeWindow.end}
              </Text>
            </VStack>
          </Box>

          {/* Cron Job Source */}
          <Box
            p={4}
            bg="gray.50"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.200"
          >
            <HStack gap={2} mb={2}>
              <Box color="orange.500">
                <Calendar size={20} />
              </Box>
              <Text fontSize="xs" color="gray.600" fontWeight="medium" textTransform="uppercase">
                Cron Job Source
              </Text>
            </HStack>
            <Text fontSize="md" fontWeight="semibold" color="gray.900">
              {data.cronJobSource}
            </Text>
          </Box>

          {/* Exception Types */}
          <Box
            p={4}
            bg="gray.50"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.200"
            gridColumn={{ base: '1', md: '2', lg: 'span 2' }}
          >
            <HStack gap={2} mb={2}>
              <Box color="red.500">
                <AlertTriangle size={20} />
              </Box>
              <Text fontSize="xs" color="gray.600" fontWeight="medium" textTransform="uppercase">
                Exception Types
              </Text>
            </HStack>
            <HStack gap={2} flexWrap="wrap">
              {data.exceptionTypes.map((type, index) => {
                const count = data.exceptionCounts?.[type] || 1;
                return (
                  <Tooltip.Root key={index}>
                    <Tooltip.Trigger asChild>
                      <Badge
                        colorPalette="red"
                        variant="subtle"
                        px={3}
                        py={1}
                        borderRadius="md"
                        fontSize="sm"
                        cursor="help"
                      >
                        {type}
                      </Badge>
                    </Tooltip.Trigger>
                    <Tooltip.Positioner>
                      <Tooltip.Content>
                        <Tooltip.Arrow />
                        {type}: {count} occurrence{count !== 1 ? 's' : ''}
                      </Tooltip.Content>
                    </Tooltip.Positioner>
                  </Tooltip.Root>
                );
              })}
            </HStack>
          </Box>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}

