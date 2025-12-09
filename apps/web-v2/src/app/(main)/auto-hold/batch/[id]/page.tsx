'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { Box, Text } from '@chakra-ui/react';
import BatchDetailPage from '@/libs/domain/auto-hold/components/batch-detail-page/batch-detail-page';
import { MerchantTransaction } from '@/data/interfaces/transaction';
import { getBatchByMID } from '@/libs/domain/dashboard/components/transactions/transactions';

// Function to fetch batch data by MID
// Uses the same data source as the transactions table
function getBatchById(id: string): MerchantTransaction[] {
  // Use the exported function to get batch by MID
  const batch = getBatchByMID(id);
  
  // If batch found, return it
  if (batch.length > 0) {
    return batch;
  }
  
  // If no batch found, return empty array (will show "Batch not found" message)
  return [];
}

export default function BatchDetailPageRoute() {
  const params = useParams();
  const batchId = params?.id as string | undefined;
  
  // Fetch batch data - always call the hook, even if batchId is undefined
  const batch = React.useMemo(() => {
    if (!batchId) return [];
    return getBatchById(batchId);
  }, [batchId]);
  
  if (!params || !batchId) {
    return (
      <Box p={6} textAlign="center">
        <Text fontSize="lg" color="gray.600">
          Batch ID not found
        </Text>
      </Box>
    );
  }

  if (!batch || batch.length === 0) {
    return (
      <Box p={6} textAlign="center">
        <Text fontSize="lg" color="gray.600">
          Batch not found
        </Text>
      </Box>
    );
  }

  return <BatchDetailPage batch={batch} />;
}

