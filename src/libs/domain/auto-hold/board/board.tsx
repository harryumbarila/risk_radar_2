'use client';
import React from 'react';
import { Box, HStack, Button, Tabs, Text } from '@chakra-ui/react';
import { UserCog, List } from 'lucide-react';
import CustomTable from '@/libs/domain/dashboard/components/transactions/transactions';
import ManagerQueueView from '../components/manager-queue-view/manager-queue-view';
import { MerchantTransaction } from '@/data/interfaces/transaction';

export default function AutoHoldBoardPage() {
  const [viewMode, setViewMode] = React.useState<'analyst' | 'manager'>('analyst');
  
  // Mock: Group transactions into batches for manager view
  // In real app, this would come from API or be shared state
  const allBatches: MerchantTransaction[][] = React.useMemo(() => {
    // Mock transactions grouped by batch (merchant + date)
    const mockTransactions: MerchantTransaction[] = [
      {
        id: '1',
        score: 85,
        merchant: 'Global Tech Solutions',
        amount: '$12,500.00',
        exception: 'High-risk country, Unusual amount',
        processor: 'TSYS',
        mid: '8675309001',
        date: 'Apr 8, 9:15 AM',
        status: 'Unreviewed',
        createdAt: '2025-04-08T09:15:00.000Z',
        updatedAt: '2025-04-08T09:15:00.000Z',
      },
      {
        id: '2',
        score: 65,
        merchant: 'Oceanview Logistics',
        amount: '$8,750.50',
        exception: 'New merchant, Pattern match anomaly',
        processor: 'Fiserv',
        mid: '8675309002',
        date: 'Apr 8, 10:23 AM',
        status: 'In Progress',
        createdAt: '2025-04-08T10:23:00.000Z',
        updatedAt: '2025-04-08T10:23:00.000Z',
      },
      {
        id: '3',
        score: 35,
        merchant: 'Sunshine Pharmacy',
        amount: '$456.78',
        exception: 'Frequency anomaly',
        processor: 'Worldpay',
        mid: '8675309003',
        date: 'Apr 8, 11:05 AM',
        status: 'Unreviewed',
        createdAt: '2025-04-08T11:05:00.000Z',
        updatedAt: '2025-04-08T11:05:00.000Z',
      },
    ];
    
    // Group by merchant + date to create batches
    const batchMap = new Map<string, MerchantTransaction[]>();
    mockTransactions.forEach((tx) => {
      const batchId = `${tx.merchant}-${tx.date}`;
      if (!batchMap.has(batchId)) {
        batchMap.set(batchId, []);
      }
      batchMap.get(batchId)!.push(tx);
    });
    
    return Array.from(batchMap.values());
  }, []);

  return (
    <Box>
      <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
        <Tabs.Root
          value={viewMode}
          onValueChange={(e) => setViewMode(e.value as 'analyst' | 'manager')}
        >
          <HStack justify="space-between" mb={6}>
            <Tabs.List>
              <Tabs.Trigger value="analyst">
                <HStack gap={2}>
                  <List size={16} />
                  <Text>Analyst View</Text>
                </HStack>
              </Tabs.Trigger>
              <Tabs.Trigger value="manager">
                <HStack gap={2}>
                  <UserCog size={16} />
                  <Text>Manager Queue</Text>
                </HStack>
              </Tabs.Trigger>
              <Tabs.Indicator />
            </Tabs.List>
          </HStack>

          <Tabs.Content value="analyst">
            <CustomTable />
          </Tabs.Content>

          <Tabs.Content value="manager">
            <ManagerQueueView allBatches={allBatches} />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Box>
  );
}
