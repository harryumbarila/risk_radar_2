'use client';

import React from 'react';
import {
  Box,
  Table,
  HStack,
  VStack,
  Text,
  Badge,
  Button,
  Skeleton,
} from '@chakra-ui/react';
import { Settings } from 'lucide-react';
import { useWhitelistStore, type MCCWhitelistData } from './useWhitelistStore';

interface MCCMainTableProps {
  mccData: MCCWhitelistData[];
  isLoading?: boolean;
}

function getRiskLevelColor(riskLevel: string): string {
  switch (riskLevel) {
    case 'High':
      return 'red';
    case 'Medium':
      return 'amber';
    case 'Low':
      return 'green';
    default:
      return 'gray';
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function MCCMainTable({ mccData, isLoading }: MCCMainTableProps): React.JSX.Element {
  const { openDrawer } = useWhitelistStore();

  if (isLoading) {
    return (
      <VStack align="stretch" gap={4}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} height="60px" borderRadius="lg" />
        ))}
      </VStack>
    );
  }

  if (mccData.length === 0) {
    return (
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        borderWidth="1px"
        borderColor="gray.200"
        textAlign="center"
      >
        <Text fontSize="lg" color="gray.500">
          No MCC codes found.
        </Text>
      </Box>
    );
  }

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
            <Table.ColumnHeader>MCC</Table.ColumnHeader>
            <Table.ColumnHeader>Description</Table.ColumnHeader>
            <Table.ColumnHeader>Processor</Table.ColumnHeader>
            <Table.ColumnHeader>Risk Level</Table.ColumnHeader>
            <Table.ColumnHeader>Whitelisted Rules</Table.ColumnHeader>
            <Table.ColumnHeader>Last Updated</Table.ColumnHeader>
            <Table.ColumnHeader>Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {mccData.map((mcc) => (
            <Table.Row
              key={mcc.mcc}
              _hover={{
                bg: 'gray.50',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
              transition="all 0.15s ease-in-out"
            >
              <Table.Cell>
                <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                  {mcc.mcc}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm" color="gray.700">
                  {mcc.description}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm" color="gray.700">
                  {mcc.processor}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Badge
                  variant="subtle"
                  colorPalette={getRiskLevelColor(mcc.risk_level)}
                  px={3}
                  py={1}
                  borderRadius="md"
                  bg={
                    mcc.risk_level === 'High'
                      ? 'red.100'
                      : mcc.risk_level === 'Medium'
                        ? 'amber.100'
                        : 'emerald.100'
                  }
                  color={
                    mcc.risk_level === 'High'
                      ? 'red.700'
                      : mcc.risk_level === 'Medium'
                        ? 'amber.700'
                        : 'emerald.700'
                  }
                >
                  {mcc.risk_level}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Badge
                  variant="subtle"
                  colorPalette="blue"
                  px={3}
                  py={1}
                  borderRadius="md"
                >
                  {mcc.whitelist.length} {mcc.whitelist.length === 1 ? 'rule' : 'rules'}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm" color="gray.600">
                  {formatDate(mcc.last_updated)}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDrawer(mcc)}
                  aria-label={`Manage whitelist for MCC ${mcc.mcc}`}
                  suppressHydrationWarning
                >
                  <HStack gap={1}>
                    <Settings size={16} />
                    <Text>Manage</Text>
                  </HStack>
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}

