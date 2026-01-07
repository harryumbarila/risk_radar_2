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
import { X, ChevronDown, Search } from 'lucide-react';
import { getRuleName } from '../../utils/ruleNames';
import RuleLabel from '../rule-label/rule-label';
import { getUsersByGroup, getGroups, getGroupByUserId, getUserById, type User } from '../../utils/userData';

export interface FilterState {
  dateRange: 'today' | '7' | '14' | '30' | 'custom';
  customStartDate?: string;
  customEndDate?: string;
  processor: 'all' | 'TSYS' | 'FSP';
  group: 'all' | 'Partner' | 'Direct' | 'F1 - City National' | 'Inside Sales';
  user: 'all' | string;
  product: 'all' | 'Talus Pay' | 'Global365 LLC' | 'SIT';
  mpaType: 'all' | 'Digital' | 'Paper application' | 'E-Sign';
  ruleId: 'all' | string[];
  paymentStage?: ('Authorization' | 'Capture' | 'Settlement' | 'ACH Returns')[];
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
      { label: 'Today', value: 'today' },
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

  const groupCollection = createListCollection({
    items: [
      { label: 'All Groups', value: 'all' },
      { label: 'Partner', value: 'Partner' },
      { label: 'Direct', value: 'Direct' },
      { label: 'F1 - City National', value: 'F1 - City National' },
      { label: 'Inside Sales', value: 'Inside Sales' },
    ],
  });

  const productCollection = createListCollection({
    items: [
      { label: 'All Products', value: 'all' },
      { label: 'Talus Pay', value: 'Talus Pay' },
      { label: 'Global365 LLC', value: 'Global365 LLC' },
      { label: 'SIT', value: 'SIT' },
    ],
  });

  const mpaTypeCollection = createListCollection({
    items: [
      { label: 'All MPA Types', value: 'all' },
      { label: 'Digital', value: 'Digital' },
      { label: 'Paper application', value: 'Paper application' },
      { label: 'E-Sign', value: 'E-Sign' },
    ],
  });

  // Get users based on selected group
  // If group is 'all', show all users (not filtered by group)
  const effectiveGroup = React.useMemo(() => {
    if (filters.group && filters.group !== 'all') {
      return filters.group;
    }
    return 'all';
  }, [filters.group]);

  // State for user search query
  const [userSearchQuery, setUserSearchQuery] = React.useState('');

  // Group users by user class, filtered by search query
  const groupedUsers = React.useMemo(() => {
    const users = getUsersByGroup(effectiveGroup);
    
    // Filter by search query if present
    const filteredUsers = userSearchQuery.trim()
      ? users.filter((user: User) =>
          user.name.toLowerCase().includes(userSearchQuery.toLowerCase())
        )
      : users;
    
    const grouped: Record<string, User[]> = {};
    
    filteredUsers.forEach((user: User) => {
      if (!grouped[user.userClass]) {
        grouped[user.userClass] = [];
      }
      const userClassArray = grouped[user.userClass];
      if (userClassArray) {
        userClassArray.push(user);
      }
    });
    
    return grouped;
  }, [effectiveGroup, userSearchQuery]);

  const availableUsers = React.useMemo(() => {
    const users = getUsersByGroup(effectiveGroup);
    
    // Filter by search query if present
    const filteredUsers = userSearchQuery.trim()
      ? users.filter((user: User) =>
          user.name.toLowerCase().includes(userSearchQuery.toLowerCase())
        )
      : users;
    
    return createListCollection({
      items: [
        { label: 'All Users', value: 'all' },
        ...filteredUsers.map((user: User) => ({
          label: user.name,
          value: user.id,
        })),
      ],
    });
  }, [effectiveGroup, userSearchQuery]);

