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
import { useWhitelistStore, type MIDWhitelistData } from './useWhitelistStore';

interface MIDMainTableProps {
  midData: MIDWhitelistData[];
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

export default function MIDMainTable({ midData, isLoading }: MIDMainTableProps): React.JSX.Element {
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

  if (midData.length === 0) {
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
          No MID codes found.
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
            <Table.ColumnHeader>MID</Table.ColumnHeader>
            <Table.ColumnHeader>Merchant</Table.ColumnHeader>
            <Table.ColumnHeader>Processor</Table.ColumnHeader>
            <Table.ColumnHeader>Risk Level</Table.ColumnHeader>
            <Table.ColumnHeader>Whitelisted Rules</Table.ColumnHeader>
            <Table.ColumnHeader>Last Updated</Table.ColumnHeader>
            <Table.ColumnHeader>Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {midData.map((mid) => (
            <Table.Row
              key={mid.mid}
              _hover={{
                bg: 'gray.50',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
              transition="all 0.15s ease-in-out"
            >
              <Table.Cell>
                <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                  {mid.mid}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm" color="gray.700">
                  {mid.merchant}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm" color="gray.700">
                  {mid.processor}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Badge
                  variant="subtle"
                  colorPalette={getRiskLevelColor(mid.risk_level)}
                  px={3}
                  py={1}
                  borderRadius="md"
                  bg={
                    mid.risk_level === 'High'
                      ? 'red.100'
                      : mid.risk_level === 'Medium'
                        ? 'amber.100'
                        : 'emerald.100'
                  }
                  color={
                    mid.risk_level === 'High'
                      ? 'red.700'
                      : mid.risk_level === 'Medium'
                        ? 'amber.700'
                        : 'emerald.700'
                  }
                >
                  {mid.risk_level}
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
                  {mid.whitelist.length} {mid.whitelist.length === 1 ? 'rule' : 'rules'}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm" color="gray.600">
                  {formatDate(mid.last_updated)}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDrawer(mid)}
                  aria-label={`Manage whitelist for MID ${mid.mid}`}
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

