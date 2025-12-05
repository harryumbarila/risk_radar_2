'use client';
import React from 'react';
import { Box, VStack, Text, Table, HStack, Select, createListCollection, Tooltip, Portal } from '@chakra-ui/react';
import { BarChart3, Info } from 'lucide-react';

interface MonthlyVolume {
  month: string; // Format: "Month - Year" e.g., "January - 2025"
  volume: number; // Total volume amount
  avgTicket: number; // Average ticket amount
  cnpPercent: number; // CNP percentage
  highestTicket: number; // Highest ticket amount
  totalCB: number; // Total chargebacks
  numTrans: number; // Number of transactions
  icp: number; // ICP percentage based on transaction volume
}

interface VolumeTabProps {
  merchantId: string;
}

// Mock data generators for Auth and Capture
const generateAuthData = (): MonthlyVolume[] => [
  {
    month: 'January - 2025',
    volume: 125000.00,
    avgTicket: 100.00,
    cnpPercent: 85.5,
    highestTicket: 1250.00,
    totalCB: 12,
    numTrans: 1250,
    icp: 0.96,
  },
  {
    month: 'February - 2025',
    volume: 145200.00,
    avgTicket: 105.22,
    cnpPercent: 87.2,
    highestTicket: 1450.00,
    totalCB: 15,
    numTrans: 1380,
    icp: 1.09,
  },
  {
    month: 'March - 2025',
    volume: 168500.00,
    avgTicket: 110.86,
    cnpPercent: 88.1,
    highestTicket: 1680.00,
    totalCB: 18,
    numTrans: 1520,
    icp: 1.18,
  },
  {
    month: 'April - 2025',
    volume: 162800.00,
    avgTicket: 110.00,
    cnpPercent: 86.8,
    highestTicket: 1620.00,
    totalCB: 16,
    numTrans: 1480,
    icp: 1.08,
  },
];

const generateCaptureData = (): MonthlyVolume[] => [
  {
    month: 'January - 2025',
    volume: 118000.00,
    avgTicket: 95.00,
    cnpPercent: 82.3,
    highestTicket: 1180.00,
    totalCB: 10,
    numTrans: 1242,
    icp: 0.81,
  },
  {
    month: 'February - 2025',
    volume: 132500.00,
    avgTicket: 98.50,
    cnpPercent: 84.1,
    highestTicket: 1325.00,
    totalCB: 13,
    numTrans: 1345,
    icp: 0.97,
  },
  {
    month: 'March - 2025',
    volume: 152300.00,
    avgTicket: 102.15,
    cnpPercent: 85.7,
    highestTicket: 1523.00,
    totalCB: 15,
    numTrans: 1490,
    icp: 1.01,
  },
  {
    month: 'April - 2025',
    volume: 148600.00,
    avgTicket: 101.50,
    cnpPercent: 84.9,
    highestTicket: 1486.00,
    totalCB: 14,
    numTrans: 1464,
    icp: 0.96,
  },
];

export default function VolumeTab({ merchantId }: VolumeTabProps) {
  const [selectedType, setSelectedType] = React.useState<'Auth' | 'Capture'>('Auth');

  const typeCollection = React.useMemo(
    () =>
      createListCollection({
        items: [
          { label: 'Auth', value: 'Auth' },
          { label: 'Capture', value: 'Capture' },
        ],
      }),
    []
  );

  const monthlyVolumes = React.useMemo(() => {
    return selectedType === 'Auth' ? generateAuthData() : generateCaptureData();
  }, [selectedType]);

  const formatCurrency = (value: number): string => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatPercent = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <VStack align="stretch" gap={4}>
      <HStack justify="space-between" align="center" mb={2}>
        <HStack gap={2}>
          <Box color="green.500">
            <BarChart3 size={20} />
          </Box>
          <Text fontSize="lg" fontWeight="semibold" color="gray.900">
            Monthly Volume
          </Text>
        </HStack>
        <Box minW="150px">
          <Select.Root
            collection={typeCollection}
            value={[selectedType]}
            onValueChange={(details) => {
              const newValue = details.value[0];
              if (newValue === 'Auth' || newValue === 'Capture') {
                setSelectedType(newValue);
              }
            }}
            size="sm"
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Select.Positioner>
              <Select.Content>
                {typeCollection.items.map((item) => (
                  <Select.Item item={item} key={item.value}>
                    {item.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>
        </Box>
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
                <Table.ColumnHeader>Month - Year</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right"># Trans</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">Volume</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">Avg Ticket</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">Highest Ticket</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">CNP %</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">
                  <HStack gap={1} justify="flex-end" align="center" display="inline-flex">
                    <Text>Total CB</Text>
                    <Tooltip.Root openDelay={300} closeDelay={100}>
                      <Tooltip.Trigger asChild>
                        <Box
                          as="span"
                          color="gray.400"
                          _hover={{ color: 'gray.600' }}
                          cursor="help"
                          display="inline-flex"
                          alignItems="center"
                          aria-label="Total CB information"
                        >
                          <Info size={12} />
                        </Box>
                      </Tooltip.Trigger>
                      <Portal>
                        <Tooltip.Positioner>
                          <Tooltip.Content
                            maxW="250px"
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
                            Data source: Settled data
                          </Tooltip.Content>
                        </Tooltip.Positioner>
                      </Portal>
                    </Tooltip.Root>
                  </HStack>
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
                    {volume.numTrans.toLocaleString()}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Text fontWeight="semibold">{formatCurrency(volume.volume)}</Text>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    {formatCurrency(volume.avgTicket)}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    {formatCurrency(volume.highestTicket)}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    {formatPercent(volume.cnpPercent)}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <HStack gap={1} justify="flex-end" align="center" display="inline-flex">
                      <Text>{volume.totalCB}</Text>
                      <Tooltip.Root openDelay={300} closeDelay={100}>
                        <Tooltip.Trigger asChild>
                          <Box
                            as="span"
                            color="gray.400"
                            _hover={{ color: 'gray.600' }}
                            cursor="help"
                            display="inline-flex"
                            alignItems="center"
                            aria-label="Total CB information"
                          >
                            <Info size={12} />
                          </Box>
                        </Tooltip.Trigger>
                        <Portal>
                          <Tooltip.Positioner>
                            <Tooltip.Content
                              maxW="250px"
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
                              Data source: Settled data
                            </Tooltip.Content>
                          </Tooltip.Positioner>
                        </Portal>
                      </Tooltip.Root>
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

