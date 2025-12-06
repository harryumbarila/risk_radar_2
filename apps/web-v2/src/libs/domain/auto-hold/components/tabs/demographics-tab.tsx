'use client';
import React from 'react';
import { Box, VStack, Text, HStack, Badge, SimpleGrid } from '@chakra-ui/react';
import { MapPin, Building2, DollarSign, Calendar, CreditCard, TrendingUp, TrendingDown } from 'lucide-react';

interface DemographicsTabProps {
  merchantId: string;
  merchantName: string;
}

export default function DemographicsTab({ merchantId, merchantName }: DemographicsTabProps) {
  // Mock data
  const demographicsData = {
    dbaName: 'Global Tech Solutions Inc.',
    address: {
      city: 'New York',
      state: 'NY',
      zip: '10001',
    },
    activatedDate: '2024-01-15',
    netBalance: '$125,450.00',
    netBalanceChange: 12.5, // percentage change
    ownership: 'LLC',
    mcc: '5655',
    merchantType: 'E-commerce',
    cardPresent: 45.8,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const isPositiveTrend = demographicsData.netBalanceChange > 0;

  return (
    <VStack align="stretch" gap={0}>
      {/* Header with DBA Name */}
      <Box
        bg="#F8F9FC"
        px={4}
        py={3}
        borderTopRadius="md"
        borderBottomWidth="1px"
        borderColor="gray.200"
      >
        <HStack gap={2} align="center">
          <Box color="blue.600">
            <Building2 size={18} />
          </Box>
          <Text fontSize="lg" fontWeight="semibold" color="#111827">
            {demographicsData.dbaName}
          </Text>
        </HStack>
      </Box>

      {/* Main Content */}
      <Box
        p={4}
        bg="white"
        borderBottomRadius="md"
        borderWidth="1px"
        borderColor="gray.200"
        borderTopWidth="0"
      >
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
          {/* Location Section */}
          <Box
            p={3}
            bg="#F8F9FC"
            borderRadius="md"
          >
            <HStack gap={2} mb={2.5} align="center">
              <Box color="#6B7280">
                <MapPin size={14} />
              </Box>
              <Text fontSize="xs" fontWeight="semibold" color="#6B7280" textTransform="uppercase" letterSpacing="wider">
                Location
              </Text>
            </HStack>
            <VStack align="start" gap={2}>
              <HStack gap={4} flexWrap="wrap">
                <VStack align="start" gap={0.5}>
                  <Text fontSize="xs" color="#6B7280" textTransform="uppercase" letterSpacing="wider">
                    City
                  </Text>
                  <Text fontSize="sm" fontWeight="semibold" color="#111827">
                    {demographicsData.address.city}
                  </Text>
                </VStack>
                <VStack align="start" gap={0.5}>
                  <Text fontSize="xs" color="#6B7280" textTransform="uppercase" letterSpacing="wider">
                    State
                  </Text>
                  <Text fontSize="sm" fontWeight="semibold" color="#111827">
                    {demographicsData.address.state}
                  </Text>
                </VStack>
                <VStack align="start" gap={0.5}>
                  <Text fontSize="xs" color="#6B7280" textTransform="uppercase" letterSpacing="wider">
                    Zip
                  </Text>
                  <Text fontSize="sm" fontWeight="semibold" color="#111827">
                    {demographicsData.address.zip}
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </Box>

          {/* Business Profile Section */}
          <Box
            p={3}
            bg="#F8F9FC"
            borderRadius="md"
          >
            <HStack gap={2} mb={2.5} align="center">
              <Box color="#6B7280">
                <Building2 size={14} />
              </Box>
              <Text fontSize="xs" fontWeight="semibold" color="#6B7280" textTransform="uppercase" letterSpacing="wider">
                Business Profile
              </Text>
            </HStack>
            <VStack align="start" gap={2.5}>
              <HStack gap={3} flexWrap="wrap">
                <VStack align="start" gap={0.5}>
                  <Text fontSize="xs" color="#6B7280" textTransform="uppercase" letterSpacing="wider">
                    Merchant Type
                  </Text>
                  <Badge 
                    colorPalette="blue" 
                    variant="subtle" 
                    fontSize="xs"
                    px={2.5}
                    py={1}
                    borderRadius="full"
                  >
                    {demographicsData.merchantType}
                  </Badge>
                </VStack>
                <VStack align="start" gap={0.5}>
                  <Text fontSize="xs" color="#6B7280" textTransform="uppercase" letterSpacing="wider">
                    Ownership
                  </Text>
                  <Badge 
                    colorPalette="purple" 
                    variant="subtle" 
                    fontSize="xs"
                    px={2.5}
                    py={1}
                    borderRadius="full"
                  >
                    {demographicsData.ownership}
                  </Badge>
                </VStack>
              </HStack>
              <HStack gap={3} flexWrap="wrap">
                <VStack align="start" gap={0.5}>
                  <HStack gap={1} align="center">
                    <Box color="#6B7280">
                      <CreditCard size={12} />
                    </Box>
                    <Text fontSize="xs" color="#6B7280" textTransform="uppercase" letterSpacing="wider">
                      Card Present
                    </Text>
                  </HStack>
                  <Text fontSize="sm" fontWeight="semibold" color="#111827">
                    {demographicsData.cardPresent}%
                  </Text>
                </VStack>
                <VStack align="start" gap={0.5}>
                  <Text fontSize="xs" color="#6B7280" textTransform="uppercase" letterSpacing="wider">
                    MCC
                  </Text>
                  <Badge 
                    colorPalette="gray" 
                    variant="solid" 
                    fontSize="xs"
                    px={2.5}
                    py={1}
                    borderRadius="full"
                    fontWeight="semibold"
                  >
                    {demographicsData.mcc}
                  </Badge>
                </VStack>
              </HStack>
            </VStack>
          </Box>

          {/* Financial Snapshot Section */}
          <Box
            p={3}
            bg="#F8F9FC"
            borderRadius="md"
          >
            <HStack gap={2} mb={2.5} align="center">
              <Box color="#6B7280">
                <DollarSign size={14} />
              </Box>
              <Text fontSize="xs" fontWeight="semibold" color="#6B7280" textTransform="uppercase" letterSpacing="wider">
                Financial Snapshot
              </Text>
            </HStack>
            <HStack gap={6} flexWrap="wrap" align="start">
              <VStack align="start" gap={0.5}>
                <HStack gap={1} align="center">
                  <Box color="#6B7280">
                    <DollarSign size={12} />
                  </Box>
                  <Text fontSize="xs" color="#6B7280" textTransform="uppercase" letterSpacing="wider">
                    Net Balance
                  </Text>
                </HStack>
                <HStack gap={2} align="baseline">
                  <Text fontSize="lg" fontWeight="semibold" color="#111827">
                    {demographicsData.netBalance}
                  </Text>
                  <HStack gap={0.5} align="center">
                    {isPositiveTrend ? (
                      <Box color="green.600">
                        <TrendingUp size={14} />
                      </Box>
                    ) : (
                      <Box color="red.600">
                        <TrendingDown size={14} />
                      </Box>
                    )}
                    <Text 
                      fontSize="xs" 
                      fontWeight="semibold" 
                      color={isPositiveTrend ? 'green.600' : 'red.600'}
                    >
                      {Math.abs(demographicsData.netBalanceChange)}%
                    </Text>
                  </HStack>
                </HStack>
              </VStack>
              <VStack align="start" gap={0.5}>
                <HStack gap={1} align="center">
                  <Box color="#6B7280">
                    <Calendar size={12} />
                  </Box>
                  <Text fontSize="xs" color="#6B7280" textTransform="uppercase" letterSpacing="wider">
                    Activated Date
                  </Text>
                </HStack>
                <Text fontSize="sm" fontWeight="semibold" color="#111827">
                  {formatDate(demographicsData.activatedDate)}
                </Text>
              </VStack>
            </HStack>
          </Box>
        </SimpleGrid>
      </Box>
    </VStack>
  );
}
