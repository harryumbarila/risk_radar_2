'use client';

import React from 'react';
import {
  Box,
  Table,
  VStack,
  Text,
  Badge,
  Tooltip,
  Portal,
} from '@chakra-ui/react';
import { Info } from 'lucide-react';
import { useWhitelistStore } from '../useWhitelistStore';
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

export default function OverviewTab(): React.JSX.Element | null {
  const { currentMCC } = useWhitelistStore();
  const rules = riskRulesData as unknown as RiskRule[];

  if (!currentMCC) return null;

  const excludedRulesSet = new Set(currentMCC.whitelist);

  return (
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
                  >
                    {rule.severity}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  {isExcluded ? (
                    <HStack gap={1}>
                      <Badge
                        variant="subtle"
                        colorPalette="red"
                        px={3}
                        py={1}
                        borderRadius="md"
                      >
                        Excluded
                      </Badge>
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
                              Excluded from execution for this MCC.
                            </Tooltip.Content>
                          </Tooltip.Positioner>
                        </Portal>
                      </Tooltip.Root>
                    </HStack>
                  ) : (
                    <Badge
                      variant="subtle"
                      colorPalette="green"
                      px={3}
                      py={1}
                      borderRadius="md"
                    >
                      Active
                    </Badge>
                  )}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}

