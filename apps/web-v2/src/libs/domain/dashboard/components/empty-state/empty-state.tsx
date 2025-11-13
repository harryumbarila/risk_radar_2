'use client';
import React from 'react';
import { Box, VStack, Text, Button } from '@chakra-ui/react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = 'No data available',
  description = 'No results found for the selected filters.',
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Box
      bg="white"
      p={12}
      borderRadius="xl"
      boxShadow="sm"
      borderWidth="1px"
      borderColor="gray.200"
      textAlign="center"
    >
      <VStack gap={4} align="center">
        <Box color="gray.400" fontSize="4xl">
          <Inbox size={48} />
        </Box>
        <VStack gap={2}>
          <Text fontSize="lg" fontWeight="semibold" color="gray.700">
            {title}
          </Text>
          <Text fontSize="sm" color="gray.500" maxW="400px">
            {description}
          </Text>
        </VStack>
        {actionLabel && onAction && (
          <Button colorPalette="blue" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </VStack>
    </Box>
  );
}

