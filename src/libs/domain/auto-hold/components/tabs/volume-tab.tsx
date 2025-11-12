'use client';
import React from 'react';
import { Box, VStack, Text, Table, HStack } from '@chakra-ui/react';
import { BarChart3 } from 'lucide-react';

interface MonthlyVolume {
  month: string;
  transactionCount: number;
  totalAmount: string;
  averageAmount: string;
}

interface VolumeTabProps {
  merchantId: string;
}

export default function VolumeTab({ merchantId }: VolumeTabProps) {
  // Mock data - monthly volume
  const monthlyVolumes: MonthlyVolume[] = [
    {
      month: 'January 2025',
      transactionCount: 1250,
      totalAmount: '$125,000.00',
      averageAmount: '$100.00',
    },
    {
      month: 'February 2025',
      transactionCount: 1380,
      totalAmount: '$145,200.00',
      averageAmount: '$105.22',
    },
    {
      month: 'March 2025',
      transactionCount: 1520,
      totalAmount: '$168,500.00',
      averageAmount: '$110.86',
    },
    {
      month: 'April 2025',
      transactionCount: 1480,
      totalAmount: '$162,800.00',
      averageAmount: '$110.00',
    },
  ];

  return (
    <VStack align="stretch" gap={4}>
      <HStack gap={2} mb={2}>
        <Box color="green.500">
          <BarChart3 size={20} />
        </Box>
        <Text fontSize="lg" fontWeight="semibold" color="gray.900">
          Monthly Volume
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
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row bg="gray.50">
                <Table.ColumnHeader>Month</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">
                  Transaction Count
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">Total Amount</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">
                  Average Amount
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {monthlyVolumes.map((volume, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <Text fontWeight="semibold">{volume.month}</Text>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    {volume.transactionCount.toLocaleString()}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Text fontWeight="semibold">{volume.totalAmount}</Text>
                  </Table.Cell>
                  <Table.Cell textAlign="right">{volume.averageAmount}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Box>
    </VStack>
  );
}

