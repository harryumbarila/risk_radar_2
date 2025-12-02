'use client';
import React from 'react';
import { Box, VStack, Text, Button, HStack } from '@chakra-ui/react';
import { TrendingUp, ExternalLink, AlertCircle } from 'lucide-react';

interface NetSettlementTabProps {
  merchantId: string;
}

export default function NetSettlementTab({ merchantId }: NetSettlementTabProps) {
  const handleOpenNetSettlement = () => {
    // Open Net Settlement in a new tab
    // In a real scenario, this would be the actual URL
    const netSettlementUrl = `https://net-settlement.talus.com/merchant/${merchantId}`;
    window.open(netSettlementUrl, '_blank', 'noopener,noreferrer');
  };

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
      <VStack gap={6} align="center">
        <Box color="blue.500">
          <TrendingUp size={48} />
        </Box>
        <VStack gap={3}>
          <Text fontSize="lg" fontWeight="semibold" color="gray.900">
            Net Settlement
          </Text>
          <Box
            p={4}
            bg="yellow.50"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="yellow.200"
            maxW="500px"
          >
            <HStack gap={2} justify="center" mb={2}>
              <AlertCircle size={20} color="var(--chakra-colors-yellow-600)" />
              <Text fontSize="sm" fontWeight="semibold" color="yellow.800">
                VPN Required
              </Text>
            </HStack>
            <Text fontSize="sm" color="yellow.800" lineHeight="1.6">
              You need to be connected to the Talus VPN to access Net Settlement.
              Please ensure your VPN connection is active before proceeding.
            </Text>
          </Box>
          <Button
            colorPalette="blue"
            onClick={handleOpenNetSettlement}
            size="md"
            mt={2}
          >
            <ExternalLink size={16} />
            Open Net Settlement
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}

