'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { Box, Text } from '@chakra-ui/react';
import BatchDetailPage from '@/libs/domain/auto-hold/components/batch-detail-page/batch-detail-page';
import { MerchantTransaction } from '@/data/interfaces/transaction';

// Mock function to fetch batch data by ID
// In a real app, this would be an API call
function getBatchById(id: string): MerchantTransaction[] {
  // This is a mock - in reality you'd fetch from an API
  // For now, we'll generate mock data based on the ID
  // In production, you'd use the ID to fetch the actual batch data
  
  // Generate mock transactions
  const mockTransactions: MerchantTransaction[] = [
    {
      id: `TXN-${id}-1`,
      merchant: 'Acme Corp',
      dbaName: 'Acme Corp DBA',
      amount: '$1250.00',
      processor: 'TSYS',
      mid: id,
      exception: 'High Amount',
      date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString(),
      status: 'Unreviewed' as const,
      source: 'Auth',
      dataSourceIdentifier: 'TSYS ADF Auth 11252025_20251125_061057',
      ahRuleApplied: ['AH001'],
      riskWatch: false,
    },
    {
      id: `TXN-${id}-2`,
      merchant: 'Acme Corp',
      dbaName: 'Acme Corp DBA',
      amount: '$980.50',
      processor: 'TSYS',
      mid: id,
      exception: 'Rapid Volume',
      date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString(),
      status: 'Unreviewed' as const,
      source: 'Capture',
      dataSourceIdentifier: 'TSYS DFT256 Capture 20251125_031528_24',
      ahRuleApplied: ['AH002'],
      riskWatch: false,
    },
  ];
  
  return mockTransactions;
}

export default function BatchDetailPageRoute() {
  const params = useParams();
  const batchId = params.id as string;
  
  // Fetch batch data
  const batch = React.useMemo(() => {
    return getBatchById(batchId);
  }, [batchId]);

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

