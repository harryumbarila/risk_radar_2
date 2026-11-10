'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { Box, Text } from '@chakra-ui/react';
import BatchDetailPage from '@/libs/domain/auto-hold/components/batch-detail-page/batch-detail-page';
import { getBatchByMID } from '@/libs/domain/dashboard/components/transactions/transactions';

export default function MerchantBatchPage(): React.JSX.Element {
  const params = useParams();
  const mid = params?.mid as string | undefined;

  const batch = React.useMemo(() => {
    if (!mid) return [];
    return getBatchByMID(decodeURIComponent(mid));
  }, [mid]);

  if (!mid) {
    return (
      <Box p={6} textAlign="center">
        <Text fontSize="lg" color="gray.600">
          Merchant not found
        </Text>
      </Box>
    );
  }

  if (batch.length === 0) {
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
