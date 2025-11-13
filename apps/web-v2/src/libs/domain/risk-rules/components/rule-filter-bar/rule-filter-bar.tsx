'use client';

import React from 'react';
import {
  Box,
  HStack,
  VStack,
  Input,
  Select,
  Badge,
  Button,
  Text,
} from '@chakra-ui/react';
import { Search, X } from 'lucide-react';
import { useRules } from '../../context/rules-context';

export default function RuleFilterBar(): React.JSX.Element {
  const { filters, setFilters, clearFilters, activeFiltersCount } = useRules();
  const [searchValue, setSearchValue] = React.useState(filters.search);

  // Debounce search input (300ms)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        setFilters({ search: searchValue });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, filters.search, setFilters]);

  // Sync searchValue with filters.search when filters change externally
  React.useEffect(() => {
    setSearchValue(filters.search);
  }, [filters.search]);

  const handleRemoveFilter = (key: keyof typeof filters, value: string) => {
    if (key === 'search') {
      setSearchValue('');
      setFilters({ search: '' });
    } else {
      setFilters({ [key]: 'all' });
    }
  };

  const getFilterLabel = (key: keyof typeof filters, value: string): string => {
    if (key === 'type') return `Type: ${value}`;
    if (key === 'severity') return `Severity: ${value}`;
    if (key === 'source') return `Source: ${value}`;
    if (key === 'status') return `Status: ${value === 'active' ? 'Active' : 'Inactive'}`;
    return '';
  };

  const activeFilterChips = React.useMemo(() => {
    const chips: Array<{ key: keyof typeof filters; value: string; label: string }> = [];
    if (filters.search) {
      chips.push({ key: 'search', value: filters.search, label: `Search: "${filters.search}"` });
    }
    if (filters.type !== 'all') {
      chips.push({ key: 'type', value: filters.type, label: getFilterLabel('type', filters.type) });
    }
    if (filters.severity !== 'all') {
      chips.push({
        key: 'severity',
        value: filters.severity,
        label: getFilterLabel('severity', filters.severity),
      });
    }
    if (filters.source !== 'all') {
      chips.push({
        key: 'source',
        value: filters.source,
        label: getFilterLabel('source', filters.source),
      });
    }
    if (filters.status !== 'all') {
      chips.push({
        key: 'status',
        value: filters.status,
        label: getFilterLabel('status', filters.status),
      });
    }
    return chips;
  }, [filters]);

  return (
    <VStack align="stretch" gap={4}>
      <Box
        bg="white"
        p={4}
        borderRadius="xl"
        borderWidth="1px"
        borderColor="gray.200"
        boxShadow="0 2px 8px rgba(0,0,0,0.05)"
      >
        <HStack
          gap={4}
          flexWrap={{ base: 'wrap', md: 'nowrap' }}
          align={{ base: 'stretch', md: 'center' }}
        >
          {/* Search */}
          <Box flex={1} minW={{ base: '100%', md: '300px' }} position="relative">
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
              placeholder="Search by rule name or keyword..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              pl={10}
              suppressHydrationWarning
            />
          </Box>

          {/* Type Filter */}
          <Select.Root
            value={[filters.type]}
            onValueChange={(e) => setFilters({ type: e.value[0] || 'all' })}
            size="md"
            width={{ base: '100%', md: '150px' }}
          >
            <Select.HiddenSelect />
            <Select.Trigger suppressHydrationWarning>
              <Select.ValueText placeholder="Type" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
            <Select.Positioner>
              <Select.Content>
                <Select.Item item={{ label: 'All Types', value: 'all' }}>All Types</Select.Item>
                <Select.Item item={{ label: 'Auto Hold', value: 'Auto Hold' }}>
                  Auto Hold
                </Select.Item>
                <Select.Item item={{ label: 'Alert', value: 'Alert' }}>Alert</Select.Item>
                <Select.Item item={{ label: 'Monitoring', value: 'Monitoring' }}>
                  Monitoring
                </Select.Item>
              </Select.Content>
            </Select.Positioner>
          </Select.Root>

          {/* Severity Filter */}
          <Select.Root
            value={[filters.severity]}
            onValueChange={(e) => setFilters({ severity: e.value[0] || 'all' })}
            size="md"
            width={{ base: '100%', md: '150px' }}
          >
            <Select.HiddenSelect />
            <Select.Trigger suppressHydrationWarning>
              <Select.ValueText placeholder="Severity" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
            <Select.Positioner>
              <Select.Content>
                <Select.Item item={{ label: 'All Severities', value: 'all' }}>
                  All Severities
                </Select.Item>
                <Select.Item item={{ label: 'Critical', value: 'Critical' }}>Critical</Select.Item>
                <Select.Item item={{ label: 'Moderate', value: 'Moderate' }}>
                  Moderate
                </Select.Item>
                <Select.Item item={{ label: 'Info', value: 'Info' }}>Info</Select.Item>
              </Select.Content>
            </Select.Positioner>
          </Select.Root>

          {/* Source Filter */}
          <Select.Root
            value={[filters.source]}
            onValueChange={(e) => setFilters({ source: e.value[0] || 'all' })}
            size="md"
            width={{ base: '100%', md: '150px' }}
          >
            <Select.HiddenSelect />
            <Select.Trigger suppressHydrationWarning>
              <Select.ValueText placeholder="Source" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
            <Select.Positioner>
              <Select.Content>
                <Select.Item item={{ label: 'All Sources', value: 'all' }}>All Sources</Select.Item>
                <Select.Item item={{ label: 'TSYS', value: 'TSYS' }}>TSYS</Select.Item>
                <Select.Item item={{ label: 'Fluidpay', value: 'Fluidpay' }}>Fluidpay</Select.Item>
                <Select.Item item={{ label: 'Paya', value: 'Paya' }}>Paya</Select.Item>
                <Select.Item item={{ label: 'Internal', value: 'Internal' }}>Internal</Select.Item>
              </Select.Content>
            </Select.Positioner>
          </Select.Root>

          {/* Status Filter */}
          <Select.Root
            value={[filters.status]}
            onValueChange={(e) => setFilters({ status: e.value[0] || 'all' })}
            size="md"
            width={{ base: '100%', md: '150px' }}
          >
            <Select.HiddenSelect />
            <Select.Trigger suppressHydrationWarning>
              <Select.ValueText placeholder="Status" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
            <Select.Positioner>
              <Select.Content>
                <Select.Item item={{ label: 'All Statuses', value: 'all' }}>All Statuses</Select.Item>
                <Select.Item item={{ label: 'Active', value: 'active' }}>Active</Select.Item>
                <Select.Item item={{ label: 'Inactive', value: 'inactive' }}>Inactive</Select.Item>
              </Select.Content>
            </Select.Positioner>
          </Select.Root>
        </HStack>

        {/* Active Filter Chips */}
        {activeFilterChips.length > 0 && (
          <HStack gap={2} mt={4} flexWrap="wrap" align="center">
            <Text fontSize="xs" color="gray.500" fontWeight="medium">
              Active filters:
            </Text>
            {activeFilterChips.map((chip) => (
              <Badge
                key={`${chip.key}-${chip.value}`}
                colorPalette="blue"
                variant="subtle"
                px={2}
                py={1}
                borderRadius="md"
                fontSize="xs"
              >
                <HStack gap={1} align="center">
                  <Text>{chip.label}</Text>
                  <Button
                    variant="ghost"
                    size="xs"
                    p={0}
                    minW="auto"
                    h="auto"
                    onClick={() => handleRemoveFilter(chip.key, chip.value)}
                    aria-label={`Remove filter ${chip.label}`}
                  >
                    <X size={12} />
                  </Button>
                </HStack>
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="xs"
              onClick={clearFilters}
              colorPalette="gray"
              fontSize="xs"
            >
              Clear all
            </Button>
          </HStack>
        )}
      </Box>
    </VStack>
  );
}

