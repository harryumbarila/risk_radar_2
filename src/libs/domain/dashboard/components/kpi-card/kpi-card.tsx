'use client';
import React from 'react';
import { Box, VStack, HStack, Text } from '@chakra-ui/react';

interface KpiCardProps {
  label: string;
  value: string | number | React.ReactNode;
  change?: number; // Percentage change
  color?: string;
  icon?: React.ReactNode;
}

export default function KpiCard({
  label,
  value,
  change,
  color = 'blue',
  icon,
}: KpiCardProps) {
  // Determine change color: green if positive, red if negative, gray if zero
  const changeColor = 
    change !== undefined 
      ? change > 0 
        ? 'green.500' 
        : change < 0 
        ? 'red.500' 
        : 'gray.500'
      : undefined;
  const changeIcon = change !== undefined ? (change >= 0 ? '↑' : '↓') : null;

  return (
    <Box
      bg="white"
      pt={6}
      pb={6}
      px={6}
      borderRadius="xl"
      boxShadow="0 2px 8px rgba(0,0,0,0.05)"
      borderWidth="1px"
      borderColor="gray.200"
      _hover={{ 
        boxShadow: 'md',
        transform: 'translateY(-2px)',
        borderColor: `${color}.200`,
      }}
      transition="all 0.15s ease"
      cursor="default"
    >
      <HStack align="flex-start" gap={4}>
        {/* Left: Icon and Value */}
        <VStack align="flex-start" gap={2} flex={1}>
          {icon && (
            <Box 
              color={`${color}.500`} 
              fontSize="24px"
              display="flex"
              alignItems="center"
            >
              {icon}
            </Box>
          )}
          <Text fontSize="xs" color="gray.600" fontWeight="medium" textTransform="uppercase" letterSpacing="wider">
            {label}
          </Text>
          {typeof value === 'number' ? (
            <Text fontSize="2xl" fontWeight="bold" color="gray.900">
              {value.toLocaleString()}
            </Text>
          ) : typeof value === 'string' ? (
            <Text fontSize="2xl" fontWeight="bold" color="gray.900">
              {value}
            </Text>
          ) : (
            <Box fontSize="2xl" fontWeight="bold" color="gray.900">
              {value}
            </Box>
          )}
        </VStack>

        {/* Right: Change percentage */}
        {change !== undefined && (
          <VStack align="flex-end" gap={0}>
            <HStack gap={1} align="center">
              <Text fontSize="sm" fontWeight="semibold" color={changeColor}>
                {changeIcon} {Math.abs(change).toFixed(1)}%
              </Text>
            </HStack>
            <Text fontSize="xs" color="gray.500" mt={1}>
              vs last week
            </Text>
          </VStack>
        )}
      </HStack>
    </Box>
  );
}

