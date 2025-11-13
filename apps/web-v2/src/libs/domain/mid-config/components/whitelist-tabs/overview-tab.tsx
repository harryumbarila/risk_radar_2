'use client';

import React from 'react';
import {
  Box,
  Table,
  VStack,
  HStack,
  Text,
  Badge,
  Tooltip,
  Portal,
  IconButton,
  Separator,
  Dialog,
  Button,
} from '@chakra-ui/react';
import { Info, RotateCcw, X } from 'lucide-react';
import { useWhitelistStore } from '../useWhitelistStore';
import { toaster } from '@/ui/components/common/atoms/toaster/toaster';
import riskRulesData from '@/data/risk-rules.json';
import type { RiskRule } from '@/libs/domain/risk-rules/context/rules-context';

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'Critical':
      return 'red';
    case 'Moderate':
      return 'amber';
    case 'Info':
      return 'blue';
    default:
      return 'gray';
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function OverviewTab(): React.JSX.Element | null {
  const { currentMID, toggleRuleExclusion, tempExcludedRules } = useWhitelistStore();
  const rules = riskRulesData as unknown as RiskRule[];
  const [isToggleConfirmOpen, setIsToggleConfirmOpen] = React.useState(false);
  const [ruleToToggle, setRuleToToggle] = React.useState<{ id: string; name: string; willExclude: boolean } | null>(null);

  if (!currentMID) return null;

  // Use currentMID.whitelist for Overview tab (shows saved state)
  const excludedRulesSet = new Set(currentMID.whitelist);
  const excludedCount = excludedRulesSet.size;
  const activeCount = rules.length - excludedCount;

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
      toaster.success({
        title: ruleToToggle.willExclude ? 'Rule excluded' : 'Rule activated',
        description: `${ruleToToggle.name} has been ${ruleToToggle.willExclude ? 'excluded' : 'activated'} for MID ${currentMID.mid}.`,
        duration: 3000,
      });
      setIsToggleConfirmOpen(false);
      setRuleToToggle(null);
    }
  };

  const handleToggleCancel = () => {
    setIsToggleConfirmOpen(false);
    setRuleToToggle(null);
  };

  return (
    <VStack align="stretch" gap={4}>
      {/* Overview KPIs Summary Bar */}
      <Box
        bg="gray.50"
        p={3}
        borderRadius="md"
        borderWidth="1px"
        borderColor="gray.200"
      >
        <HStack justify="space-between" align="center" flexWrap="wrap" gap={2}>
          <HStack gap={4} flexWrap="wrap">
            <Text fontSize="xs" color="gray.600">
              <Text as="span" fontWeight="semibold" color="red.700">
                {excludedCount}
              </Text>{' '}
              rules excluded
            </Text>
            <Separator orientation="vertical" height="16px" />
            <Text fontSize="xs" color="gray.600">
              <Text as="span" fontWeight="semibold" color="green.700">
                {activeCount}
              </Text>{' '}
              rules active
            </Text>
            <Separator orientation="vertical" height="16px" />
            <Text fontSize="xs" color="gray.600">
              Last updated{' '}
              <Text as="span" fontWeight="semibold">
                {formatDate(currentMID.last_updated)}
              </Text>
            </Text>
          </HStack>
        </HStack>
      </Box>

      {/* Rules Table */}
      <Box
        bg="white"
        borderRadius="xl"
        borderWidth="1px"
        borderColor="gray.200"
        boxShadow="0 2px 8px rgba(0,0,0,0.05)"
        overflowX="auto"
      >
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Rule</Table.ColumnHeader>
              <Table.ColumnHeader>Type</Table.ColumnHeader>
              <Table.ColumnHeader>Severity</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rules.map((rule) => {
              const isExcluded = excludedRulesSet.has(rule.id);
              return (
                <Table.Row
                  key={rule.id}
                  _hover={{
                    bg: 'gray.50',
                  }}
                  transition="all 0.15s ease-in-out"
                >
                  <Table.Cell>
                    <VStack align="start" gap={1}>
                      <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                        {rule.name}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {rule.id}
                      </Text>
                    </VStack>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant="subtle" colorPalette="gray">
                      {rule.type}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      variant="subtle"
                      colorPalette={getSeverityColor(rule.severity)}
                      px={3}
                      py={1}
                      borderRadius="md"
                      bg={
                        rule.severity === 'Critical'
                          ? 'red.100'
                          : rule.severity === 'Moderate'
                            ? 'amber.100'
                            : 'blue.100'
                      }
                      color={
                        rule.severity === 'Critical'
                          ? 'red.700'
                          : rule.severity === 'Moderate'
                            ? 'amber.700'
                            : 'blue.700'
                      }
                    >
                      {rule.severity}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Box className="group">
                      <HStack gap={2} align="center">
                        {isExcluded ? (
                        <>
                          <Badge
                            variant="subtle"
                            colorPalette="red"
                            px={3}
                            py={1}
                            borderRadius="md"
                            bg="red.100"
                            color="red.700"
                            transition="all 0.2s ease-in-out"
                            _groupHover={{
                              opacity: 0.8,
                            }}
                          >
                            Excluded
                          </Badge>
                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <IconButton
                                size="xs"
                                variant="ghost"
                                onClick={() => handleToggleClick(rule.id, rule.name, true)}
                                aria-label="Activate rule"
                                color="gray.400"
                                _hover={{
                                  color: 'green.600',
                                  bg: 'green.50',
                                }}
                                transition="all 0.2s ease-in-out"
                              >
                                <RotateCcw size={14} />
                              </IconButton>
                            </Tooltip.Trigger>
                            <Portal>
                              <Tooltip.Positioner>
                                <Tooltip.Content
                                  maxW="200px"
                                  zIndex={2000}
                                  bg="gray.900"
                                  color="white"
                                  px={3}
                                  py={2}
                                  borderRadius="md"
                                  fontSize="sm"
                                  boxShadow="lg"
                                >
                                  <Tooltip.Arrow />
                                  Click to activate this rule
                                </Tooltip.Content>
                              </Tooltip.Positioner>
                            </Portal>
                          </Tooltip.Root>
                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <Box
                                as="span"
                                color="gray.400"
                                _hover={{ color: 'gray.600' }}
                                cursor="help"
                                display="inline-flex"
                                alignItems="center"
                                aria-label="Exclusion information"
                              >
                                <Info size={14} />
                              </Box>
                            </Tooltip.Trigger>
                            <Portal>
                              <Tooltip.Positioner>
                                <Tooltip.Content
                                  maxW="300px"
                                  zIndex={2000}
                                  bg="gray.900"
                                  color="white"
                                  px={3}
                                  py={2}
                                  borderRadius="md"
                                  fontSize="sm"
                                  boxShadow="lg"
                                >
                                  <Tooltip.Arrow />
                                  Excluded from execution for this MID.
                                </Tooltip.Content>
                              </Tooltip.Positioner>
                            </Portal>
                          </Tooltip.Root>
                        </>
                      ) : (
                        <>
                          <Badge
                            variant="subtle"
                            colorPalette="green"
                            px={3}
                            py={1}
                            borderRadius="md"
                            bg="emerald.100"
                            color="emerald.700"
                            transition="all 0.2s ease-in-out"
                            _groupHover={{
                              opacity: 0.8,
                            }}
                          >
                            Active
                          </Badge>
                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <IconButton
                                size="xs"
                                variant="ghost"
                                onClick={() => handleToggleClick(rule.id, rule.name, false)}
                                aria-label="Exclude rule"
                                color="gray.400"
                                _hover={{
                                  color: 'red.600',
                                  bg: 'red.50',
                                }}
                                transition="all 0.2s ease-in-out"
                              >
                                <X size={14} />
                              </IconButton>
                            </Tooltip.Trigger>
                            <Portal>
                              <Tooltip.Positioner>
                                <Tooltip.Content
                                  maxW="200px"
                                  zIndex={2000}
                                  bg="gray.900"
                                  color="white"
                                  px={3}
                                  py={2}
                                  borderRadius="md"
                                  fontSize="sm"
                                  boxShadow="lg"
                                >
                                  <Tooltip.Arrow />
                                  Click to exclude this rule
                                </Tooltip.Content>
                              </Tooltip.Positioner>
                            </Portal>
                          </Tooltip.Root>
                        </>
                      )}
                      </HStack>
                    </Box>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Box>

      {/* Toggle Confirmation Dialog */}
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
                      You're about to <strong>exclude</strong> rule <strong>{ruleToToggle.name}</strong> for MID{' '}
                      <strong>{currentMID.mid}</strong>. This rule will not be executed for this MID. Proceed?
                    </>
                  ) : (
                    <>
                      You're about to <strong>activate</strong> rule <strong>{ruleToToggle?.name}</strong> for MID{' '}
                      <strong>{currentMID.mid}</strong>. This rule will be executed for this MID. Proceed?
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

