'use client';
import React from 'react';
import {
  Box,
  HStack,
  VStack,
  Select,
  Input,
  Text,
  createListCollection,
  Button,
  Badge,
  Portal,
  Popover,
} from '@chakra-ui/react';
import { X, ChevronDown } from 'lucide-react';
import { ManagerQueueFilters as FilterState } from '../types';

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

interface ManagerQueueFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export default function ManagerQueueFilters({
  filters,
  onFiltersChange,
}: ManagerQueueFiltersProps) {
  const dateRangeCollection = createListCollection({
    items: [
      { label: 'Today', value: 'today' },
      { label: 'Last 7 days', value: '7' },
      { label: 'Last 14 days', value: '14' },
      { label: 'Last 30 days', value: '30' },
      { label: 'Custom', value: 'custom' },
    ],
  });

  const analystCollection = createListCollection({
    items: [
      { label: 'All Analysts', value: 'all' },
      { label: 'John Doe', value: 'John Doe' },
      { label: 'Jane Smith', value: 'Jane Smith' },
      { label: 'Bob Johnson', value: 'Bob Johnson' },
      { label: 'Alice Williams', value: 'Alice Williams' },
      { label: 'Unassigned', value: 'unassigned' },
    ],
  });

  const processorCollection = createListCollection({
    items: [
      { label: 'All Processors', value: 'all' },
      { label: 'TSYS', value: 'TSYS' },
      { label: 'FSP', value: 'FSP' },
    ],
  });

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    // If changing dateRange away from custom, clear custom dates
    if (key === 'dateRange' && value !== 'custom') {
      delete newFilters.customStartDate;
      delete newFilters.customEndDate;
    }
    onFiltersChange(newFilters);
  };

  const clearFilter = (key: keyof FilterState) => {
    const defaultValues: Partial<FilterState> = {
      dateRange: 'today',
      analyst: 'all',
      processor: 'all',
      mcc: '',
      mid: '',
    };
    updateFilter(key, defaultValues[key]);
  };

  const hasActiveFilters = 
    filters.dateRange !== 'today' ||
    filters.analyst !== 'all' ||
    filters.processor !== 'all' ||
    filters.mcc !== '' ||
    filters.mid !== '';

  return (
    <Box
      bg="white"
      p={4}
      borderRadius="xl"
      boxShadow="0 2px 8px rgba(0,0,0,0.05)"
      borderWidth="1px"
      borderColor="gray.200"
    >
      <HStack gap={3} flexWrap="wrap" align="end">
        {/* Date Range */}
        <VStack align="start" gap={1} minW="150px">
          <Text fontSize="xs" color="gray.600">
            Date Range
          </Text>
          <Select.Root
            collection={dateRangeCollection}
            value={[filters.dateRange]}
            onValueChange={(e) => updateFilter('dateRange', e.value[0])}
            size="sm"
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
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </VStack>

        {filters.dateRange === 'custom' && (
          <>
            <VStack align="start" gap={1} minW="150px">
              <Text fontSize="xs" color="gray.600">
                From
              </Text>
              <Input
                type="text"
                size="sm"
                value={formatDateForDisplay(filters.customStartDate)}
                onChange={(e) => {
                  const formatted = formatDateForStorage(e.target.value);
                  updateFilter('customStartDate', formatted);
                }}
                placeholder="MM/DD/YYYY"
              />
            </VStack>
            <VStack align="start" gap={1} minW="150px">
              <Text fontSize="xs" color="gray.600">
                To
              </Text>
              <Input
                type="text"
                size="sm"
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

        {/* Analyst */}
        <VStack align="start" gap={1} minW="150px">
          <Text fontSize="xs" color="gray.600">
            Analyst
          </Text>
          <Select.Root
            collection={analystCollection}
            value={[filters.analyst]}
            onValueChange={(e) => updateFilter('analyst', e.value[0])}
            size="sm"
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
                  {analystCollection.items.map((item) => (
                    <Select.Item item={item} key={item.value}>
                      {item.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </VStack>

        {/* Processor */}
        <VStack align="start" gap={1} minW="120px">
          <Text fontSize="xs" color="gray.600">
            Processor
          </Text>
          <Select.Root
            collection={processorCollection}
            value={[filters.processor]}
            onValueChange={(e) => updateFilter('processor', e.value[0])}
            size="sm"
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
                  {processorCollection.items.map((item) => (
                    <Select.Item item={item} key={item.value}>
                      {item.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </VStack>

        {/* MCC Search */}
        <VStack align="start" gap={1} minW="120px">
          <Text fontSize="xs" color="gray.600">
            MCC
          </Text>
          <Input
            type="text"
            size="sm"
            placeholder="Search MCC"
            value={filters.mcc}
            onChange={(e) => updateFilter('mcc', e.target.value)}
          />
        </VStack>

        {/* MID Search */}
        <VStack align="start" gap={1} minW="150px">
          <Text fontSize="xs" color="gray.600">
            MID
          </Text>
          <Input
            type="text"
            size="sm"
            placeholder="Search MID"
            value={filters.mid}
            onChange={(e) => updateFilter('mid', e.target.value)}
          />
        </VStack>

        {/* Clear All */}
        {hasActiveFilters && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              onFiltersChange({
                dateRange: 'today',
                analyst: 'all',
                processor: 'all',
                mcc: '',
                mid: '',
              });
            }}
          >
            Clear all
          </Button>
        )}
      </HStack>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <HStack gap={2} mt={3} flexWrap="wrap">
          {filters.dateRange !== 'today' && (
            <Badge
              colorPalette="blue"
              variant="subtle"
              px={2}
              py={1}
              borderRadius="md"
              display="flex"
              alignItems="center"
              gap={1}
            >
              Date: {filters.dateRange === 'custom'
                ? `Custom${filters.customStartDate && filters.customEndDate ? ` (${formatDateForDisplay(filters.customStartDate)} - ${formatDateForDisplay(filters.customEndDate)})` : ''}`
                : filters.dateRange === 'today' ? 'Today' : `Last ${filters.dateRange} days`}
              <Button
                size="xs"
                variant="ghost"
                onClick={() => clearFilter('dateRange')}
                minW="auto"
                h="auto"
                p={0}
              >
                <X size={12} />
              </Button>
            </Badge>
          )}
          {filters.analyst !== 'all' && (
            <Badge
              colorPalette="blue"
              variant="subtle"
              px={2}
              py={1}
              borderRadius="md"
              display="flex"
              alignItems="center"
              gap={1}
            >
              Analyst: {filters.analyst === 'unassigned' ? 'Unassigned' : filters.analyst}
              <Button
                size="xs"
                variant="ghost"
                onClick={() => clearFilter('analyst')}
                minW="auto"
                h="auto"
                p={0}
              >
                <X size={12} />
              </Button>
            </Badge>
          )}
          {filters.processor !== 'all' && (
            <Badge
              colorPalette="blue"
              variant="subtle"
              px={2}
              py={1}
              borderRadius="md"
              display="flex"
              alignItems="center"
              gap={1}
            >
              Processor: {filters.processor}
              <Button
                size="xs"
                variant="ghost"
                onClick={() => clearFilter('processor')}
                minW="auto"
                h="auto"
                p={0}
              >
                <X size={12} />
              </Button>
            </Badge>
          )}
          {filters.mcc && (
            <Badge
              colorPalette="blue"
              variant="subtle"
              px={2}
              py={1}
              borderRadius="md"
              display="flex"
              alignItems="center"
              gap={1}
            >
              MCC: {filters.mcc}
              <Button
                size="xs"
                variant="ghost"
                onClick={() => clearFilter('mcc')}
                minW="auto"
                h="auto"
                p={0}
              >
                <X size={12} />
              </Button>
            </Badge>
          )}
          {filters.mid && (
            <Badge
              colorPalette="blue"
              variant="subtle"
              px={2}
              py={1}
              borderRadius="md"
              display="flex"
              alignItems="center"
              gap={1}
            >
              MID: {filters.mid}
              <Button
                size="xs"
                variant="ghost"
                onClick={() => clearFilter('mid')}
                minW="auto"
                h="auto"
                p={0}
              >
                <X size={12} />
              </Button>
            </Badge>
          )}
        </HStack>
      )}
    </Box>
  );
}

