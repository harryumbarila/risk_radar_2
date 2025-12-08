'use client';
import React from 'react';
import { Box, HStack, VStack, Text } from '@chakra-ui/react';
import { UserCog } from 'lucide-react';

export default function ManagerQueueHeader() {
  const lastUpdated = React.useMemo(() => {
    return new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  return (
    <Box
      bg="white"
      p={6}
      borderRadius="xl"
      boxShadow="0 2px 8px rgba(0,0,0,0.05)"
      borderWidth="1px"
      borderColor="gray.200"
    >
      <HStack justify="space-between" align="start" flexWrap="wrap" gap={4}>
        <HStack gap={3} align="center">
          <Box color="blue.500">
            <UserCog size={28} />
          </Box>
          <VStack align="start" gap={0}>
            <Text fontSize="2xl" fontWeight="bold" color="gray.900">
              Manager Queue
            </Text>
            <Text fontSize="sm" color="gray.600">
              Overview of analyst workload, escalations, and pending decisions
            </Text>
          </VStack>
        </HStack>
        <VStack align="end" gap={0}>
          <Text fontSize="xs" color="gray.500" textTransform="uppercase">
            Last Updated
          </Text>
          <Text fontSize="sm" fontWeight="semibold" color="gray.700">
            {lastUpdated}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
}

