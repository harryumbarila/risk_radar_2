'use client';
import React from 'react';
import {
  Box,
  HStack,
  VStack,
  Button,
  Badge,
  Select,
  Input,
  Text,
  Flex,
  Portal,
  Popover,
  Checkbox,
  createListCollection,
} from '@chakra-ui/react';
import { X, Search, ChevronDown } from 'lucide-react';
import { getRuleName } from '@/libs/domain/dashboard/utils/ruleNames';
import RuleLabel from '@/libs/domain/dashboard/components/rule-label/rule-label';

export interface AutoHoldFilterState {
  dateRange: '7' | '14' | '30' | 'custom';
  customStartDate?: string;
  customEndDate?: string;
  status: 'all' | 'Unreviewed' | 'In Progress' | 'Reviewed';
  processor: 'all' | string;
  source: 'all' | string;
  dataSource: 'all' | 'Auth' | 'Capture' | 'Settled' | 'Returns';
  merchant: string;
  mid: string;
  mcc: string;
  ruleId: 'all' | string[];
}

interface AutoHoldFilterBarProps {
  filters: AutoHoldFilterState;
  onFiltersChange: (filters: AutoHoldFilterState) => void;
  availableRules?: string[];
}

export default function AutoHoldFilterBar({
  filters,
  onFiltersChange,
  availableRules = [],
}: AutoHoldFilterBarProps) {
  const selectedRules = Array.isArray(filters.ruleId) ? filters.ruleId : (filters.ruleId === 'all' ? [] : [filters.ruleId]);
  // Create collections for Select components
  const dateRangeCollection = createListCollection({
    items: [
      { label: 'Last 7 days', value: '7' },
      { label: 'Last 14 days', value: '14' },
      { label: 'Last 30 days', value: '30' },
      { label: 'Custom', value: 'custom' },
    ],
  });

  const statusCollection = createListCollection({
    items: [
      { label: 'All Statuses', value: 'all' },
      { label: 'Unreviewed', value: 'Unreviewed' },
      { label: 'In Progress', value: 'In Progress' },
      { label: 'Reviewed', value: 'Reviewed' },
    ],
  });

  const processorCollection = createListCollection({
    items: [
      { label: 'All Processors', value: 'all' },
      { label: 'TSYS', value: 'TSYS' },
      { label: 'FSP', value: 'FSP' },
    ],
  });

  const sourceCollection = createListCollection({
    items: [
      { label: 'All Sources', value: 'all' },
      { label: 'Talus Pay', value: 'Talus Pay' },
      { label: 'Global365', value: 'Global365' },
      { label: 'SIT', value: 'SIT' },
      { label: 'SC Flow', value: 'SC Flow' },
    ],
  });

  const dataSourceCollection = createListCollection({
    items: [
      { label: 'All Data Sources', value: 'all' },
      { label: 'Auth', value: 'Auth' },
      { label: 'Capture', value: 'Capture' },
      { label: 'Settled', value: 'Settled' },
      { label: 'Returns', value: 'Returns' },
    ],
  });

  const updateFilter = <K extends keyof AutoHoldFilterState>(
    key: K,
    value: AutoHoldFilterState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilter = (key: keyof AutoHoldFilterState) => {
    const newFilters = { ...filters };
    if (key === 'dateRange') {
      newFilters.dateRange = '7';
      delete newFilters.customStartDate;
      delete newFilters.customEndDate;
    } else if (key === 'status') {
      newFilters.status = 'all';
    } else if (key === 'processor') {
      newFilters.processor = 'all';
    } else if (key === 'source') {
      newFilters.source = 'all';
    } else if (key === 'dataSource') {
      newFilters.dataSource = 'all';
    } else if (key === 'mid') {
      newFilters.mid = '';
    } else if (key === 'mcc') {
      newFilters.mcc = '';
    } else if (key === 'ruleId') {
      newFilters.ruleId = 'all';
    } else {
      delete newFilters[key];
    }
    onFiltersChange(newFilters);
  };

  const clearAll = () => {
    onFiltersChange({
      dateRange: '7',
      status: 'all',
      processor: 'all',
      source: 'all',
      dataSource: 'all',
      merchant: '',
      mid: '',
      mcc: '',
      ruleId: 'all',
    });
  };

  const hasActiveFilters =
    filters.dateRange !== '7' ||
    filters.status !== 'all' ||
    filters.processor !== 'all' ||
    filters.source !== 'all' ||
    filters.dataSource !== 'all' ||
    filters.mid !== '' ||
    filters.mcc !== '' ||
    (Array.isArray(filters.ruleId) ? filters.ruleId.length > 0 : filters.ruleId !== 'all') ||
    filters.customStartDate !== undefined ||
    filters.customEndDate !== undefined;

  // Count active filters
  const activeFilterCount = [
    filters.dateRange !== '7',
    filters.status !== 'all',
    filters.processor !== 'all',
    filters.dataSource !== 'all',
    filters.source !== 'all',
    filters.mid !== '',
    filters.mcc !== '',
    (Array.isArray(filters.ruleId) ? filters.ruleId.length > 0 : filters.ruleId !== 'all'),
    filters.customStartDate !== undefined,
    filters.customEndDate !== undefined,
  ].filter(Boolean).length;

  return (
    <Box
      position="sticky"
      top={0}
      zIndex={1000}
      bg="white"
      borderBottom="1px"
      borderColor="gray.200"
      py={4}
      px={6}
      boxShadow="0 2px 8px rgba(0,0,0,0.05)"
      borderRadius="xl"
      borderWidth="1px"
      mb={4}
    >
      <VStack align="stretch" gap={4}>
        <Flex justify="space-between" align="center">
          <HStack gap={3}>
            <Text fontSize="lg" fontWeight="bold">
              Filters
            </Text>
            {hasActiveFilters && (
              <Badge colorPalette="blue" variant="solid" px={2} py={1}>
                {activeFilterCount} active
              </Badge>
            )}
          </HStack>
          {hasActiveFilters && (
            <Button size="sm" variant="ghost" onClick={clearAll}>
              Clear all
            </Button>
          )}
        </Flex>

        <HStack gap={4} flexWrap="wrap">
          {/* Date Range */}
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600">
              Date Range
            </Text>
            <Select.Root
              collection={dateRangeCollection}
              value={[filters.dateRange || '7']}
              onValueChange={(e) => {
                const value = (e.value[0] || '7') as AutoHoldFilterState['dateRange'];
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
                <Select.Trigger suppressHydrationWarning>
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
              <VStack align="start" gap={1}>
                <Text fontSize="xs" color="gray.600">
                  Start Date
                </Text>
                <Input
                  type="date"
                  size="sm"
                  width="150px"
                  value={filters.customStartDate || ''}
                  onChange={(e) =>
                    updateFilter('customStartDate', e.target.value)
                  }
                  suppressHydrationWarning
                />
              </VStack>
              <VStack align="start" gap={1}>
                <Text fontSize="xs" color="gray.600">
                  End Date
                </Text>
                <Input
                  type="date"
                  size="sm"
                  width="150px"
                  value={filters.customEndDate || ''}
                  onChange={(e) =>
                    updateFilter('customEndDate', e.target.value)
                  }
                  suppressHydrationWarning
                />
              </VStack>
            </>
          )}

          {/* Status Filter */}
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600">
              Status
            </Text>
            <Select.Root
              collection={statusCollection}
              value={[filters.status || 'all']}
              onValueChange={(e) => {
                updateFilter('status', (e.value[0] || 'all') as AutoHoldFilterState['status']);
              }}
              size="sm"
              width="150px"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger suppressHydrationWarning>
                  <Select.ValueText />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {statusCollection.items.map((item) => (
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

          {/* Processor Filter */}
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600">
              Processor
            </Text>
            <Select.Root
              collection={processorCollection}
              value={[filters.processor || 'all']}
              onValueChange={(e) => {
                updateFilter('processor', e.value[0] || 'all');
              }}
              size="sm"
              width="150px"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger suppressHydrationWarning>
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

          {/* Source Filter */}
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600">
              Source
            </Text>
            <Select.Root
              collection={sourceCollection}
              value={[filters.source || 'all']}
              onValueChange={(e) => {
                updateFilter('source', e.value[0] || 'all');
              }}
              size="sm"
              width="150px"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger suppressHydrationWarning>
                  <Select.ValueText />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {sourceCollection.items.map((item) => (
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

          {/* Data Source Filter */}
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600">
              Data Source
            </Text>
            <Select.Root
              collection={dataSourceCollection}
              value={[filters.dataSource || 'all']}
              onValueChange={(e) => {
                updateFilter('dataSource', (e.value[0] || 'all') as AutoHoldFilterState['dataSource']);
              }}
              size="sm"
              width="150px"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger suppressHydrationWarning>
                  <Select.ValueText />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {dataSourceCollection.items.map((item) => (
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

          {/* MID Search */}
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600">
              MID
            </Text>
            <Box position="relative" width="150px">
              <Box
                position="absolute"
                left={3}
                top="50%"
                transform="translateY(-50%)"
                zIndex={1}
                pointerEvents="none"
                color="gray.400"
              >
                <Search size={16} />
              </Box>
              <Input
                size="sm"
                placeholder="Search MID..."
                value={filters.mid || ''}
                onChange={(e) => updateFilter('mid', e.target.value)}
                pl={10}
                suppressHydrationWarning
              />
            </Box>
          </VStack>

          {/* MCC Search */}
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600">
              MCC
            </Text>
            <Box position="relative" width="150px">
              <Box
                position="absolute"
                left={3}
                top="50%"
                transform="translateY(-50%)"
                zIndex={1}
                pointerEvents="none"
                color="gray.400"
              >
                <Search size={16} />
              </Box>
              <Input
                size="sm"
                placeholder="Search MCC..."
                value={filters.mcc || ''}
                onChange={(e) => updateFilter('mcc', e.target.value)}
                pl={10}
                suppressHydrationWarning
              />
            </Box>
          </VStack>

          {/* Rule Type - Multi Select */}
          {availableRules.length > 0 && (
            <VStack align="start" gap={1}>
              <Text fontSize="xs" color="gray.600">
                Rule Type
              </Text>
              <Popover.Root positioning={{ placement: 'bottom-start' }}>
                <Popover.Trigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    width="200px"
                    justifyContent="space-between"
                    suppressHydrationWarning
                  >
                    <Text fontSize="sm" lineClamp={1}>
                      {selectedRules.length === 0
                        ? 'All Rules'
                        : selectedRules.length === 1 && selectedRules[0]
                        ? getRuleName(selectedRules[0])
                        : `${selectedRules.length} rules selected`}
                    </Text>
                    <ChevronDown size={16} />
                  </Button>
                </Popover.Trigger>
                <Portal>
                  <Popover.Positioner>
                    <Popover.Content width="300px" maxHeight="400px" overflowY="auto">
                      <Popover.Arrow />
                      <Popover.CloseTrigger />
                      <VStack align="stretch" gap={2} p={4}>
                        <HStack justify="space-between">
                          <Text fontWeight="bold" fontSize="sm">
                            Select Rules
                          </Text>
                          {selectedRules.length > 0 && (
                            <Button
                              size="xs"
                              variant="ghost"
                              onClick={() => updateFilter('ruleId', 'all')}
                            >
                              Clear all
                            </Button>
                          )}
                        </HStack>
                        <Box borderWidth="1px" borderRadius="md" p={2}>
                          <VStack align="stretch" gap={2}>
                            {availableRules.map((rule) => {
                              const isChecked = selectedRules.includes(rule);
                              return (
                                <HStack key={rule} gap={3} align="start">
                                  <Checkbox.Root
                                    checked={isChecked}
                                    onCheckedChange={(e) => {
                                      const checked = e.checked ?? false;
                                      const newSelected = checked
                                        ? [...selectedRules, rule]
                                        : selectedRules.filter((r) => r !== rule);
                                      updateFilter('ruleId', newSelected.length === 0 ? 'all' : newSelected);
                                    }}
                                  >
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control>
                                      <Checkbox.Indicator />
                                    </Checkbox.Control>
                                  </Checkbox.Root>
                                  <VStack align="start" gap={0} flex={1} cursor="pointer" onClick={() => {
                                    const newSelected = isChecked
                                      ? selectedRules.filter((r) => r !== rule)
                                      : [...selectedRules, rule];
                                    updateFilter('ruleId', newSelected.length === 0 ? 'all' : newSelected);
                                  }}>
                                    <Text fontSize="sm" fontWeight="medium">
                                      {rule}
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                      {getRuleName(rule)}
                                    </Text>
                                  </VStack>
                                </HStack>
                              );
                            })}
                          </VStack>
                        </Box>
                      </VStack>
                    </Popover.Content>
                  </Popover.Positioner>
                </Portal>
              </Popover.Root>
            </VStack>
          )}
        </HStack>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <HStack gap={2} mt={2} flexWrap="wrap" align="center">
            {filters.dateRange !== '7' && (
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
                  ? `${filters.customStartDate || ''} - ${filters.customEndDate || ''}`
                  : `Last ${filters.dateRange} days`}
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => clearFilter('dateRange')}
                  p={0}
                  minW="auto"
                  h="auto"
                >
                  <X size={12} />
                </Button>
              </Badge>
            )}
            {filters.status !== 'all' && (
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
                Status: {filters.status}
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => clearFilter('status')}
                  p={0}
                  minW="auto"
                  h="auto"
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
                  p={0}
                  minW="auto"
                  h="auto"
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
                display="flex"
                alignItems="center"
                gap={1}
              >
                Source: {filters.source}
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => clearFilter('source')}
                  p={0}
                  minW="auto"
                  h="auto"
                >
                  <X size={12} />
                </Button>
              </Badge>
            )}
            {filters.dataSource !== 'all' && (
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
                Data Source: {filters.dataSource}
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => clearFilter('dataSource')}
                  p={0}
                  minW="auto"
                  h="auto"
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
                  p={0}
                  minW="auto"
                  h="auto"
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
                  p={0}
                  minW="auto"
                  h="auto"
                >
                  <X size={12} />
                </Button>
              </Badge>
            )}
            {selectedRules.length > 0 && (
              <>
                {selectedRules.map((ruleId) => (
                  <Badge
                    key={ruleId}
                    colorPalette="orange"
                    variant="subtle"
                    px={2}
                    py={1}
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    Rule: <RuleLabel ruleId={ruleId} fontSize="xs" />
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => {
                        const newSelected = selectedRules.filter((r) => r !== ruleId);
                        updateFilter('ruleId', newSelected.length === 0 ? 'all' : newSelected);
                      }}
                      aria-label="Remove rule filter"
                      p={0}
                      minW="auto"
                      h="auto"
                    >
                      <X size={12} />
                    </Button>
                  </Badge>
                ))}
              </>
            )}
          </HStack>
        )}
      </VStack>
    </Box>
  );
}

