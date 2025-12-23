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
import { Search, X as XIcon } from 'lucide-react';
import { useWhitelistStore } from '../useWhitelistStore';
import { toaster } from '@/ui/components/common/atoms/toaster/toaster';
import riskRulesData from '@/data/risk-rules.json';
import type { RiskRule } from '@/libs/domain/risk-rules/context/rules-context';

export default function ManageWhitelistTab(): React.JSX.Element | null {
  const {
    currentMCC,
    tempExcludedRules,
    toggleRuleExclusion,
    resetTempExcludedRules,
    saveWhitelist,
    isLoading,
    closeDrawer,
  } = useWhitelistStore();

  const [searchValue, setSearchValue] = React.useState('');
  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = React.useState(false);
  const [isToggleConfirmOpen, setIsToggleConfirmOpen] = React.useState(false);
  const [ruleToToggle, setRuleToToggle] = React.useState<{ id: string; name: string; willExclude: boolean } | null>(null);

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
      return true;
    });
  }, [rules, debouncedSearch]);

  const handleSaveClick = () => {
    setIsSaveConfirmOpen(true);
  };

  const handleSaveConfirm = async () => {
    if (!currentMCC) return;

    try {
      await saveWhitelist(currentMCC.mcc, Array.from(tempExcludedRules));
      const excludedCount = tempExcludedRules.size;
      toaster.success({
        title: 'Whitelist updated successfully',
        description: `Whitelist updated for MCC ${currentMCC.mcc} — ${excludedCount} ${excludedCount === 1 ? 'rule' : 'rules'} excluded.`,
        duration: 4000,
      });
      setIsSaveConfirmOpen(false);
      closeDrawer();
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
    closeDrawer();
  };

  const handleToggleClick = (ruleId: string, ruleName: string, currentlyExcluded: boolean) => {
    setRuleToToggle({
      id: ruleId,
      name: ruleName,
      willExclude: !currentlyExcluded,
    });
    setIsToggleConfirmOpen(true);
  };

  const handleToggleConfirm = () => {
    if (ruleToToggle) {
      toggleRuleExclusion(ruleToToggle.id);
      setIsToggleConfirmOpen(false);
      setRuleToToggle(null);
    }
  };

  const handleToggleCancel = () => {
    setIsToggleConfirmOpen(false);
    setRuleToToggle(null);
  };

  const handleClearFilters = () => {
    setSearchValue('');
  };

  const hasActiveFilters = searchValue;

  if (!currentMCC) return null;

  return (
    <VStack align="stretch" gap={6}>
      {/* Filter Bar - Sticky */}
      <Box
        position="sticky"
        top={0}
        zIndex={5}
        bg="white"
        p={4}
        borderRadius="xl"
        borderWidth="1px"
        borderColor="gray.200"
        boxShadow="0 2px 8px rgba(0,0,0,0.05)"
      >
        <VStack align="stretch" gap={3}>
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

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              alignSelf="flex-start"
              color="gray.600"
              _hover={{ color: 'gray.900', bg: 'gray.100' }}
            >
              <HStack gap={1}>
                <XIcon size={14} />
                <Text>Clear all filters</Text>
              </HStack>
            </Button>
          )}
          </HStack>
          {filteredRules.length > 0 && (
            <Text fontSize="xs" color="gray.600" mt={1}>
              {filteredRules.length} {filteredRules.length === 1 ? 'result' : 'results'} match filters
            </Text>
          )}
        </VStack>
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
                      <Box
                        as="button"
                        onClick={() => handleToggleClick(rule.id, rule.name, isExcluded)}
                        cursor="pointer"
                        transition="transform 0.2s ease-in-out"
                        _hover={{
                          transform: 'scale(1.05)',
                        }}
                        _active={{
                          transform: 'scale(0.95)',
                        }}
                        aria-label={isExcluded ? 'Exclude rule' : 'Activate rule'}
                      >
                        <Checkbox.Root
                          checked={isExcluded}
                          readOnly
                          pointerEvents="none"
                        >
                          <Checkbox.HiddenInput />
                          <Checkbox.Control />
                        </Checkbox.Root>
                      </Box>
                      <VStack align="start" gap={1} flex={1}>
                        <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                          {rule.name}
                        </Text>
                        <HStack gap={2} flexWrap="wrap">
                          <Badge variant="subtle" colorPalette="gray" fontSize="xs">
                            {rule.type}
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

      {/* Save Confirmation Dialog - Now shows toast instead of modal after save */}
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
                  loading={isLoading}
                  loadingText="Saving..."
                >
                  Save Changes
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Toggle Rule Confirmation Dialog */}
      <Dialog.Root
        open={isToggleConfirmOpen}
        onOpenChange={(e) => {
          if (!e.open) {
            handleToggleCancel();
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content p={6}>
              <Dialog.Header pb={4}>
                <Dialog.Title>
                  {ruleToToggle?.willExclude ? 'Exclude Rule' : 'Activate Rule'}
                </Dialog.Title>
                <Dialog.Description mt={2}>
                  {ruleToToggle?.willExclude ? (
                    <>
                      You're about to <strong>exclude</strong> rule <strong>{ruleToToggle.name}</strong> for MCC{' '}
                      <strong>{currentMCC.mcc}</strong>. This rule will not be executed for this MCC. Proceed?
                    </>
                  ) : (
                    <>
                      You're about to <strong>activate</strong> rule <strong>{ruleToToggle?.name}</strong> for MCC{' '}
                      <strong>{currentMCC.mcc}</strong>. This rule will be executed for this MCC. Proceed?
                    </>
                  )}
                </Dialog.Description>
              </Dialog.Header>
              <Dialog.Footer pt={4} gap={3}>
                <Button variant="outline" onClick={handleToggleCancel}>
                  Cancel
                </Button>
                <Button
                  colorPalette={ruleToToggle?.willExclude ? 'red' : 'green'}
                  onClick={handleToggleConfirm}
                >
                  {ruleToToggle?.willExclude ? 'Exclude Rule' : 'Activate Rule'}
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </VStack>
  );
}

