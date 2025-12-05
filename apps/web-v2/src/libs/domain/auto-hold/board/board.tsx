'use client';
import React from 'react';
import { Box, HStack, Button, Tabs, Text, VStack, Skeleton, SimpleGrid } from '@chakra-ui/react';
import { UserCog, List } from 'lucide-react';
import CustomTable from '@/libs/domain/dashboard/components/transactions/transactions';
import ManagerQueueView from '../components/manager-queue-view/manager-queue-view';
import AutoHoldFilterBar, { AutoHoldFilterState } from '../components/filter-bar/filter-bar';
import { MerchantTransaction } from '@/data/interfaces/transaction';
import { RULE_DEFINITIONS } from '@/libs/domain/dashboard/utils/ruleNames';
import { generateDataSourceIdentifier, generateMID } from '../../dashboard/components/transactions/transactions';

export default function AutoHoldBoardPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [viewMode, setViewMode] = React.useState<'analyst' | 'manager'>('analyst');
  const [filters, setFilters] = React.useState<AutoHoldFilterState>({
    dateRange: '7',
    status: 'all',
    processor: 'all',
    source: 'all',
    dataSource: 'all',
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
    const baseDate = new Date();
    const tx1Date = new Date('2025-04-08T09:15:00.000Z');
    const tx2Date = new Date('2025-04-08T10:23:00.000Z');
    const tx3Date = new Date('2025-04-08T11:05:00.000Z');
    
    // Mock transactions grouped by batch (merchant + date)
    const dataSources: ('Auth' | 'Capture' | 'Settled' | 'Returns')[] = ['Auth', 'Capture', 'Settled', 'Returns'];
    const processors = ['TSYS', 'FSP'];
    const statuses: ('Unreviewed' | 'In Progress' | 'Reviewed')[] = ['Unreviewed', 'In Progress', 'Reviewed'];
    const merchants = [
      'Global Tech Solutions',
      'Oceanview Logistics',
      'Sunshine Pharmacy',
      'Digital Assets Exchange',
      'City Supermarket',
      'QuickWire Transfers',
      'Business Equipment Pro',
      'Luxury Boutique',
      'Downtown Hotel',
      'Global Shipping Co',
      'Metro Financial Services',
      'Coastal Trading Group',
    ];
    const exceptions = [
      'High-risk country, Unusual amount',
      'New merchant, Pattern match anomaly',
      'Frequency anomaly',
      'High Amount',
      'Rapid Volume',
      'Unusual Pattern',
      'Foreign Card',
      'Manual review flag',
    ];

    const mockTransactions: MerchantTransaction[] = Array.from({ length: 12 }, (_, i) => {
      const txDate = new Date(baseDate);
      txDate.setDate(txDate.getDate() - Math.floor(i / 4));
      txDate.setHours(9 + (i % 8), 15 + (i * 5) % 45, 0, 0);
      
      return {
        id: String(i + 1),
        merchant: merchants[i % merchants.length],
        amount: `$${(Math.random() * 15000 + 100).toFixed(2)}`,
        exception: exceptions[i % exceptions.length],
        processor: processors[i % processors.length],
        mid: generateMID(i),
        date: txDate.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: statuses[i % statuses.length],
        createdAt: txDate.toISOString(),
        updatedAt: txDate.toISOString(),
        source: dataSources[i % dataSources.length],
        dataSourceIdentifier: generateDataSourceIdentifier(dataSources[i % dataSources.length], txDate),
      };
    });
    
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
              <Skeleton height="50px" width="100%" />
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} height="60px" width="100%" />
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
