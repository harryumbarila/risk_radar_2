'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, HStack, Tabs, Text, VStack, Skeleton, SimpleGrid } from '@chakra-ui/react';
import { UserCog, List, Lock } from 'lucide-react';
import CustomTable from '@/libs/domain/dashboard/components/transactions/transactions';
import ManagerQueuePage from '@/libs/domain/manager-queue/manager-queue-page';
import MerchantHoldsPage from '@/libs/domain/merchant-holds/merchant-holds-page';
import AutoHoldFilterBar, { AutoHoldFilterState } from '../components/filter-bar/filter-bar';
import { MerchantTransaction } from '@/data/interfaces/transaction';
import { RULE_DEFINITIONS } from '@/libs/domain/dashboard/utils/ruleNames';
import { generateDataSourceIdentifier, generateMID } from '../../dashboard/components/transactions/transactions';

export default function AutoHoldBoardPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = React.useState(true);
  
  // Check if tab is specified in URL, default to 'analyst'
  const initialTab = (searchParams?.get('tab') as 'analyst' | 'manager' | 'merchant-holds') || 'analyst';
  const [viewMode, setViewMode] = React.useState<'analyst' | 'manager' | 'merchant-holds'>(initialTab);
  
  // Update viewMode when URL param changes
  React.useEffect(() => {
    const tab = (searchParams?.get('tab') as 'analyst' | 'manager' | 'merchant-holds') || 'analyst';
    setViewMode(tab);
  }, [searchParams]);
  const [filters, setFilters] = React.useState<AutoHoldFilterState>({
    dateRange: 'today',
    status: 'Unreviewed',
    processor: 'all',
    source: 'all',
    dataSource: 'all',
    merchant: '',
    mid: '',
    mcc: '',
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
      
      const merchant = merchants[i % merchants.length] || 'Unknown Merchant';
      const exception = exceptions[i % exceptions.length] || 'None';
      const processor = processors[i % processors.length] || 'TSYS';
      const status = statuses[i % statuses.length] || 'Unreviewed';
      const dataSource = dataSources[i % dataSources.length] || 'Auth';
      
      return {
        id: String(i + 1),
        merchant: merchant,
        amount: `$${(Math.random() * 15000 + 100).toFixed(2)}`,
        exception: exception,
        processor: processor,
        mid: generateMID(i),
        date: txDate.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: status,
        createdAt: txDate.toISOString(),
        updatedAt: txDate.toISOString(),
        source: dataSource,
        dataSourceIdentifier: generateDataSourceIdentifier(dataSource, txDate),
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
          onValueChange={(e) => {
            const newTab = e.value as 'analyst' | 'manager' | 'merchant-holds';
            setViewMode(newTab);
            // Update URL without page reload
            const url = new URL(window.location.href);
            url.searchParams.set('tab', newTab);
            window.history.pushState({}, '', url);
          }}
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
              <Tabs.Trigger value="merchant-holds" suppressHydrationWarning>
                <HStack gap={2}>
                  <Lock size={16} />
                  <Text>Merchant Holds</Text>
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
            <Box mt={4}>
              <ManagerQueuePage />
            </Box>
          </Tabs.Content>

          <Tabs.Content value="merchant-holds">
            <Box mt={4}>
              <MerchantHoldsPage />
            </Box>
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Box>
  );
}
