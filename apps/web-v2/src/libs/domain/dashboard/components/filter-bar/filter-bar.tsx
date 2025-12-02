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
import { X, ChevronDown } from 'lucide-react';
import { getRuleName } from '../../utils/ruleNames';
import RuleLabel from '../rule-label/rule-label';

export interface FilterState {
  dateRange: '7' | '14' | '30' | 'custom';
  customStartDate?: string;
  customEndDate?: string;
  processor: 'all' | 'TSYS' | 'FSP';
  source: 'all' | 'Talus Pay' | 'Global365' | 'SIT' | 'SC Flow';
  ruleId: 'all' | string[];
  paymentStage?: 'Authorization' | 'Capture' | 'Settlement' | 'ACH Returns';
  ruleStageParticipation?: 'all' | 'auth-only' | 'multi-stage' | 'settlement-only' | 'ach-only';
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

  const paymentStageCollection = createListCollection({
    items: [
      { label: 'Authorization', value: 'Authorization' },
      { label: 'Capture', value: 'Capture' },
      { label: 'Settlement', value: 'Settlement' },
      { label: 'ACH Returns', value: 'ACH Returns' },
    ],
  });

  const ruleStageParticipationCollection = createListCollection({
    items: [
      { label: 'All rules', value: 'all' },
      { label: 'Auth-only rules', value: 'auth-only' },
      { label: 'Multi-stage rules', value: 'multi-stage' },
      { label: 'Settlement-only rules', value: 'settlement-only' },
      { label: 'ACH-only rules', value: 'ach-only' },
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
    } else if (key === 'processor') {
      newFilters.processor = 'all';
    } else if (key === 'source') {
      newFilters.source = 'all';
    } else if (key === 'ruleId') {
      newFilters.ruleId = 'all';
    } else if (key === 'paymentStage') {
      delete newFilters.paymentStage;
    } else if (key === 'ruleStageParticipation') {
      delete newFilters.ruleStageParticipation;
    } else {
      delete newFilters[key];
    }
    onFiltersChange(newFilters);
  };

  const clearAll = () => {
    onFiltersChange({
      dateRange: '7',
      processor: 'all',
      source: 'all',
      ruleId: 'all',
      paymentStage: undefined,
      ruleStageParticipation: undefined,
    });
  };

  const selectedRules = Array.isArray(filters.ruleId) ? filters.ruleId : (filters.ruleId === 'all' ? [] : [filters.ruleId]);
  
  const hasActiveFilters =
    filters.dateRange !== '7' ||
    filters.processor !== 'all' ||
    filters.source !== 'all' ||
    (Array.isArray(filters.ruleId) ? filters.ruleId.length > 0 : filters.ruleId !== 'all') ||
    filters.paymentStage !== undefined ||
    filters.ruleStageParticipation !== undefined ||
    filters.week !== undefined ||
    filters.hourRange !== undefined;

  // Count active filters
  const activeFilterCount = [
    filters.dateRange !== '7',
    filters.processor !== 'all',
    filters.source !== 'all',
    (Array.isArray(filters.ruleId) ? filters.ruleId.length > 0 : filters.ruleId !== 'all'),
    filters.paymentStage !== undefined,
    filters.ruleStageParticipation !== undefined,
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

          {/* Processor */}
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600">
              Processor
            </Text>
            <Select.Root
              collection={processorCollection}
              value={[filters.processor || 'all']}
              onValueChange={(e) =>
                updateFilter('processor', (e.value[0] || 'all') as FilterState['processor'])
              }
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

          {/* Source */}
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600">
              Source
            </Text>
            <Select.Root
              collection={sourceCollection}
              value={[filters.source || 'all']}
              onValueChange={(e) =>
                updateFilter('source', (e.value[0] || 'all') as FilterState['source'])
              }
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

          {/* Payment Stage */}
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600">
              Payment Stage
            </Text>
            <Select.Root
              collection={paymentStageCollection}
              value={filters.paymentStage ? [filters.paymentStage] : []}
              onValueChange={(e) => {
                const value = e.value[0] as FilterState['paymentStage'];
                updateFilter('paymentStage', value);
              }}
              size="sm"
              width="150px"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="All Stages" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {paymentStageCollection.items.map((item) => (
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

          {/* Rule Stage Participation */}
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600">
              Rule Stage Participation
            </Text>
            <Select.Root
              collection={ruleStageParticipationCollection}
              value={filters.ruleStageParticipation ? [filters.ruleStageParticipation] : ['all']}
              onValueChange={(e) => {
                const value = (e.value[0] || 'all') as FilterState['ruleStageParticipation'];
                updateFilter('ruleStageParticipation', value);
              }}
              size="sm"
              width="200px"
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
                    {ruleStageParticipationCollection.items.map((item) => (
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

          {/* Rule Type - Multi Select */}
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
            {filters.processor !== 'all' && (
              <Badge
                colorPalette="blue"
                variant="subtle"
                px={2}
                py={1}
                borderRadius="md"
              >
                Processor: {filters.processor}
                <Button
                  size="xs"
                  variant="ghost"
                  ml={2}
                  onClick={() => clearFilter('processor')}
                  aria-label="Remove processor filter"
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
            {filters.paymentStage && (
              <Badge
                colorPalette="green"
                variant="subtle"
                px={2}
                py={1}
                borderRadius="md"
              >
                Payment Stage: {filters.paymentStage}
                <Button
                  size="xs"
                  variant="ghost"
                  ml={2}
                  onClick={() => clearFilter('paymentStage')}
                  aria-label="Remove payment stage filter"
                >
                  <X size={12} />
                </Button>
              </Badge>
            )}
            {filters.ruleStageParticipation && filters.ruleStageParticipation !== 'all' && (
              <Badge
                colorPalette="pink"
                variant="subtle"
                px={2}
                py={1}
                borderRadius="md"
              >
                Rule Stage: {ruleStageParticipationCollection.items.find(i => i.value === filters.ruleStageParticipation)?.label || filters.ruleStageParticipation}
                <Button
                  size="xs"
                  variant="ghost"
                  ml={2}
                  onClick={() => clearFilter('ruleStageParticipation')}
                  aria-label="Remove rule stage participation filter"
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

