'use client';
import React from 'react';
import { Box, HStack, VStack, Text, Input, Select, createListCollection, Badge, Button, Portal } from '@chakra-ui/react';
import { X, Search } from 'lucide-react';

// Helper functions to format dates between YYYY-MM-DD (internal) and MM/DD/YYYY (display)
const formatDateForDisplay = (dateString: string | undefined): string => {
  if (!dateString) return '';
  // If already in MM/DD/YYYY format, return as is
  if (dateString.includes('/')) return dateString;
  // Convert from YYYY-MM-DD to MM/DD/YYYY
  const [year, month, day] = dateString.split('-');
  if (year && month && day) {
    return `${month}/${day}/${year}`;
  }
  return dateString;
};

const formatDateForStorage = (dateString: string): string => {
  if (!dateString) return '';
  // If already in YYYY-MM-DD format, return as is
  if (dateString.includes('-') && dateString.length === 10) return dateString;
  // Convert from MM/DD/YYYY to YYYY-MM-DD
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const [month, day, year] = parts;
    if (month && day && year) {
      // Pad with zeros if needed
      const paddedMonth = month.padStart(2, '0');
      const paddedDay = day.padStart(2, '0');
      return `${year}-${paddedMonth}-${paddedDay}`;
    }
  }
  return dateString;
};

export interface MerchantHoldsFilterState {
  dateRange: 'all' | 'today' | '7' | '14' | '30' | 'custom';
  customStartDate?: string;
  customEndDate?: string;
  holdType: 'all' | 'Manual' | 'Auto-Hold';
  source: 'all' | 'analyst' | 'system';
  search: string;
}

interface MerchantHoldsFilterBarProps {
  filters: MerchantHoldsFilterState;
  onFiltersChange: (filters: MerchantHoldsFilterState) => void;
}

