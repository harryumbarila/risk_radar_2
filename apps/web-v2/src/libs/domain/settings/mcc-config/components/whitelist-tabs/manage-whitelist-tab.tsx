'use client';

import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Select,
  Checkbox,
  Badge,
  Button,
  Skeleton,
  Portal,
  Dialog,
  createListCollection,
} from '@chakra-ui/react';
import { Search } from 'lucide-react';
import { useWhitelistStore } from '../useWhitelistStore';
import { toaster } from '@/ui/components/common/atoms/toaster/toaster';
import riskRulesData from '@/data/risk-rules.json';
import type { RiskRule } from '@/libs/domain/risk-rules/context/rules-context';

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'Critical':
      return 'red';
    case 'Moderate':
      return 'yellow';
    case 'Info':
      return 'blue';
    default:
      return 'gray';
  }
}

export default function ManageWhitelistTab(): React.JSX.Element | null {
  const {
    currentMCC,
    tempExcludedRules,
    toggleRuleExclusion,
    resetTempExcludedRules,
    saveWhitelist,
    isLoading,
  } = useWhitelistStore();

  const [searchValue, setSearchValue] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [severityFilter, setSeverityFilter] = React.useState('all');
  const [sourceFilter, setSourceFilter] = React.useState('all');

  // Create collections for Select components
  const typeCollection = React.useMemo(
    () =>
      createListCollection({
        items: [
          { label: 'All Types', value: 'all' },
          { label: 'Auto Hold', value: 'Auto Hold' },
          { label: 'Alert', value: 'Alert' },
          { label: 'Monitoring', value: 'Monitoring' },
        ],
      }),
    [],
  );

  const severityCollection = React.useMemo(
    () =>
      createListCollection({
        items: [
          { label: 'All Severities', value: 'all' },
          { label: 'Critical', value: 'Critical' },
          { label: 'Moderate', value: 'Moderate' },
          { label: 'Info', value: 'Info' },
        ],
      }),
    [],
  );

  const sourceCollection = React.useMemo(
    () =>
      createListCollection({
        items: [
          { label: 'All Sources', value: 'all' },
          { label: 'TSYS', value: 'TSYS' },
          { label: 'Fluidpay', value: 'Fluidpay' },
          { label: 'Paya', value: 'Paya' },
          { label: 'Internal', value: 'Internal' },
        ],
      }),
    [],
  );
  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = React.useState(false);

  const rules = riskRulesData as unknown as RiskRule[];

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  // Filter rules
  const filteredRules = React.useMemo(() => {
    return rules.filter((rule) => {
      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase();
        if (
          !rule.name.toLowerCase().includes(searchLower) &&
          !rule.id.toLowerCase().includes(searchLower) &&
          !rule.description.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }
      if (typeFilter !== 'all' && rule.type !== typeFilter) {
        return false;
      }
      if (severityFilter !== 'all' && rule.severity !== severityFilter) {
        return false;
      }
      if (sourceFilter !== 'all' && rule.source !== sourceFilter) {
        return false;
      }
      return true;
    });
  }, [rules, debouncedSearch, typeFilter, severityFilter, sourceFilter]);

  const handleSaveClick = () => {
    setIsSaveConfirmOpen(true);
  };

  const handleSaveConfirm = async () => {
    if (!currentMCC) return;

    try {
      await saveWhitelist(currentMCC.mcc, Array.from(tempExcludedRules));
      toaster.success({
        title: 'Whitelist updated successfully',
        description: `Whitelist for MCC ${currentMCC.mcc} has been updated.`,
        duration: 3000,
      });
      setIsSaveConfirmOpen(false);
    } catch (error) {
      toaster.error({
        title: 'Error updating whitelist',
        description: 'Failed to update the whitelist. Please try again.',
      });
      setIsSaveConfirmOpen(false);
    }
  };

  const handleCancel = () => {
    resetTempExcludedRules();
  };

  if (!currentMCC) return null;

  return (
    <VStack align="stretch" gap={6}>
      {/* Filter Bar */}
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
              placeholder="Search rules..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              pl={10}
              suppressHydrationWarning
            />
          </Box>

          {/* Type Filter */}
          <Select.Root
            collection={typeCollection}
            value={[typeFilter]}
            onValueChange={(e) => setTypeFilter(e.value[0] || 'all')}
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
                {typeCollection.items.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>

          {/* Severity Filter */}
          <Select.Root
            collection={severityCollection}
            value={[severityFilter]}
            onValueChange={(e) => setSeverityFilter(e.value[0] || 'all')}
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
                {severityCollection.items.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>

          {/* Source Filter */}
          <Select.Root
            collection={sourceCollection}
            value={[sourceFilter]}
            onValueChange={(e) => setSourceFilter(e.value[0] || 'all')}
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
                {sourceCollection.items.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>
        </HStack>
      </Box>

      {/* Rules List */}
      <Box
        bg="white"
        borderRadius="xl"
        borderWidth="1px"
        borderColor="gray.200"
        boxShadow="0 2px 8px rgba(0,0,0,0.05)"
        maxH="500px"
        overflowY="auto"
      >
        {isLoading ? (
          <VStack align="stretch" gap={4} p={4}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} height="60px" borderRadius="md" />
            ))}
          </VStack>
        ) : filteredRules.length === 0 ? (
          <Box p={8} textAlign="center">
            <Text fontSize="sm" color="gray.500">
              No rules found matching your filters.
            </Text>
          </Box>
        ) : (
          <VStack align="stretch" gap={2} p={4}>
            {filteredRules.map((rule) => {
              const isExcluded = tempExcludedRules.has(rule.id);
              return (
                <Box
                  key={rule.id}
                  p={4}
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="gray.200"
                  _hover={{
                    bg: 'gray.50',
                    borderColor: 'gray.300',
                  }}
                  transition="all 0.15s ease-in-out"
                >
                  <HStack justify="space-between" align="center">
                    <HStack gap={3} flex={1}>
                      <Checkbox.Root
                        checked={isExcluded}
                        onCheckedChange={() => toggleRuleExclusion(rule.id)}
                        transition="transform 0.2s ease-in-out"
                        _hover={{
                          transform: 'scale(1.05)',
                        }}
                        _active={{
                          transform: 'scale(0.95)',
                        }}
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                      </Checkbox.Root>
                      <VStack align="start" gap={1} flex={1}>
                        <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                          {rule.name}
                        </Text>
                        <HStack gap={2} flexWrap="wrap">
                          <Badge variant="subtle" colorPalette="gray" fontSize="xs">
                            {rule.type}
                          </Badge>
                          <Badge
                            variant="subtle"
                            colorPalette={getSeverityColor(rule.severity)}
                            fontSize="xs"
                          >
                            {rule.severity}
                          </Badge>
                          <Text fontSize="xs" color="gray.500">
                            {rule.source}
                          </Text>
                        </HStack>
                      </VStack>
                    </HStack>
                    <Text fontSize="xs" color="gray.500" fontStyle="italic">
                      {isExcluded ? 'Excluded' : 'Active'}
                    </Text>
                  </HStack>
                </Box>
              );
            })}
          </VStack>
        )}
      </Box>

      {/* Sticky Footer */}
      <Box
        position="sticky"
        bottom={-6}
        left={-6}
        right={-6}
        bg="white"
        p={4}
        borderTopWidth="1px"
        borderColor="gray.200"
        boxShadow="0 -2px 8px rgba(0,0,0,0.05)"
        zIndex={10}
        mt={6}
      >
        <HStack justify="flex-end" gap={3}>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            colorPalette="blue"
            onClick={handleSaveClick}
            loading={isLoading}
            disabled={isLoading}
          >
            Save
          </Button>
        </HStack>
      </Box>

      {/* Save Confirmation Dialog */}
      <Dialog.Root
        open={isSaveConfirmOpen}
        onOpenChange={(e) => {
          if (!e.open) {
            setIsSaveConfirmOpen(false);
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content p={6}>
              <Dialog.Header pb={4}>
                <Dialog.Title>Confirm Whitelist Update</Dialog.Title>
                <Dialog.Description mt={2}>
                  You're about to update whitelist for MCC <strong>{currentMCC.mcc}</strong> — proceed?
                </Dialog.Description>
              </Dialog.Header>
              <Dialog.Footer pt={4} gap={3}>
                <Button variant="outline" onClick={() => setIsSaveConfirmOpen(false)}>
                  Cancel
                </Button>
                <Button
                  colorPalette="blue"
                  onClick={handleSaveConfirm}
                  isLoading={isLoading}
                  loadingText="Saving..."
                >
                  Save Changes
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </VStack>
  );
}

