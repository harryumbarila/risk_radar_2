'use client';
import React from 'react';
import { Box, VStack, HStack, Text, Button, Badge } from '@chakra-ui/react';
import { Lock, Plus } from 'lucide-react';
import MerchantHoldsTable from './components/merchant-holds-table';
import MerchantHoldsFilterBar, { MerchantHoldsFilterState } from './components/merchant-holds-filter-bar';
import PlaceHoldModal from './components/place-hold-modal';
import { MerchantHold } from './types';
import { generateMID } from '@/libs/domain/dashboard/components/transactions/transactions';

export default function MerchantHoldsPage() {
  const [filters, setFilters] = React.useState<MerchantHoldsFilterState>({
    dateRange: 'all',
    holdType: 'all',
    source: 'all',
    search: '',
  });
  
  const [isPlaceHoldModalOpen, setIsPlaceHoldModalOpen] = React.useState(false);
  
  // Mock data - in real app, this would come from API
  const [merchantHolds, setMerchantHolds] = React.useState<MerchantHold[]>([
    {
      id: '1',
      dbaName: 'Global Tech Solutions',
      mid: generateMID(0),
      holdType: 'Manual',
      reason: 'High-risk activity detected',
      datePlaced: new Date('2025-01-15T10:30:00'),
      placedBy: 'analyst',
      placedByName: 'John Doe',
      holdStatus: 'Active',
      expirationDate: new Date('2025-02-15T10:30:00'),
    },
    {
      id: '2',
      dbaName: 'Oceanview Logistics',
      mid: generateMID(1),
      holdType: 'Auto-Hold',
      reason: 'R001 - High Amount Rule',
      datePlaced: new Date('2025-01-14T14:20:00'),
      placedBy: 'system',
      placedByName: 'System',
      holdStatus: 'Active',
    },
    {
      id: '3',
      dbaName: 'Sunshine Pharmacy',
      mid: generateMID(2),
      holdType: 'Manual',
      reason: 'Compliance review required',
      datePlaced: new Date('2025-01-10T09:15:00'),
      placedBy: 'analyst',
      placedByName: 'Jane Smith',
      holdStatus: 'Released',
      releasedDate: new Date('2025-01-12T16:45:00'),
      releasedBy: 'analyst',
      releasedByName: 'Jane Smith',
    },
  ]);

  const filteredHolds = React.useMemo(() => {
    let filtered = [...merchantHolds];

    // Date range filter
    if (filters.dateRange !== 'all') {
      if (filters.dateRange === 'custom') {
        if (filters.customStartDate && filters.customEndDate) {
          const startDate = new Date(filters.customStartDate);
          startDate.setHours(0, 0, 0, 0);
          const endDate = new Date(filters.customEndDate);
          endDate.setHours(23, 59, 59, 999);
          
          filtered = filtered.filter(hold => {
            const holdDate = new Date(hold.datePlaced);
            return holdDate >= startDate && holdDate <= endDate;
          });
        }
      } else {
        const now = new Date();
        const daysAgo = filters.dateRange === 'today' ? 0 : parseInt(filters.dateRange);
        const cutoffDate = new Date(now);
        cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
        
        filtered = filtered.filter(hold => {
          const holdDate = new Date(hold.datePlaced);
          return holdDate >= cutoffDate;
        });
      }
    }

    // Hold type filter
    if (filters.holdType !== 'all') {
      filtered = filtered.filter(hold => hold.holdType === filters.holdType);
    }

    // Source filter
    if (filters.source !== 'all') {
      filtered = filtered.filter(hold => hold.placedBy === filters.source);
    }

    // Search filter (MID only)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(hold => 
        hold.mid.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [merchantHolds, filters]);

  const handleReleaseHold = (holdId: string) => {
    setMerchantHolds(prev => prev.map(hold => 
      hold.id === holdId 
        ? { 
            ...hold, 
            holdStatus: 'Released' as const,
            releasedDate: new Date(),
            releasedBy: 'analyst',
            releasedByName: 'Current User',
          }
        : hold
    ));
  };

  return (
    <VStack align="stretch" gap={4}>
      {/* Header */}
      <HStack justify="space-between" align="center">
        <HStack gap={2}>
          <Box color="red.500">
            <Lock size={24} />
          </Box>
          <Text fontSize="lg" fontWeight="semibold" color="gray.900">
            Merchant Holds
          </Text>
          <Badge colorPalette="red" variant="subtle">
            {filteredHolds.filter(h => h.holdStatus === 'Active').length} Active
          </Badge>
        </HStack>
        <Button
          colorPalette="red"
          onClick={() => setIsPlaceHoldModalOpen(true)}
        >
          <Plus size={16} />
          Put Merchant on Hold
        </Button>
      </HStack>

      {/* Filter Bar */}
      <MerchantHoldsFilterBar
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Table */}
      <Box
        bg="white"
        borderRadius="xl"
        boxShadow="0 2px 8px rgba(0,0,0,0.05)"
        borderWidth="1px"
        borderColor="gray.200"
        overflowX="auto"
      >
        <MerchantHoldsTable
          holds={filteredHolds}
          onReleaseHold={handleReleaseHold}
        />
      </Box>

      {/* Place Hold Modal */}
      <PlaceHoldModal
        isOpen={isPlaceHoldModalOpen}
        onClose={() => setIsPlaceHoldModalOpen(false)}
        onPlaceHold={(holdData) => {
          const newHold: MerchantHold = {
            id: String(merchantHolds.length + 1),
            dbaName: holdData.dbaName,
            mid: holdData.mid,
            holdType: 'Manual',
            reason: holdData.reason,
            datePlaced: new Date(),
            placedBy: 'analyst',
            placedByName: 'Current User',
            holdStatus: 'Active',
            expirationDate: holdData.expirationDate,
          };
          setMerchantHolds(prev => [newHold, ...prev]);
          setIsPlaceHoldModalOpen(false);
        }}
      />
    </VStack>
  );
}