  const paymentStageCollection = createListCollection({
    items: [
      { label: 'Authorization', value: 'Authorization' },
      { label: 'Capture', value: 'Capture' },
      { label: 'Settlement (CB)', value: 'Settlement' },
      { label: 'ACH Returns', value: 'ACH Returns' },
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
    } else if (key === 'group') {
      newFilters.group = 'all';
      newFilters.user = 'all'; // Reset user when group changes
    } else if (key === 'user') {
      newFilters.user = 'all';
    } else if (key === 'product') {
      newFilters.product = 'all';
    } else if (key === 'mpaType') {
      newFilters.mpaType = 'all';
    } else if (key === 'ruleId') {
      newFilters.ruleId = 'all';
    } else if (key === 'paymentStage') {
      delete newFilters.paymentStage;
    } else {
      delete newFilters[key];
    }
    onFiltersChange(newFilters);
  };

  const clearAll = () => {
    onFiltersChange({
      dateRange: '7',
      processor: 'all',
      group: 'all',
      user: 'all',
      product: 'all',
      mpaType: 'all',
      ruleId: 'all',
      paymentStage: undefined,
    });
  };

  const selectedRules = Array.isArray(filters.ruleId) ? filters.ruleId : (filters.ruleId === 'all' ? [] : [filters.ruleId]);
  
  const hasActiveFilters =
    filters.dateRange !== 'today' ||
    filters.processor !== 'all' ||
    filters.group !== 'all' ||
    filters.user !== 'all' ||
    filters.product !== 'all' ||
    filters.mpaType !== 'all' ||
    (Array.isArray(filters.ruleId) ? filters.ruleId.length > 0 : filters.ruleId !== 'all') ||
    (filters.paymentStage !== undefined && filters.paymentStage.length > 0) ||
    filters.week !== undefined ||
    filters.hourRange !== undefined;

  // Count active filters
  const activeFilterCount = [
    filters.dateRange !== 'today',
    filters.processor !== 'all',
    filters.group !== 'all',
    filters.user !== 'all',
    filters.product !== 'all',
    filters.mpaType !== 'all',
    (Array.isArray(filters.ruleId) ? filters.ruleId.length > 0 : filters.ruleId !== 'all'),
    (filters.paymentStage !== undefined && filters.paymentStage.length > 0),
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
              value={[filters.dateRange || 'today']}
              onValueChange={(e) => {
                const value = (e.value[0] || 'today') as FilterState['dateRange'];
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
                  onChange={(e) => {
                    updateFilter('customStartDate', e.target.value);
                  }}
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
                  onChange={(e) => {
                    updateFilter('customEndDate', e.target.value);
                  }}
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

          {/* Group */}
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600">
              Group
            </Text>
            <Select.Root
              collection={groupCollection}
              value={[filters.group || 'all']}
              onValueChange={(e) => {
                const newGroup = (e.value[0] || 'all') as FilterState['group'];
                const previousGroup = filters.group || 'all';
                
                // If user is selected, check if it belongs to the new group
                let updatedUser = filters.user || 'all';
                if (newGroup !== 'all' && filters.user && filters.user !== 'all') {
                  const userGroup = getGroupByUserId(filters.user);
                  // If selected user doesn't belong to new group, reset user
                  if (userGroup !== newGroup) {
                    updatedUser = 'all';
                  }
                } else if (newGroup !== previousGroup) {
                  // If group changed, reset user
                  updatedUser = 'all';
                }
                
                // Update both group and user in a single update
                onFiltersChange({
                  ...filters,
                  group: newGroup,
                  user: updatedUser,
                });
              }}
              size="sm"
              width="180px"
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
                    {groupCollection.items.map((item) => (
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

          {/* User */}
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600">
              User
            </Text>
            <Select.Root
              collection={availableUsers}
              value={[filters.user || 'all']}
              onValueChange={(e) => {
                const selectedUserId = e.value[0] || 'all';
                if (selectedUserId === 'all') {
                  updateFilter('user', 'all');
                } else {
                  // Get the group for the selected user
                  const userGroup = getGroupByUserId(selectedUserId);
                  if (userGroup) {
                    // Update both user and group in a single update
                    onFiltersChange({
                      ...filters,
                      user: selectedUserId,
                      group: userGroup as FilterState['group'],
                    });
                  } else {
                    updateFilter('user', selectedUserId);
                  }
                }
                // Clear search query when user is selected
                setUserSearchQuery('');
              }}
              size="sm"
              width="220px"
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
                    {/* Search Input */}
                    <Box px={2} py={2} borderBottomWidth="1px" borderColor="gray.200">
                      <Box position="relative">
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
                          placeholder="Search user..."
                          value={userSearchQuery}
                          onChange={(e) => {
                            e.stopPropagation();
                            setUserSearchQuery(e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                          pl={10}
                          suppressHydrationWarning
                        />
                      </Box>
                    </Box>
                    
                    {/* All Users option */}
                    {availableUsers.items[0] && (
                      <Select.Item item={availableUsers.items[0]} key="all">
                        {availableUsers.items[0].label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    )}
                    
                    {/* Grouped users by user class */}
                    {Object.keys(groupedUsers).length > 0 ? (
                      Object.entries(groupedUsers).map(([userClass, users]) => (
                        <React.Fragment key={userClass}>
                          {/* User Class Header (not selectable) */}
                          <Box
                            px={4}
                            py={2}
                            bg="blue.50"
                            borderLeftWidth="3px"
                            borderLeftColor="blue.500"
                            borderTopWidth="1px"
                            borderBottomWidth="1px"
                            borderColor="gray.200"
                            cursor="default"
                            userSelect="none"
                            pointerEvents="none"
                            mt={Object.keys(groupedUsers).indexOf(userClass) > 0 ? 1 : 0}
                          >
                            <Text 
                              fontSize="xs" 
                              fontWeight="bold" 
                              color="blue.700"
                              letterSpacing="0.025em"
                              textTransform="uppercase"
                            >
                              {userClass}
                            </Text>
                          </Box>
                          {/* Users in this class */}
                          {users.map((user: User) => {
                            const item = availableUsers.items.find(i => i.value === user.id);
                            if (!item) return null;
                            return (
                              <Select.Item item={item} key={user.id}>
                                <Box pl={4}>
                                  <Text fontSize="sm" fontWeight="normal" color="gray.900">
                                    {user.name}
                                  </Text>
                                </Box>
                                <Select.ItemIndicator />
                              </Select.Item>
                            );
                          })}
                        </React.Fragment>
                      ))
                    ) : userSearchQuery.trim() ? (
                      <Box px={4} py={3}>
                        <Text fontSize="sm" color="gray.500">
                          No users found
                        </Text>
                      </Box>
                    ) : null}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </VStack>

          {/* Product */}
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600">
              Product
            </Text>
            <Select.Root
              collection={productCollection}
              value={[filters.product || 'all']}
              onValueChange={(e) =>
                updateFilter('product', (e.value[0] || 'all') as FilterState['product'])
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
                    {productCollection.items.map((item) => (
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

          {/* MPA Type */}
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600">
              MPA Type
            </Text>
            <Select.Root
              collection={mpaTypeCollection}
              value={[filters.mpaType || 'all']}
              onValueChange={(e) =>
                updateFilter('mpaType', (e.value[0] || 'all') as FilterState['mpaType'])
              }
              size="sm"
              width="180px"
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
                    {mpaTypeCollection.items.map((item) => (
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

          {/* Payment Stage - Multi Select */}
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600">
              Payment Stage
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
                    {!filters.paymentStage || filters.paymentStage.length === 0
                      ? 'All Stages'
                      : filters.paymentStage.length === 1
                      ? filters.paymentStage[0]
                      : `${filters.paymentStage.length} stages selected`}
                  </Text>
                  <ChevronDown size={16} />
                </Button>
              </Popover.Trigger>
              <Portal>
                <Popover.Positioner>
                  <Popover.Content width="250px" maxHeight="300px" overflowY="auto">
                    <Popover.Arrow />
                    <Popover.CloseTrigger />
                    <VStack align="stretch" gap={2} p={4}>
                      <HStack justify="space-between">
                        <Text fontWeight="bold" fontSize="sm">
                          Select Payment Stages
                        </Text>
                        {filters.paymentStage && filters.paymentStage.length > 0 ? (
                          <Button
                            size="xs"
                            variant="ghost"
                            onClick={() => updateFilter('paymentStage', undefined)}
                          >
                            Clear all
                          </Button>
                        ) : (
                          <Button
                            size="xs"
                            variant="ghost"
                            onClick={() => updateFilter('paymentStage', ['Authorization', 'Capture', 'Settlement', 'ACH Returns'])}
                          >
                            Select all
                          </Button>
                        )}
                      </HStack>
                      <Box borderWidth="1px" borderRadius="md" p={2}>
                        <VStack align="stretch" gap={2}>
                          {paymentStageCollection.items.map((item) => {
                            const isChecked = filters.paymentStage?.includes(item.value as any) || false;
                            return (
                              <HStack key={item.value} gap={3} align="start">
                                <Checkbox.Root
                                  checked={isChecked}
                                  onCheckedChange={(e) => {
                                    const checked = e.checked === true;
                                    const current = filters.paymentStage || [];
                                    const newSelected = checked
                                      ? [...current, item.value as any]
                                      : current.filter((s) => s !== item.value);
                                    updateFilter('paymentStage', newSelected.length === 0 ? undefined : newSelected);
                                  }}
                                >
                                  <Checkbox.HiddenInput />
                                  <Checkbox.Control>
                                    <Checkbox.Indicator />
                                  </Checkbox.Control>
                                </Checkbox.Root>
                                <Text 
                                  fontSize="sm" 
                                  fontWeight="medium"
                                  flex={1}
                                  cursor="pointer"
                                  onClick={() => {
                                    const current = filters.paymentStage || [];
                                    const isChecked = current.includes(item.value as any);
                                    const newSelected = isChecked
                                      ? current.filter((s) => s !== item.value)
                                      : [...current, item.value as any];
                                    updateFilter('paymentStage', newSelected.length === 0 ? undefined : newSelected);
                                  }}
                                >
                                  {item.label}
                                </Text>
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
                        {selectedRules.length > 0 ? (
                          <Button
                            size="xs"
                            variant="ghost"
                            onClick={() => updateFilter('ruleId', 'all')}
                          >
                            Clear all
                          </Button>
                        ) : (
                          <Button
                            size="xs"
                            variant="ghost"
                            onClick={() => updateFilter('ruleId', availableRules)}
                          >
                            Select all
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
                                    {getRuleName(rule)}
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    {rule}
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
            {filters.dateRange !== 'today' && (
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
            {filters.group !== 'all' && (
              <Badge
                colorPalette="purple"
                variant="subtle"
                px={2}
                py={1}
                borderRadius="md"
              >
                Group: {filters.group}
                <Button
                  size="xs"
                  variant="ghost"
                  ml={2}
                  onClick={() => clearFilter('group')}
                  aria-label="Remove group filter"
                >
                  <X size={12} />
                </Button>
              </Badge>
            )}
            {filters.user !== 'all' && (
              <Badge
                colorPalette="purple"
                variant="subtle"
                px={2}
                py={1}
                borderRadius="md"
              >
                User: {(() => {
                  const user = getUserById(filters.user);
                  return user ? user.name : filters.user;
                })()}
                <Button
                  size="xs"
                  variant="ghost"
                  ml={2}
                  onClick={() => clearFilter('user')}
                  aria-label="Remove user filter"
                >
                  <X size={12} />
                </Button>
              </Badge>
            )}
            {filters.product !== 'all' && (
              <Badge
                colorPalette="purple"
                variant="subtle"
                px={2}
                py={1}
                borderRadius="md"
              >
                Product: {filters.product}
                <Button
                  size="xs"
                  variant="ghost"
                  ml={2}
                  onClick={() => clearFilter('product')}
                  aria-label="Remove product filter"
                >
                  <X size={12} />
                </Button>
              </Badge>
            )}
            {filters.mpaType !== 'all' && (
              <Badge
                colorPalette="purple"
                variant="subtle"
                px={2}
                py={1}
                borderRadius="md"
              >
                MPA Type: {filters.mpaType}
                <Button
                  size="xs"
                  variant="ghost"
                  ml={2}
                  onClick={() => clearFilter('mpaType')}
                  aria-label="Remove MPA type filter"
                >
                  <X size={12} />
                </Button>
              </Badge>
            )}
            {filters.paymentStage && filters.paymentStage.length > 0 && (
              <>
                {filters.paymentStage.map((stage) => (
                  <Badge
                    key={stage}
                    colorPalette="green"
                    variant="subtle"
                    px={2}
                    py={1}
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    Payment Stage: {stage}
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => {
                        const newStages = filters.paymentStage?.filter((s) => s !== stage);
                        updateFilter('paymentStage', newStages && newStages.length > 0 ? newStages : undefined);
                      }}
                      aria-label="Remove payment stage filter"
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

