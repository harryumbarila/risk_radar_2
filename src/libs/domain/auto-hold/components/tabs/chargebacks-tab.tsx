'use client';
import React from 'react';
import { Box, VStack, Text, Table, Badge, HStack } from '@chakra-ui/react';
import { AlertTriangle } from 'lucide-react';

interface Chargeback {
  caseNumber: string;
  transDate: string;
  amount: string;
  cardNumber: string;
  paymentType: string;
  receivedDate: string;
  reasonCode: string;
  createdDate: string;
}

interface ChargebacksTabProps {
  merchantId: string;
}

export default function ChargebacksTab({ merchantId }: ChargebacksTabProps) {
  // Mock data
  const chargebacks: Chargeback[] = [
    {
      caseNumber: 'CB-2025-001',
      transDate: '2025-03-15',
      amount: '$1,250.00',
      cardNumber: '**** **** **** 7391',
      paymentType: 'Credit',
      receivedDate: '2025-03-20',
      reasonCode: '4855',
      createdDate: '2025-03-20',
    },
    {
      caseNumber: 'CB-2025-002',
      transDate: '2025-03-18',
      amount: '$850.50',
      cardNumber: '**** **** **** 9736',
      paymentType: 'Debit',
      receivedDate: '2025-03-22',
      reasonCode: '4853',
      createdDate: '2025-03-22',
    },
  ];

  return (
    <VStack align="stretch" gap={4}>
      <HStack gap={2} mb={2}>
        <Box color="red.500">
          <AlertTriangle size={20} />
        </Box>
        <Text fontSize="lg" fontWeight="semibold" color="gray.900">
          Chargebacks
        </Text>
      </HStack>

      {chargebacks.length === 0 ? (
        <Box
          p={12}
          bg="gray.50"
          borderRadius="xl"
          textAlign="center"
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Text fontSize="sm" color="gray.600">
            No chargebacks found for this merchant.
          </Text>
        </Box>
      ) : (
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
                  <Table.ColumnHeader>Case #</Table.ColumnHeader>
                  <Table.ColumnHeader>Trans Date</Table.ColumnHeader>
                  <Table.ColumnHeader>Amount</Table.ColumnHeader>
                  <Table.ColumnHeader>Card #</Table.ColumnHeader>
                  <Table.ColumnHeader>Payment Type</Table.ColumnHeader>
                  <Table.ColumnHeader>Received Date</Table.ColumnHeader>
                  <Table.ColumnHeader>Reason Code</Table.ColumnHeader>
                  <Table.ColumnHeader>Created Date</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {chargebacks.map((cb) => (
                  <Table.Row key={cb.caseNumber}>
                    <Table.Cell>
                      <Text fontWeight="semibold" color="blue.600">
                        {cb.caseNumber}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>{cb.transDate}</Table.Cell>
                    <Table.Cell>
                      <Text fontWeight="semibold">{cb.amount}</Text>
                    </Table.Cell>
                    <Table.Cell>{cb.cardNumber}</Table.Cell>
                    <Table.Cell>
                      <Badge
                        colorPalette={cb.paymentType === 'Credit' ? 'blue' : 'green'}
                        variant="subtle"
                      >
                        {cb.paymentType}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>{cb.receivedDate}</Table.Cell>
                    <Table.Cell>
                      <Badge colorPalette="red" variant="solid">
                        {cb.reasonCode}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>{cb.createdDate}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        </Box>
      )}
    </VStack>
  );
}

