'use client';
import React from 'react';
import {
  Badge,
  Box,
  Button,
  HStack,
  VStack,
  Text,
  SimpleGrid,
  Select,
  Portal,
  createListCollection,
} from '@chakra-ui/react';
import { Ban } from 'lucide-react';
import {
  MdOutlineArrowUpward,
  MdCheck,
  MdOutlineRemoveRedEye,
} from 'react-icons/md';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { MerchantTransaction } from '@/data/interfaces/transaction';
import { statusColor } from '@/libs/utils/utils';
import { DataTable } from '@/ui/components/common/organisms/data-table';
import { CollapsibleBodyProps } from '@/ui/components/common/organisms/data-table/data-table.model';
import BatchDrawer from '@/libs/domain/auto-hold/components/batch-drawer/batch-drawer';

const columnHelper = createColumnHelper<MerchantTransaction>();

function CollapsibleContent(props: CollapsibleBodyProps<MerchantTransaction>) {
  return (
    <Box
      p={6}
      display="flex"
      flexDirection="column"
      gap={4}
      bg="bg"
      borderWidth="1px"
      borderRadius={10}
    >
      {/* Header */}
      <Box>
        <Text fontWeight="bold" fontSize="lg">
          Transaction Details
        </Text>
      </Box>

      {/* Transaction Info Grid */}
      <SimpleGrid columns={{ base: 1, md: 3 }}>
        <VStack align="start" gap={1}>
          <Text fontWeight="normal" color="gray.500">
            Transaction ID
          </Text>
          <Text fontWeight="bold">{props.row.original.id}</Text>
        </VStack>

        <VStack align="start" gap={1}>
          <Text fontWeight="normal" color="gray.500">
            Processor
          </Text>
          <Text fontWeight="bold">TSYS</Text>
        </VStack>

        <VStack align="start" gap={1}>
          <Text fontWeight="normal" color="gray.500">
            Date & Time
          </Text>
          <Text fontWeight="bold">Apr 8, 2025, 9:15:00 AM</Text>
        </VStack>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 3 }}>
        <VStack align="start" gap={1}>
          <Text fontWeight="normal" color="gray.500">
            MID
          </Text>
          <Text fontWeight="bold">8675309001</Text>
        </VStack>

        <VStack align="start" gap={1}>
          <Text fontWeight="normal" color="gray.500">
            DBA
          </Text>
          <Text fontWeight="bold">GTS Inc.</Text>
        </VStack>
      </SimpleGrid>

      {/* Risk Assessment */}
      <VStack align="start" gap={1}>
        <Text fontWeight="semibold" color="gray.500">
          Risk Assessment
        </Text>
        <Text>
          Transaction originated from a high-risk jurisdiction with an amount
          significantly above the merchant&apos;s average transaction value.
          Multiple rapid transactions observed from the same IP address within a
          24-hour period.
        </Text>
      </VStack>

      {/* Action Buttons */}
      <HStack justify="flex-end" w="full" gap={4} pt={2}>
        <Button variant="outline">
          <MdOutlineArrowUpward />
          Escalate
        </Button>
        <Button>
          <MdCheck />
          Mark as Reviewed
        </Button>
      </HStack>
    </Box>
  );
}

