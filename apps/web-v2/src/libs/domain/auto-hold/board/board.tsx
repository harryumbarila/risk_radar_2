'use client';
import React from 'react';
import { Box, HStack, Button, Tabs, Text, VStack, Skeleton, SimpleGrid } from '@chakra-ui/react';
import { UserCog, List } from 'lucide-react';
import CustomTable from '@/libs/domain/dashboard/components/transactions/transactions';
import ManagerQueueView from '../components/manager-queue-view/manager-queue-view';
import AutoHoldFilterBar, { AutoHoldFilterState } from '../components/filter-bar/filter-bar';
import { MerchantTransaction } from '@/data/interfaces/transaction';
import { RULE_DEFINITIONS } from '@/libs/domain/dashboard/utils/ruleNames';

export default function AutoHoldBoardPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [viewMode, setViewMode] = React.useState<'analyst' | 'manager'>('analyst');
  const [filters, setFilters] = React.useState<AutoHoldFilterState>({
    dateRange: '7',
    status: 'all',
    processor: 'all',
    source: 'all',
    merchant: '',
    mid: '',
    ruleId: 'all',
  });

  // Get available rules from RULE_DEFINITIONS (all 30 rules)
  const availableRules = React.useMemo(() => {
    // Use all 30 rules defined in RULE_DEFINITIONS
    return Object.keys(RULE_DEFINITIONS).sort();
  }, []);
  
  // Simulate data loading on mount
  React.useEffect(() => {
    setIsLoading(true);
    // Simulate API call delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // 800ms delay to show skeleton
    
    return () => clearTimeout(timer);
  }, []);
  
  // Mock: Group transactions into batches for manager view
  // In real app, this would come from API or be shared state
  const allBatches: MerchantTransaction[][] = React.useMemo(() => {
    // Mock transactions grouped by batch (merchant + date)
    const mockTransactions: MerchantTransaction[] = [
      {
        id: '1',
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

  // Loading skeleton
  if (isLoading) {
    return (
      <Box>
        <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
          <VStack align="stretch" gap={6}>
            {/* Header skeleton */}
            <HStack justify="space-between">
              <Skeleton height="40px" width="200px" />
              <Skeleton height="40px" width="150px" />
            </HStack>
            
            {/* Filter bar skeleton */}
            <VStack align="stretch" gap={4}>
              <Skeleton height="60px" width="100%" />
              <SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} gap={4}>
                {Array(6).fill(0).map((_, i) => (
                  <Skeleton key={i} height="40px" />
                ))}
              </SimpleGrid>
            </VStack>
            
            {/* Table skeleton */}
            <VStack align="stretch" gap={2}>
              <Skeleton height="50px" width="100%" /> {/* Table header */}
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} height="60px" width="100%" /> {/* Table rows */}
              ))}
            </VStack>
          </VStack>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
        <Tabs.Root
          value={viewMode}
          onValueChange={(e) => setViewMode(e.value as 'analyst' | 'manager')}
        >
          <HStack justify="space-between" mb={6}>
            <Tabs.List>
              <Tabs.Trigger value="analyst" suppressHydrationWarning>
                <HStack gap={2}>
                  <List size={16} />
                  <Text>Analyst View</Text>
                </HStack>
              </Tabs.Trigger>
              <Tabs.Trigger value="manager" suppressHydrationWarning>
                <HStack gap={2}>
                  <UserCog size={16} />
                  <Text>Manager Queue</Text>
                </HStack>
              </Tabs.Trigger>
              <Tabs.Indicator />
            </Tabs.List>
          </HStack>

          <Tabs.Content value="analyst">
            <AutoHoldFilterBar filters={filters} onFiltersChange={setFilters} availableRules={availableRules} />
            <CustomTable filters={filters} />
          </Tabs.Content>

          <Tabs.Content value="manager">
            <ManagerQueueView allBatches={allBatches} />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Box>
  );
}