export default function MerchantHoldsFilterBar({
  filters,
  onFiltersChange,
}: MerchantHoldsFilterBarProps) {
  const dateRangeCollection = createListCollection({
    items: [
      { label: 'All Time', value: 'all' },
      { label: 'Today', value: 'today' },
      { label: 'Last 7 days', value: '7' },
      { label: 'Last 14 days', value: '14' },
      { label: 'Last 30 days', value: '30' },
      { label: 'Custom', value: 'custom' },
    ],
  });

  const holdTypeCollection = createListCollection({
    items: [
      { label: 'All Types', value: 'all' },
      { label: 'Manual', value: 'Manual' },
      { label: 'Auto-Hold', value: 'Auto-Hold' },
    ],
  });

  const sourceCollection = createListCollection({
    items: [
      { label: 'All Sources', value: 'all' },
      { label: 'Analyst', value: 'analyst' },
      { label: 'System', value: 'system' },
    ],
  });

  const updateFilter = <K extends keyof MerchantHoldsFilterState>(
    key: K,
    value: MerchantHoldsFilterState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilter = (key: keyof MerchantHoldsFilterState) => {
    if (key === 'dateRange') {
      const newFilters = { ...filters, dateRange: 'all' as const };
      delete newFilters.customStartDate;
      delete newFilters.customEndDate;
      onFiltersChange(newFilters);
    } else {
      const defaults: MerchantHoldsFilterState = {
        dateRange: 'all',
        holdType: 'all',
        source: 'all',
        search: '',
      };
      updateFilter(key, defaults[key]);
    }
  };

  const clearAll = () => {
    onFiltersChange({
      dateRange: 'all',
      holdType: 'all',
      source: 'all',
      search: '',
    });
  };

  const hasActiveFilters =
    filters.dateRange !== 'all' ||
    filters.holdType !== 'all' ||
    filters.source !== 'all' ||
    filters.search !== '';

  const activeFilterCount = [
    filters.dateRange !== 'all',
    filters.holdType !== 'all',
    filters.source !== 'all',
    filters.search !== '',
  ].filter(Boolean).length;

  return (
    <Box
      bg="white"
      p={4}
      borderRadius="xl"
      boxShadow="0 2px 8px rgba(0,0,0,0.05)"
      borderWidth="1px"
      borderColor="gray.200"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <VStack align="stretch" gap={4}>
        {/* Filter Controls */}
        <HStack gap={4} flexWrap="wrap">
          {/* Date Range */}
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600">
              Date Range
            </Text>
            <Select.Root
              collection={dateRangeCollection}
              value={[filters.dateRange]}
              onValueChange={(e) => {
                const value = (e.value[0] || 'all') as MerchantHoldsFilterState['dateRange'];
                const newFilters = { ...filters, dateRange: value };
                if (value !== 'custom') {
                  delete newFilters.customStartDate;
                  delete newFilters.customEndDate;
                }
                onFiltersChange(newFilters);
              }}
              size="sm"
              width="150px"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {dateRangeCollection.items.map((item) => (
                      <Select.Item item={item} key={item.value}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </VStack>

          {filters.dateRange === 'custom' && (
            <>
              <VStack align="start" gap={1}>
                <Text fontSize="xs" color="gray.600">
                  From
                </Text>
                <Input
                  type="text"
                  size="sm"
                  width="150px"
                  value={formatDateForDisplay(filters.customStartDate)}
                  onChange={(e) => {
                    const formatted = formatDateForStorage(e.target.value);
                    updateFilter('customStartDate', formatted);
                  }}
                  placeholder="MM/DD/YYYY"
                />
              </VStack>
              <VStack align="start" gap={1}>
                <Text fontSize="xs" color="gray.600">
                  To
                </Text>
                <Input
                  type="text"
                  size="sm"
                  width="150px"
                  value={formatDateForDisplay(filters.customEndDate)}
                  onChange={(e) => {
                    const formatted = formatDateForStorage(e.target.value);
                    updateFilter('customEndDate', formatted);
                  }}
                  placeholder="MM/DD/YYYY"
                />
              </VStack>
            </>
          )}

          {/* Hold Type */}
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600">
              Hold Type
            </Text>
            <Select.Root
              collection={holdTypeCollection}
              value={[filters.holdType]}
              onValueChange={(e) => updateFilter('holdType', (e.value[0] || 'all') as MerchantHoldsFilterState['holdType'])}
              size="sm"
              width="150px"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Select.Positioner>
                <Select.Content>
                  {holdTypeCollection.items.map((item) => (
                    <Select.Item item={item} key={item.value}>
                      {item.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
          </VStack>

          {/* Source */}
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600">
              Source
            </Text>
            <Select.Root
              collection={sourceCollection}
              value={[filters.source]}
              onValueChange={(e) => updateFilter('source', (e.value[0] || 'all') as MerchantHoldsFilterState['source'])}
              size="sm"
              width="150px"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Select.Positioner>
                <Select.Content>
                  {sourceCollection.items.map((item) => (
                    <Select.Item item={item} key={item.value}>
                      {item.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
          </VStack>

          {/* MID Search */}
          <VStack align="start" gap={1} flex={1} minW="200px">
            <Text fontSize="xs" color="gray.600">
              Search MID
            </Text>
            <HStack gap={2} w="full">
              <Box position="relative" flex={1}>
                <Box
                  position="absolute"
                  left={3}
                  top="50%"
                  transform="translateY(-50%)"
                  color="gray.400"
                  pointerEvents="none"
                >
                  <Search size={16} />
                </Box>
                <Input
                  pl={10}
                  placeholder="Search by MID..."
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  size="sm"
                />
              </Box>
              {filters.search && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => clearFilter('search')}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </Button>
              )}
            </HStack>
          </VStack>
        </HStack>

        {/* Active Filters */}
        {hasActiveFilters && (
          <HStack gap={2} flexWrap="wrap">
            <Text fontSize="xs" color="gray.600" fontWeight="medium">
              Active filters ({activeFilterCount}):
            </Text>
            {filters.dateRange !== 'all' && (
              <Badge
                colorPalette="blue"
                variant="subtle"
                px={2}
                py={1}
                borderRadius="md"
                fontSize="xs"
              >
                Date: {filters.dateRange === 'custom'
                  ? `Custom${filters.customStartDate && filters.customEndDate ? ` (${formatDateForDisplay(filters.customStartDate)} - ${formatDateForDisplay(filters.customEndDate)})` : ''}`
                  : dateRangeCollection.items.find(i => i.value === filters.dateRange)?.label}
                <Button
                  size="xs"
                  variant="ghost"
                  ml={1}
                  onClick={() => clearFilter('dateRange')}
                  aria-label="Clear date range"
                >
                  <X size={12} />
                </Button>
              </Badge>
            )}
            {filters.holdType !== 'all' && (
              <Badge
                colorPalette="blue"
                variant="subtle"
                px={2}
                py={1}
                borderRadius="md"
                fontSize="xs"
              >
                Type: {filters.holdType}
                <Button
                  size="xs"
                  variant="ghost"
                  ml={1}
                  onClick={() => clearFilter('holdType')}
                  aria-label="Clear hold type"
                >
                  <X size={12} />
                </Button>
              </Badge>
            )}
            {filters.source !== 'all' && (
              <Badge
                colorPalette="blue"
                variant="subtle"
                px={2}
                py={1}
                borderRadius="md"
                fontSize="xs"
              >
                Source: {filters.source === 'analyst' ? 'Analyst' : 'System'}
                <Button
                  size="xs"
                  variant="ghost"
                  ml={1}
                  onClick={() => clearFilter('source')}
                  aria-label="Clear source"
                >
                  <X size={12} />
                </Button>
              </Badge>
            )}
            {filters.search && (
              <Badge
                colorPalette="blue"
                variant="subtle"
                px={2}
                py={1}
                borderRadius="md"
                fontSize="xs"
              >
                Search: {filters.search}
                <Button
                  size="xs"
                  variant="ghost"
                  ml={1}
                  onClick={() => clearFilter('search')}
                  aria-label="Clear search"
                >
                  <X size={12} />
                </Button>
              </Badge>
            )}
            <Button
              size="xs"
              variant="ghost"
              colorPalette="gray"
              onClick={clearAll}
            >
              Clear all
            </Button>
          </HStack>
        )}
      </VStack>
    </Box>
  );
}

