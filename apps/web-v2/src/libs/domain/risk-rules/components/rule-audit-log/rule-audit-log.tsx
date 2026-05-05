'use client';

import React from 'react';
import {
  Box,
  Table,
  VStack,
  Text,
  HStack,
  Skeleton,
  Badge,
  Button,
  Avatar,
} from '@chakra-ui/react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useRules } from '../../context/rules-context';

interface RuleAuditLogProps {
  ruleId: string;
}

type SortField = 'modifiedBy' | 'date' | null;
type SortDirection = 'asc' | 'desc';

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getUserBadgeColor(user: string): string {
  if (user.toLowerCase() === 'system') return 'gray';
  if (user.toLowerCase().includes('admin')) return 'red';
  if (user.toLowerCase().includes('analyst') || user.toLowerCase() === 'harry') return 'blue';
  return 'gray';
}

function getUserInitials(user: string): string {
  return user
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function RuleAuditLog({ ruleId }: RuleAuditLogProps): React.JSX.Element {
  const [isLoading] = React.useState(false);
  const [sortField, setSortField] = React.useState<SortField>(null);
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('desc');
  const { ruleAuditLogs } = useRules();
  const auditLogsRaw = ruleAuditLogs[ruleId] || [];

  // Sort audit logs
  const auditLogs = React.useMemo(() => {
    if (!sortField) return auditLogsRaw;

    const sorted = [...auditLogsRaw].sort((a, b) => {
      if (sortField === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
      if (sortField === 'modifiedBy') {
        const nameA = a.modifiedBy.toLowerCase();
        const nameB = b.modifiedBy.toLowerCase();
        return sortDirection === 'asc'
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
      return 0;
    });

    return sorted;
  }, [auditLogsRaw, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  if (isLoading) {
    return (
      <VStack align="stretch" gap={4}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height="60px" borderRadius="md" />
        ))}
      </VStack>
    );
  }

  if (auditLogs.length === 0) {
    return (
      <Box
        bg="gray.50"
        p={8}
        borderRadius="md"
        borderWidth="1px"
        borderColor="gray.200"
        textAlign="center"
      >
        <Text fontSize="sm" color="gray.500">
          No audit log entries found for this rule.
        </Text>
      </Box>
    );
  }

  return (
    <Box
      bg="white"
      borderRadius="md"
      borderWidth="1px"
      borderColor="gray.200"
      overflowX="auto"
      position="relative"
      maxH="600px"
      overflowY="auto"
    >
      <Table.Root>
        <Table.Header position="sticky" top={0} zIndex={5} bg="white" boxShadow="sm">
          <Table.Row>
            <Table.ColumnHeader>Parameter</Table.ColumnHeader>
            <Table.ColumnHeader>Previous</Table.ColumnHeader>
            <Table.ColumnHeader>New</Table.ColumnHeader>
            <Table.ColumnHeader>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => handleSort('modifiedBy')}
                aria-label="Sort by Modified By"
                _hover={{ bg: 'gray.50' }}
              >
                <HStack gap={1}>
                  <Text fontSize="xs" fontWeight="medium">
                    Modified By
                  </Text>
                  {sortField === 'modifiedBy' ? (
                    sortDirection === 'asc' ? (
                      <ArrowUp size={14} />
                    ) : (
                      <ArrowDown size={14} />
                    )
                  ) : (
                    <ArrowUpDown size={14} color="gray.400" />
                  )}
                </HStack>
              </Button>
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => handleSort('date')}
                aria-label="Sort by Date"
                _hover={{ bg: 'gray.50' }}
              >
                <HStack gap={1}>
                  <Text fontSize="xs" fontWeight="medium">
                    Date
                  </Text>
                  {sortField === 'date' ? (
                    sortDirection === 'asc' ? (
                      <ArrowUp size={14} />
                    ) : (
                      <ArrowDown size={14} />
                    )
                  ) : (
                    <ArrowUpDown size={14} color="gray.400" />
                  )}
                </HStack>
              </Button>
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {auditLogs.map((entry) => (
            <Table.Row key={entry.id}>
              <Table.Cell>
                <Text fontSize="sm" color="gray.900">
                  {entry.parameterLabel}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm" color="gray.700" fontFamily="mono">
                  {entry.previousValue}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm" color="gray.700" fontFamily="mono">
                  {entry.newValue}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <HStack gap={2}>
                  <Avatar.Root size="xs" colorPalette={getUserBadgeColor(entry.modifiedBy)}>
                    <Avatar.Fallback>{getUserInitials(entry.modifiedBy)}</Avatar.Fallback>
                  </Avatar.Root>
                  <Badge
                    variant="subtle"
                    colorPalette={getUserBadgeColor(entry.modifiedBy)}
                    px={2}
                    py={0.5}
                    borderRadius="md"
                    fontSize="xs"
                  >
                    {entry.modifiedBy}
                  </Badge>
                </HStack>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm" color="gray.600">
                  {formatDate(entry.date)}
                </Text>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}

