'use client';
import React from 'react';
import { Box, VStack, Text, Table, Badge, HStack } from '@chakra-ui/react';
import { Users } from 'lucide-react';

interface MatchedMerchant {
  merchantId: string;
  merchantName: string;
  taxId: string;
  status: string;
}

interface MatchTabProps {
  merchantId: string;
  taxId?: string;
}

export default function MatchTab({ merchantId, taxId = '12-3456789' }: MatchTabProps) {
  // Mock data - merchants with same Tax ID
  const matchedMerchants: MatchedMerchant[] = [
    {
      merchantId: 'MID123456',
      merchantName: 'Global Tech Solutions',
      taxId: '12-3456789',
      status: 'Active',
    },
    {
      merchantId: 'MID789012',
      merchantName: 'Tech Global Inc',
      taxId: '12-3456789',
      status: 'Active',
    },
    {
      merchantId: 'MID345678',
      merchantName: 'Solutions Global Tech',
      taxId: '12-3456789',
      status: 'Suspended',
    },
  ];

  return (
    <VStack align="stretch" gap={4}>
      <HStack gap={2} mb={2}>
        <Box color="blue.500">
          <Users size={20} />
        </Box>
        <Text fontSize="lg" fontWeight="semibold" color="gray.900">
          Matched Merchants (Same Tax ID)
        </Text>
      </HStack>

      <Box
        p={4}
        bg="blue.50"
        borderRadius="md"
        borderWidth="1px"
        borderColor="blue.200"
      >
        <Text fontSize="sm" color="blue.800">
          <Text as="span" fontWeight="semibold">Tax ID:</Text> {taxId}
        </Text>
      </Box>

      <Box
        bg="white"
        borderRadius="xl"
        boxShadow="0 2px 8px rgba(0,0,0,0.05)"
        borderWidth="1px"
        borderColor="gray.200"
        overflowX="auto"
      >
        <Table.ScrollArea>
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row bg="gray.50">
                <Table.ColumnHeader>Merchant ID</Table.ColumnHeader>
                <Table.ColumnHeader>Merchant Name</Table.ColumnHeader>
                <Table.ColumnHeader>Tax ID</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {matchedMerchants.map((merchant) => (
                <Table.Row key={merchant.merchantId}>
                  <Table.Cell>
                    <Text fontWeight="semibold" color="blue.600">
                      {merchant.merchantId}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>{merchant.merchantName}</Table.Cell>
                  <Table.Cell>{merchant.taxId}</Table.Cell>
                  <Table.Cell>
                    <Badge
                      colorPalette={
                        merchant.status === 'Active' ? 'green' : 'red'
                      }
                      variant="subtle"
                    >
                      {merchant.status}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Box>
    </VStack>
  );
}

