'use client';

import React from 'react';
import {
  Box,
  Table,
  VStack,
  HStack,
  Text,
  Badge,
  Avatar,
  Button,
} from '@chakra-ui/react';
import { useWhitelistStore } from '../useWhitelistStore';

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
  if (user.toLowerCase().includes('user') || user.toLowerCase().includes('current')) return 'blue';
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

function getActionIcon(action: string): string {
  if (action.toLowerCase().includes('added') || action.toLowerCase().includes('activate')) {
    return '🟢';
  }
  if (action.toLowerCase().includes('removed') || action.toLowerCase().includes('exclude')) {
    return '🔴';
  }
  return '⚪';
}

export default function AuditLogTab(): React.JSX.Element {
  const { currentMCC, auditLogs } = useWhitelistStore();
  const [showAll, setShowAll] = React.useState(false);

  if (!currentMCC) return null;

  const logs = auditLogs[currentMCC.mcc] || [];
  const displayedLogs = showAll ? logs : logs.slice(0, 5);
  const hasMore = logs.length > 5;

  if (logs.length === 0) {
    return (
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        borderWidth="1px"
        borderColor="gray.200"
        textAlign="center"
      >
        <Text fontSize="sm" color="gray.500">
          No audit log entries found for this MCC.
        </Text>
      </Box>
    );
  }

  return (
    <VStack align="stretch" gap={4}>
      <Box
        bg="white"
        borderRadius="xl"
        borderWidth="1px"
        borderColor="gray.200"
        boxShadow="0 2px 8px rgba(0,0,0,0.05)"
        overflowX="auto"
        position="relative"
        maxH="600px"
        overflowY="auto"
      >
        <Table.Root>
          <Table.Header position="sticky" top={0} zIndex={5} bg="white" boxShadow="sm">
            <Table.Row>
              <Table.ColumnHeader>Action</Table.ColumnHeader>
              <Table.ColumnHeader>Rule</Table.ColumnHeader>
              <Table.ColumnHeader>Modified By</Table.ColumnHeader>
              <Table.ColumnHeader>Date</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {displayedLogs.map((entry) => (
              <Table.Row key={entry.id}>
                <Table.Cell>
                  <HStack gap={2}>
                    <Text fontSize="sm">{getActionIcon(entry.action)}</Text>
                    <Badge
                      variant="subtle"
                      colorPalette={entry.action.includes('Added') || entry.action.includes('activate') ? 'green' : 'red'}
                      px={3}
                      py={1}
                      borderRadius="md"
                      bg={
                        entry.action.includes('Added') || entry.action.includes('activate')
                          ? 'green.100'
                          : 'red.100'
                      }
                      color={
                        entry.action.includes('Added') || entry.action.includes('activate')
                          ? 'green.700'
                          : 'red.700'
                      }
                    >
                      {entry.action}
                    </Badge>
                  </HStack>
                </Table.Cell>
                <Table.Cell>
                  <Text fontSize="sm" color="gray.900" fontWeight="medium">
                    {entry.rule}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <HStack gap={2}>
                    <Avatar.Root size="xs" colorPalette={getUserBadgeColor(entry.modified_by)}>
                      <Avatar.Fallback>{getUserInitials(entry.modified_by)}</Avatar.Fallback>
                    </Avatar.Root>
                    <Badge
                      variant="subtle"
                      colorPalette={getUserBadgeColor(entry.modified_by)}
                      px={2}
                      py={0.5}
                      borderRadius="md"
                      fontSize="xs"
                    >
                      {entry.modified_by}
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

      {hasMore && (
        <Box textAlign="center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show less' : `View all (${logs.length} entries)`}
          </Button>
        </Box>
      )}
    </VStack>
  );
}
