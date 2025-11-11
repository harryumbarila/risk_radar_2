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
  createListCollection,
} from '@chakra-ui/react';
import { X } from 'lucide-react';
import type { RiskLevel, Source } from '../../utils/mockData';
import { getRuleName } from '../../utils/ruleNames';
import RuleLabel from '../rule-label/rule-label';

export interface FilterState {
  dateRange: '7' | '14' | '30' | 'custom';
  customStartDate?: string;
  customEndDate?: string;
  riskLevel: 'all' | RiskLevel;
  source: 'all' | Source;
  ruleId: 'all' | string;
  week?: number; // For week filter from chart click
  hourRange?: { day: number; hour: number }; // For heatmap click
}

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableRules: string[];
}

export default function FilterBar({
  filters,
  onFiltersChange,
  availableRules,
}: FilterBarProps) {
  // Create collections for Select components
  const dateRangeCollection = createListCollection({
    items: [
      { label: 'Last 7 days', value: '7' },
      { label: 'Last 14 days', value: '14' },
      { label: 'Last 30 days', value: '30' },
      { label: 'Custom', value: 'custom' },
    ],
  });

  const riskLevelCollection = createListCollection({
    items: [
      { label: 'All', value: 'all' },
      { label: 'High', value: 'high' },
      { label: 'Medium', value: 'medium' },
      { label: 'Low', value: 'low' },
    ],
  });

  const sourceCollection = createListCollection({
    items: [
      { label: 'All', value: 'all' },
      { label: 'TSYS', value: 'TSYS' },
      { label: 'Fluidpay', value: 'Fluidpay' },
      { label: 'Paya', value: 'Paya' },
      { label: 'Other', value: 'Other' },
    ],
  });

  const ruleCollection = React.useMemo(
    () =>
      createListCollection({
        items: [
          { label: 'All', value: 'all' },
          ...availableRules.map((rule) => ({ 
            label: rule, 
            value: rule,
            description: getRuleName(rule), // Store full name for tooltip
          })),
        ],
      }),
    [availableRules]
  );

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilter = (key: keyof FilterState) => {
    const newFilters = { ...filters };
    if (key === 'dateRange') {
      newFilters.dateRange = '7';
      delete newFilters.customStartDate;
      delete newFilters.customEndDate;
    } else if (key === 'riskLevel') {
      newFilters.riskLevel = 'all';
    } else if (key === 'source') {
      newFilters.source = 'all';
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
      riskLevel: 'all',
      source: 'all',
      ruleId: 'all',
    });
  };

  const hasActiveFilters =
    filters.dateRange !== '7' ||
    filters.riskLevel !== 'all' ||
    filters.source !== 'all' ||
    filters.ruleId !== 'all' ||
    filters.week !== undefined ||
    filters.hourRange !== undefined;

  // Count active filters
  const activeFilterCount = [
    filters.dateRange !== '7',
    filters.riskLevel !== 'all',
    filters.source !== 'all',
    filters.ruleId !== 'all',
    filters.week !== undefined,
    filters.hourRange !== undefined,
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
      borderColor="gray.200"
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
                const value = (e.value[0] || '7') as FilterState['dateRange'];
                updateFilter('dateRange', value);
                if (value !== 'custom') {
                  const newFilters = { ...filters };
                  delete newFilters.customStartDate;
                  delete newFilters.customEndDate;
                  onFiltersChange(newFilters);
                }
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
                  From
                </Text>
                <Input
                  type="date"
                  size="sm"
                  width="150px"
                  value={filters.customStartDate || ''}
                  onChange={(e) => updateFilter('customStartDate', e.target.value)}
                />
              </VStack>
              <VStack align="start" gap={1}>
                <Text fontSize="xs" color="gray.600">
                  To
                </Text>
                <Input
                  type="date"
                  size="sm"
                  width="150px"
                  value={filters.customEndDate || ''}
                  onChange={(e) => updateFilter('customEndDate', e.target.value)}
                />
              </VStack>
            </>
          )}

          {/* Risk Level */}
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600">
              Risk Level
            </Text>
            <Select.Root
              collection={riskLevelCollection}
              value={[filters.riskLevel || 'all']}
              onValueChange={(e) =>
                updateFilter('riskLevel', (e.value[0] || 'all') as FilterState['riskLevel'])
              }
              size="sm"
              width="140px"
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
                    {riskLevelCollection.items.map((item) => (
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

          {/* Source */}
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600">
              Source/Processor
            </Text>
            <Select.Root
              collection={sourceCollection}
              value={[filters.source || 'all']}
              onValueChange={(e) =>
                updateFilter('source', (e.value[0] || 'all') as FilterState['source'])
              }
              size="sm"
              width="140px"
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

          {/* Rule Type */}
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600">
              Rule Type
            </Text>
            <Select.Root
              collection={ruleCollection}
              value={[filters.ruleId || 'all']}
              onValueChange={(e) =>
                updateFilter('ruleId', (e.value[0] || 'all') as FilterState['ruleId'])
              }
              size="sm"
              width="140px"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  {filters.ruleId !== 'all' ? (
                    <RuleLabel ruleId={filters.ruleId} fontSize="sm" />
                  ) : (
                    <Select.ValueText />
                  )}
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {ruleCollection.items.map((item) => (
                      <Select.Item item={item} key={item.value}>
                        <HStack justify="space-between" w="full">
                          <VStack align="start" gap={0}>
                            <Text fontSize="sm">{item.label}</Text>
                            {item.description && item.value !== 'all' && (
                              <Text fontSize="xs" color="gray.500">
                                {item.description}
                              </Text>
                            )}
                          </VStack>
                          <Select.ItemIndicator />
                        </HStack>
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </VStack>
        </HStack>

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <HStack gap={2} flexWrap="wrap">
            {filters.dateRange !== '7' && (
              <Badge
                colorPalette="blue"
                variant="subtle"
                px={2}
                py={1}
                borderRadius="md"
              >
                {filters.dateRange === 'custom'
                  ? `Custom`
                  : `Last ${filters.dateRange} days`}
                <Button
                  size="xs"
                  variant="ghost"
                  ml={2}
                  onClick={() => clearFilter('dateRange')}
                  aria-label="Remove date filter"
                >
                  <X size={12} />
                </Button>
              </Badge>
            )}
            {filters.riskLevel !== 'all' && (
              <Badge
                colorPalette="red"
                variant="subtle"
                px={2}
                py={1}
                borderRadius="md"
              >
                Risk: {filters.riskLevel === 'high' ? 'High' : filters.riskLevel === 'medium' ? 'Medium' : 'Low'}
                <Button
                  size="xs"
                  variant="ghost"
                  ml={2}
                  onClick={() => clearFilter('riskLevel')}
                  aria-label="Remove risk filter"
                >
                  <X size={12} />
                </Button>
              </Badge>
            )}
            {filters.source !== 'all' && (
              <Badge
                colorPalette="purple"
                variant="subtle"
                px={2}
                py={1}
                borderRadius="md"
              >
                Source: {filters.source}
                <Button
                  size="xs"
                  variant="ghost"
                  ml={2}
                  onClick={() => clearFilter('source')}
                  aria-label="Remove source filter"
                >
                  <X size={12} />
                </Button>
              </Badge>
            )}
            {filters.ruleId !== 'all' && (
              <Badge
                colorPalette="orange"
                variant="subtle"
                px={2}
                py={1}
                borderRadius="md"
              >
                Rule: <RuleLabel ruleId={filters.ruleId} fontSize="xs" />
                <Button
                  size="xs"
                  variant="ghost"
                  ml={2}
                  onClick={() => clearFilter('ruleId')}
                  aria-label="Remove rule filter"
                >
                  <X size={12} />
                </Button>
              </Badge>
            )}
            {filters.week !== undefined && (
              <Badge
                colorPalette="teal"
                variant="subtle"
                px={2}
                py={1}
                borderRadius="md"
              >
                Week {filters.week}
                <Button
                  size="xs"
                  variant="ghost"
                  ml={2}
                  onClick={() => clearFilter('week')}
                  aria-label="Remove week filter"
                >
                  <X size={12} />
                </Button>
              </Badge>
            )}
            {filters.hourRange && (
              <Badge
                colorPalette="cyan"
                variant="subtle"
                px={2}
                py={1}
                borderRadius="md"
              >
                Day {filters.hourRange.day}, Hour {filters.hourRange.hour}
                <Button
                  size="xs"
                  variant="ghost"
                  ml={2}
                  onClick={() => clearFilter('hourRange')}
                  aria-label="Remove hour filter"
                >
                  <X size={12} />
                </Button>
              </Badge>
            )}
          </HStack>
        )}
      </VStack>
    </Box>
  );
}

