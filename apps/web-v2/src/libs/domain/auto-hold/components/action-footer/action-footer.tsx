'use client';
import React from 'react';
import { Box, HStack, Button } from '@chakra-ui/react';
import { Check, Ban, ArrowLeft } from 'lucide-react';

interface ActionFooterProps {
  onMarkAsReviewed: () => void;
  onDivertCase: () => void;
  onBackToQueue: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export default function ActionFooter({
  onMarkAsReviewed,
  onDivertCase,
  onBackToQueue,
  isLoading = false,
  isDisabled = false,
}: ActionFooterProps) {
  return (
    <Box
      position="sticky"
      bottom={0}
      bg="white"
      borderTop="1px"
      borderColor="gray.200"
      px={6}
      py={4}
      boxShadow="0 -2px 8px rgba(0,0,0,0.05)"
      mt="auto"
    >
      <HStack justify="flex-end" gap={3} maxW="1400px" mx="auto">
        <Button
          variant="ghost"
          onClick={onBackToQueue}
          disabled={isDisabled}
          aria-label="Back to Queue"
        >
          <ArrowLeft size={16} />
          Back to Queue
        </Button>
        <Button
          colorPalette="red"
          variant="outline"
          onClick={onDivertCase}
          disabled={isDisabled}
          aria-label="Divert Case"
        >
          <Ban size={16} />
          Divert Case
        </Button>
        <Button
          colorPalette="blue"
          onClick={onMarkAsReviewed}
          loading={isLoading}
          disabled={isDisabled}
          aria-label="Mark as Reviewed"
        >
          <Check size={16} />
          Mark as Reviewed
        </Button>
      </HStack>
    </Box>
  );
}

