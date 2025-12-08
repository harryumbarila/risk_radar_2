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

  const queueTypeCollection = createListCollection({
    items: [
      { label: 'All', value: 'all' },
      { label: 'Needs Review', value: 'needs-review' },
      { label: 'Escalations', value: 'escalations' },
      { label: 'Pending Assignment', value: 'pending-assignment' },
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
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilter = (key: keyof FilterState) => {
    const defaultValues: Partial<FilterState> = {
      dateRange: 'today',
      analyst: 'all',
      queueType: 'all',
      processor: 'all',
      mcc: '',
      mid: '',
    };
    updateFilter(key, defaultValues[key]);
  };

  const hasActiveFilters = 
    filters.dateRange !== 'today' ||
    filters.analyst !== 'all' ||
    filters.queueType !== 'all' ||
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

        {/* Queue Type */}
        <VStack align="start" gap={1} minW="150px">
          <Text fontSize="xs" color="gray.600">
            Queue Type
          </Text>
          <Select.Root
            collection={queueTypeCollection}
            value={[filters.queueType]}
            onValueChange={(e) => updateFilter('queueType', e.value[0])}
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
                  {queueTypeCollection.items.map((item) => (
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
                queueType: 'all',
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
                ? `${filters.customStartDate ? new Date(filters.customStartDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : ''} - ${filters.customEndDate ? new Date(filters.customEndDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : ''}`
                : filters.dateRange === 'today'
                ? 'Today'
                : `Last ${filters.dateRange} days`}
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
          {filters.queueType !== 'all' && (
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
              Queue: {queueTypeCollection.items.find(i => i.value === filters.queueType)?.label}
              <Button
                size="xs"
                variant="ghost"
                onClick={() => clearFilter('queueType')}
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

