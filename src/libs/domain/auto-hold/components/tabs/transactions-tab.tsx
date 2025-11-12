'use client';
import React from 'react';
import { Box, VStack, Text, Table, Badge, HStack } from '@chakra-ui/react';
import { CreditCard } from 'lucide-react';
import { MerchantTransaction } from '@/data/interfaces/transaction';

interface TransactionsTabProps {
  transactions: MerchantTransaction[];
}

export default function TransactionsTab({ transactions }: TransactionsTabProps) {
  // Transform transactions to match legacy format
  const transactionData = transactions.map((tx) => ({
    transDate: tx.date,
    authAmount: tx.amount,
    transAmount: tx.amount,
    pos: 'E-Commerce',
    avs: 'Y',
    authCode: `A${Math.floor(Math.random() * 100000)}`,
    cardNumber: `**** **** **** ${Math.floor(Math.random() * 10000)}`,
    pin: 'Verified',
    eligibleExceptions: tx.exception.split(',').map((e) => e.trim()),
  }));

  return (
    <VStack align="stretch" gap={4}>
      <HStack gap={2} mb={2}>
        <Box color="blue.500">
          <CreditCard size={20} />
        </Box>
        <Text fontSize="lg" fontWeight="semibold" color="gray.900">
          Transaction Details
        </Text>
      </HStack>

      <Box
        bg="white"
        borderRadius="xl"
        boxShadow="0 2px 8px rgba(0,0,0,0.05)"
        borderWidth="1px"
        borderColor="gray.200"
        overflowX="auto"
      >
        <Table.ScrollArea>
          <Table.Root size="sm" stickyHeader>
            <Table.Header>
              <Table.Row bg="gray.50">
                <Table.ColumnHeader>Trans Date</Table.ColumnHeader>
                <Table.ColumnHeader>Auth Amount</Table.ColumnHeader>
                <Table.ColumnHeader>Trans Amount</Table.ColumnHeader>
                <Table.ColumnHeader>POS</Table.ColumnHeader>
                <Table.ColumnHeader>AVS</Table.ColumnHeader>
                <Table.ColumnHeader>Auth Code</Table.ColumnHeader>
                <Table.ColumnHeader>Card #</Table.ColumnHeader>
                <Table.ColumnHeader>PIN</Table.ColumnHeader>
                <Table.ColumnHeader>Eligible Exceptions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {transactionData.map((tx, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{tx.transDate}</Table.Cell>
                  <Table.Cell>
                    <Text fontWeight="semibold">{tx.authAmount}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontWeight="semibold">{tx.transAmount}</Text>
                  </Table.Cell>
                  <Table.Cell>{tx.pos}</Table.Cell>
                  <Table.Cell>
                    <Badge
                      colorPalette={tx.avs === 'Y' ? 'green' : 'red'}
                      variant="subtle"
                    >
                      {tx.avs}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="xs" fontFamily="mono">
                      {tx.authCode}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="xs" fontFamily="mono">
                      {tx.cardNumber}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>{tx.pin}</Table.Cell>
                  <Table.Cell>
                    <HStack gap={1} flexWrap="wrap">
                      {tx.eligibleExceptions.map((code) => (
                        <Badge
                          key={code}
                          colorPalette="blue"
                          variant="subtle"
                          fontSize="xs"
                        >
                          {code}
                        </Badge>
                      ))}
                    </HStack>
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

