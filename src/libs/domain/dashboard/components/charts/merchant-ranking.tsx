'use client';
import React from 'react';
import { Box, VStack, Text, HStack, Button, Badge, Tooltip, Portal } from '@chakra-ui/react';
import { ArrowUpRight, Info } from 'lucide-react';
import type { MockAlert } from '../../utils/mockData';
import EmptyState from '../empty-state/empty-state';

interface MerchantRankingProps {
  alerts: MockAlert[];
  onMerchantClick?: (merchantId: string) => void;
}

function MerchantRanking({ alerts, onMerchantClick }: MerchantRankingProps) {
  const merchantData = React.useMemo(() => {
    const merchantMap = new Map<
      string,
      { name: string; count: number; lastAlert: Date }
    >();

    alerts.forEach((alert) => {
      const existing = merchantMap.get(alert.merchantId);
      const alertDate = new Date(alert.date);
      if (!existing) {
        merchantMap.set(alert.merchantId, {
          name: alert.merchantName,
          count: 1,
          lastAlert: alertDate,
        });
      } else {
        existing.count++;
        if (alertDate > existing.lastAlert) {
          existing.lastAlert = alertDate;
        }
      }
    });

    return Array.from(merchantMap.entries())
      .map(([merchantId, data]) => ({
        merchantId,
        name: data.name,
        incidentCount: data.count,
        lastAlert: data.lastAlert,
      }))
      .sort((a, b) => b.incidentCount - a.incidentCount)
      .slice(0, 10);
  }, [alerts]);

  if (merchantData.length === 0) {
    return <EmptyState title="No merchant data available" />;
  }

  const getRiskColor = (incidentCount: number) => {
    if (incidentCount >= 10) return 'red';
    if (incidentCount >= 5) return 'orange';
    return 'green';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
      aria-label="Critical Merchants Ranking"
    >
      <VStack align="stretch" gap={4}>
        <HStack gap={2} align="center">
          <Text fontSize="lg" fontWeight="bold">
            Critical Merchants Ranking
          </Text>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Box
                as="span"
                color="gray.400"
                _hover={{ color: 'gray.600' }}
                cursor="help"
                display="inline-flex"
                alignItems="center"
                aria-label="Chart information"
              >
                <Info size={16} />
              </Box>
            </Tooltip.Trigger>
            <Portal>
              <Tooltip.Positioner>
                <Tooltip.Content
                  maxW="300px"
                  zIndex={1100}
                  bg="gray.900"
                  color="white"
                  px={3}
                  py={2}
                  borderRadius="md"
                  fontSize="sm"
                  boxShadow="lg"
                >
                  <Tooltip.Arrow />
                  Lists the top 10 merchants ranked by number of incidents. Merchants with more incidents require priority attention. Click the arrow icon to view details in Auto Hold.
                </Tooltip.Content>
              </Tooltip.Positioner>
            </Portal>
          </Tooltip.Root>
        </HStack>
        <VStack align="stretch" gap={2}>
          {merchantData.map((merchant, index) => (
            <HStack
              key={merchant.merchantId}
              justify="space-between"
              p={4}
              borderRadius="lg"
              bg="gray.50"
              _hover={{ 
                bg: 'gray.100',
                boxShadow: 'sm',
                transform: 'translateY(-1px)',
              }}
              transition="all 0.15s ease"
              cursor="pointer"
            >
              <HStack gap={4} flex={1}>
                {/* Avatar with initials */}
                <Box
                  w="32px"
                  h="32px"
                  borderRadius="full"
                  bg="gray.400"
                  color="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="xs"
                  fontWeight="bold"
                  flexShrink={0}
                >
                  {getInitials(merchant.name)}
                </Box>
                
                <Text fontSize="sm" fontWeight="bold" color="gray.500" w="24px">
                  #{index + 1}
                </Text>
                
                <VStack align="start" gap={0} flex={1}>
                  <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                    {merchant.name}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {merchant.merchantId} • {merchant.incidentCount} incidents
                  </Text>
                </VStack>
                
                <Badge
                  colorPalette={getRiskColor(merchant.incidentCount)}
                  variant="subtle"
                  px={3}
                  py={1}
                  borderRadius="md"
                  fontWeight="semibold"
                >
                  {merchant.incidentCount} incidents
                </Badge>
                
                <Text fontSize="xs" color="gray.500" w="100px">
                  Last: {merchant.lastAlert.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              </HStack>
              
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onMerchantClick?.(merchant.merchantId)}
                    aria-label={`Open ${merchant.name} in Auto Hold`}
                    _hover={{ bg: 'blue.50', borderColor: 'blue.300' }}
                  >
                    <ArrowUpRight size={14} />
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Positioner>
                  <Tooltip.Content>
                    <Tooltip.Arrow />
                    Open in Auto Hold
                  </Tooltip.Content>
                </Tooltip.Positioner>
              </Tooltip.Root>
            </HStack>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
}

export default MerchantRanking;
