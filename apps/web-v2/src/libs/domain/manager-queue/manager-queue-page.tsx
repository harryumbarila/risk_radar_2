'use client';
import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  SimpleGrid,
  Skeleton,
} from '@chakra-ui/react';
import ManagerQueueHeader from './components/manager-queue-header';
import ManagerQueueFilters from './components/manager-queue-filters';
import AnalystWorkloadTable from './components/analyst-workload-table';
import ManagerQueueTable from './components/manager-queue-table';
import { ManagerQueueItem, ManagerQueueFilters as FilterState, AnalystWorkload } from './types';
import { RULE_DEFINITIONS } from '@/libs/domain/dashboard/utils/ruleNames';

export default function ManagerQueuePage() {
  const [isLoading, setIsLoading] = React.useState(true);
      const [filters, setFilters] = React.useState<FilterState>({
        dateRange: 'today',
        analyst: 'all',
        queueType: 'all',
        processor: 'all',
        mcc: '',
        mid: '',
      });

  // Mock data - will be replaced with API calls
  const [queueItems, setQueueItems] = React.useState<ManagerQueueItem[]>([]);
  const [analystWorkloads, setAnalystWorkloads] = React.useState<AnalystWorkload[]>([]);

  // Simulate data loading
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      // Load mock data
      setQueueItems(generateMockQueueItems());
      setAnalystWorkloads(generateMockAnalystWorkloads());
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Filter queue items based on filters
  const filteredQueueItems = React.useMemo(() => {
    let filtered = [...queueItems];

    // Filter by date range
    if (filters.dateRange) {
      const now = new Date();
      let startDate: Date;
      let endDate: Date;

      if (filters.dateRange === 'custom') {
        if (filters.customStartDate) {
          startDate = new Date(filters.customStartDate);
          startDate.setHours(0, 0, 0, 0);
        } else {
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          startDate.setHours(0, 0, 0, 0);
        }
        endDate = filters.customEndDate
          ? new Date(filters.customEndDate)
          : now;
        if (endDate !== now) {
          endDate.setHours(23, 59, 59, 999);
        }
      } else if (filters.dateRange === 'today') {
        // Filter for today only
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);
      } else {
        const days = parseInt(filters.dateRange);
        startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        startDate.setHours(0, 0, 0, 0);
        endDate = now;
      }

      filtered = filtered.filter((item) => {
        if (!item.submittedOn) return false;
        const itemDate = new Date(item.submittedOn);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    if (filters.analyst !== 'all') {
      filtered = filtered.filter((item) =>
        filters.analyst === 'unassigned'
          ? !item.assignedAnalyst
          : item.assignedAnalyst === filters.analyst
      );
    }

    if (filters.queueType !== 'all') {
      switch (filters.queueType) {
        case 'needs-review':
          filtered = filtered.filter((item) => item.status === 'Pending');
          break;
        case 'escalations':
          filtered = filtered.filter((item) => item.reasonForReview.includes('Escalation'));
          break;
        case 'pending-assignment':
          filtered = filtered.filter((item) => !item.assignedAnalyst);
          break;
      }
    }

    if (filters.processor !== 'all') {
      filtered = filtered.filter((item) => item.processor === filters.processor);
    }

    if (filters.mid) {
      filtered = filtered.filter((item) => 
        item.mid.toLowerCase().includes(filters.mid.toLowerCase())
      );
    }

    if (filters.mcc) {
      filtered = filtered.filter((item) => 
        item.mcc?.toLowerCase().includes(filters.mcc.toLowerCase())
      );
    }

    return filtered;
  }, [queueItems, filters]);

  if (isLoading) {
    return (
      <Box p={6}>
        <VStack align="stretch" gap={6}>
          <Skeleton height="80px" />
          <Skeleton height="100px" />
          <Skeleton height="200px" />
          <Skeleton height="400px" />
        </VStack>
      </Box>
    );
  }

  return (
    <VStack align="stretch" gap={6}>
      <ManagerQueueHeader />
      <ManagerQueueFilters filters={filters} onFiltersChange={setFilters} />
      <AnalystWorkloadTable 
        workloads={analystWorkloads} 
        onFilterByAnalyst={(analyst) => {
          setFilters((prev) => ({ ...prev, analyst }));
        }}
      />
      <ManagerQueueTable items={filteredQueueItems} />
    </VStack>
  );
}

// Mock data generators
function generateMockQueueItems(): ManagerQueueItem[] {
  const analysts = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams', null];
  const processors = ['TSYS', 'FSP'];
  const riskLevels = ['Low', 'Medium', 'High', 'Critical'];
  const statuses = ['Pending', 'In-Review', 'Completed'];
  const reasons = [
    'Escalation from analyst',
    'Complex case requiring review',
    'Exception rule triggered',
    'SLA breach',
    'High-risk merchant',
    'Multiple chargebacks',
  ];
  const merchants = [
    'Global Tech Solutions',
    'Oceanview Logistics',
    'Sunshine Pharmacy',
    'Digital Assets Exchange',
    'City Supermarket',
    'QuickWire Transfers',
    'Business Equipment Pro',
    'Luxury Boutique',
  ];

  const ruleIds = Object.keys(RULE_DEFINITIONS);
  
  return Array.from({ length: 25 }, (_, i) => {
    const baseDate = new Date();
    // Ensure at least 2 items have today's date (first 2 items)
    if (i < 2) {
      // Today's date
      baseDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0, 0);
    } else {
      // Previous dates
      baseDate.setDate(baseDate.getDate() - Math.floor((i - 1) / 5));
    }
    
    const exceptionsCount = Math.floor(Math.random() * 5) + 1;
    // Generate random rule IDs for triggered rules
    const shuffledRules = [...ruleIds].sort(() => Math.random() - 0.5);
    const triggeredRules = shuffledRules.slice(0, exceptionsCount);
    
    const merchantIndex = i % merchants.length;
    const reasonIndex = i % reasons.length;
    const riskIndex = i % riskLevels.length;
    const analystIndex = i % analysts.length;
    const processorIndex = i % processors.length;
    const statusIndex = i % statuses.length;
    
    return {
      id: `MQ-${i + 1}`,
      dbaName: merchants[merchantIndex] || 'Unknown Merchant',
      mid: generateMID(i),
      reasonForReview: reasons[reasonIndex] || 'Unknown reason',
      riskLevel: (riskLevels[riskIndex] || 'Low') as 'Low' | 'Medium' | 'High' | 'Critical',
      assignedAnalyst: analysts[analystIndex] || null,
      processor: processors[processorIndex] || 'TSYS',
      exceptionsTriggered: exceptionsCount,
      triggeredRules,
      status: (statuses[statusIndex] || 'Pending') as 'Pending' | 'In-Review' | 'Completed',
      submittedOn: baseDate.toISOString(),
      lastActivity: new Date(baseDate.getTime() + Math.random() * 86400000).toISOString(),
      mcc: String(Math.floor(Math.random() * 9000) + 1000),
    };
  });
}

function generateMockAnalystWorkloads(): AnalystWorkload[] {
  const analysts = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams'];
  
  return analysts.map((analyst, i) => ({
    analyst,
    assignedItems: Math.floor(Math.random() * 30) + 10,
    escalations: Math.floor(Math.random() * 5),
    averageReviewTime: `${Math.floor(Math.random() * 4) + 1}.${Math.floor(Math.random() * 9)}h`,
    onHoldItems: Math.floor(Math.random() * 8),
    slaBreaches: Math.floor(Math.random() * 3),
  }));
}

function generateMID(index: number): string {
  const prefix = index % 2 === 0 ? '5555' : '7777';
  const randomDigits = String(Math.floor(Math.random() * 100000000000)).padStart(12, '0');
  return `${prefix}${randomDigits}`;
}