export default function CustomTable() {
  const transactions: MerchantTransaction[] = [
    {
      id: '1',
      merchant: 'Global Tech Solutions',
      amount: '$12,500.00',
      exception: 'High-risk country, Unusual amount',
      processor: 'TSYS',
      mid: '8675309001',
      date: 'Apr 8, 9:15 AM',
      status: 'Unreviewed',
      createdAt: '2025-04-08T09:15:00.000Z',
      updatedAt: '2025-04-08T09:15:00.000Z',
    },
    {
      id: '2',
      merchant: 'Oceanview Logistics',
      amount: '$8,750.50',
      exception: 'New merchant, Pattern match anomaly',
      processor: 'Fiserv',
      mid: '8675309002',
      date: 'Apr 8, 10:23 AM',
      status: 'In Progress',
      createdAt: '2025-04-08T10:23:00.000Z',
      updatedAt: '2025-04-08T10:23:00.000Z',
    },
    {
      id: '3',
      merchant: 'Sunshine Pharmacy',
      amount: '$456.78',
      exception: 'Frequency anomaly',
      processor: 'Worldpay',
      mid: '8675309003',
      date: 'Apr 8, 11:05 AM',
      status: 'Unreviewed',
      createdAt: '2025-04-08T11:05:00.000Z',
      updatedAt: '2025-04-08T11:05:00.000Z',
    },
    {
      id: '4',
      merchant: 'Digital Assets Exchange',
      amount: '$25,000.00',
      exception: 'High-risk merchant category, ...',
      processor: 'Stripe',
      mid: '8675309004',
      date: 'Apr 8, 8:45 AM',
      status: 'Unreviewed',
      createdAt: '2025-04-08T08:45:00.000Z',
      updatedAt: '2025-04-08T08:45:00.000Z',
    },
    {
      id: '5',
      merchant: 'City Supermarket',
      amount: '$125.45',
      exception: 'Manual review flag',
      processor: 'TSYS',
      mid: '8675309005',
      date: 'Apr 8, 2:30 PM',
      status: 'Reviewed',
      createdAt: '2025-04-08T14:30:00.000Z',
      updatedAt: '2025-04-08T14:30:00.000Z',
    },
    {
      id: '6',
      merchant: 'QuickWire Transfers',
      amount: '$3,500.00',
      exception: 'High-risk country, Pattern match',
      processor: 'Adyen',
      mid: '8675309006',
      date: 'Apr 8, 12:15 PM',
      status: 'Unreviewed',
      createdAt: '2025-04-08T12:15:00.000Z',
      updatedAt: '2025-04-08T12:15:00.000Z',
    },
    {
      id: '7',
      merchant: 'Business Equipment Pro',
      amount: '$6,789.99',
      exception: 'Unusual amount for merchant',
      processor: 'Fiserv',
      mid: '8675309007',
      date: 'Apr 8, 9:50 AM',
      status: 'In Progress',
      createdAt: '2025-04-08T09:50:00.000Z',
      updatedAt: '2025-04-08T09:50:00.000Z',
    },
    {
      id: '8',
      merchant: 'Luxury Boutique',
      amount: '$15,750.00',
      exception: 'Unusual amount, New merchant',
      processor: 'Worldpay',
      mid: '8675309008',
      date: 'Apr 8, 1:20 PM',
      status: 'Unreviewed',
      createdAt: '2025-04-08T13:20:00.000Z',
      updatedAt: '2025-04-08T13:20:00.000Z',
    },
    {
      id: '9',
      merchant: 'Downtown Hotel',
      amount: '$1,250.00',
      exception: 'Frequency anomaly',
      processor: 'TSYS',
      mid: '8675309009',
      date: 'Apr 8, 3:10 PM',
      status: 'Reviewed',
      createdAt: '2025-04-08T15:10:00.000Z',
      updatedAt: '2025-04-08T15:10:00.000Z',
    },
    {
      id: '10',
      merchant: 'Global Shipping Co',
      amount: '$4,325.50',
      exception: 'High-risk country, Pattern match',
      processor: 'Stripe',
      mid: '8675309010',
      date: 'Apr 8, 10:45 AM',
      status: 'Unreviewed',
      createdAt: '2025-04-08T10:45:00.000Z',
      updatedAt: '2025-04-08T10:45:00.000Z',
    },
  ];

  // Define columns inside the component to access transactions
  const columns = React.useMemo(() => [
    columnHelper.accessor('merchant', {
      header: () => 'Merchant',
      enableSorting: true,
    }),
    columnHelper.accessor('amount', {
      header: () => 'Amount',
      enableSorting: true,
    }),
    columnHelper.accessor('exception', {
      header: () => 'Exception',
      enableSorting: true,
    }),
    columnHelper.accessor('processor', {
      header: () => 'Processor',
      enableSorting: true,
    }),
    columnHelper.accessor('mid', {
      header: () => 'MID',
      enableSorting: true,
    }),
    columnHelper.accessor('date', {
      header: () => 'Date',
      enableSorting: true,
    }),
    columnHelper.accessor('status', {
      header: () => 'Status',
      cell: (info) => (
        <Badge
          colorPalette={statusColor[info.getValue()]}
          variant="subtle"
          px={3}
          py={1}
          borderRadius="md"
        >
          {info.getValue()}
        </Badge>
      ),
      enableSorting: true,
    }),
    columnHelper.display({
      id: 'actions',
      header: () => 'Actions',
      cell: (props) => {
        // Group transactions by batch (using merchant + date as batch identifier)
        const batchId = `${props.row.original.merchant}-${props.row.original.date}`;
        const batchTransactions = transactions.filter(
          (tx) => `${tx.merchant}-${tx.date}` === batchId
        );

        return (
          <HStack justify="center" gap={2}>
            <BatchDrawer
              batch={batchTransactions}
              trigger={
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="gray"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MdOutlineRemoveRedEye />
                  View Batch
                </Button>
              }
            />
          </HStack>
        );
      },
    }),
  ] as ColumnDef<MerchantTransaction>[], [transactions]);

  const frameworks = createListCollection({
    items: [
      { label: '10', value: '10' },
      { label: '25', value: '25' },
      { label: '50', value: '50' },
    ],
  });
  return (
    <Box borderWidth="1px" borderRadius="lg" p={6} bg="white" shadow="sm">
      {/* Header */}
      <VStack align="start" gap={2} mb={4}>
        <Text fontWeight="bold" fontSize="lg">
          Transaction Review
        </Text>
        <Text color="gray.600" fontSize="sm">
          10 transactions flagged for review between <b>October 28, 2025</b> and{' '}
          <b>October 28, 2025</b>
        </Text>
      </VStack>

      {/* Table */}
      {/* <Table.Root size="sm" variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Merchant</Table.ColumnHeader>
            <Table.ColumnHeader>Amount</Table.ColumnHeader>
            <Table.ColumnHeader>Exception</Table.ColumnHeader>
            <Table.ColumnHeader>Processor</Table.ColumnHeader>
            <Table.ColumnHeader>MID</Table.ColumnHeader>
            <Table.ColumnHeader>Date</Table.ColumnHeader>
            <Table.ColumnHeader>Status</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="center">Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {transactions.map((tx) => (
            <CustomTableRow key={tx.id} tx={tx} />
          ))}
        </Table.Body>
      </Table.Root> */}

      <DataTable
        data={{
          data: transactions,
          count: transactions.length,
          page: 1,
          pageCount: transactions.length,
          total: transactions.length,
        }}
        isLoading={false}
        columns={columns}
        CollapsibleBody={CollapsibleContent}
      />

      {/* Footer */}
      <HStack justify="space-between" mt={4}>
        <HStack>
          <Text fontSize="sm">Show</Text>

          <Select.Root collection={frameworks} size="sm" width="320px">
            <Select.HiddenSelect />
            <Select.Label>Select framework</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select framework" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {frameworks.items.map((framework) => (
                    <Select.Item item={framework} key={framework.value}>
                      {framework.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>

          <Text fontSize="sm">records per page</Text>
        </HStack>

        <Text fontSize="sm" color="gray.600">
          Showing 1 to 10 of 10 entries
        </Text>

        <HStack gap={2}>
          <Button size="xs" variant="outline">
            1
          </Button>
          <Button size="xs" variant="ghost" disabled>
            &gt;
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
}
