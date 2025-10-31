import React from 'react';
import { Box, HStack, VStack, Text } from '@chakra-ui/react';

import { StatCardProps } from './stat-card.model';

export default function StatCard(props: StatCardProps) {
  const { label, value, change, icon, isPositive = true } = props;
  return (
    <Box
      bg="white"
      p={6}
      borderRadius="xl"
      boxShadow="sm"
      position="relative"
      overflow="hidden"
    >
      <HStack justify="space-between" align="start">
        <VStack align="start" gap={1}>
          <Text color="gray.500" fontSize="sm" fontWeight="medium">
            {label}
          </Text>
          <Text fontSize="2xl" fontWeight="bold">
            {value}
          </Text>
          <Text color={isPositive ? 'green.500' : 'red.500'} fontSize="sm">
            {change}
          </Text>
        </VStack>
        <Box
          bg="brand.400"
          p={3}
          borderRadius="xl"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {icon}
        </Box>
      </HStack>
    </Box>
  );
}
