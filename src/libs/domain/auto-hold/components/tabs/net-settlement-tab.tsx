'use client';
import React from 'react';
import { Box, VStack, Text } from '@chakra-ui/react';
import { TrendingUp } from 'lucide-react';

interface NetSettlementTabProps {
  merchantId: string;
}

export default function NetSettlementTab({ merchantId }: NetSettlementTabProps) {
  return (
    <Box
      p={12}
      bg="white"
      borderRadius="xl"
      boxShadow="0 2px 8px rgba(0,0,0,0.05)"
      borderWidth="1px"
      borderColor="gray.200"
      textAlign="center"
    >
      <VStack gap={4} align="center">
        <Box color="gray.400">
          <TrendingUp size={48} />
        </Box>
        <VStack gap={2}>
          <Text fontSize="lg" fontWeight="semibold" color="gray.900">
            Net Settlement
          </Text>
          <Text fontSize="sm" color="gray.600" maxW="400px">
            Coming soon... This feature will display net settlement information for the merchant.
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
}

