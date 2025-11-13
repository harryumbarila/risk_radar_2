'use client';
import React from 'react';
import {
  Box,
  VStack,
  Text,
  Table,
  HStack,
  Badge,
  Button,
  SimpleGrid,
  Select,
  Portal,
  createListCollection,
} from '@chakra-ui/react';
import { UserCog, Eye } from 'lucide-react';
import { MerchantTransaction } from '@/data/interfaces/transaction';
import BatchDrawer from '../batch-drawer/batch-drawer';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

interface AnalystBatchSummary {
  analyst: string;
  totalBatches: number;
  reviewed: number;
  inProgress: number;
  unreviewed: number;
  lastUpdated: string;
  batches: MerchantTransaction[][];
}

interface ManagerQueueViewProps {
  allBatches: MerchantTransaction[][];
}

export default function ManagerQueueView({ allBatches }: ManagerQueueViewProps) {
  const [selectedAnalyst, setSelectedAnalyst] = React.useState<string>('all');

  // Group batches by analyst (mock data)
  const analystSummaries: AnalystBatchSummary[] = React.useMemo(() => {
    const analysts = ['John Doe', 'Jane Smith', 'Bob Johnson'];
    return analysts.map((analyst, index) => {
      const analystBatches = allBatches.slice(
        index * 3,
        (index + 1) * 3
      );
      const reviewed = Math.floor(analystBatches.length * 0.3);
      const inProgress = Math.floor(analystBatches.length * 0.2);
      const unreviewed = analystBatches.length - reviewed - inProgress;

      return {
        analyst,
        totalBatches: analystBatches.length,
        reviewed,
        inProgress,
        unreviewed,
        lastUpdated: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        batches: analystBatches,
      };
    });
  }, [allBatches]);

  const filteredSummaries =
    selectedAnalyst === 'all'
      ? analystSummaries
      : analystSummaries.filter((s) => s.analyst === selectedAnalyst);

  // Calculate totals for donut chart
  const chartData = React.useMemo(() => {
    const totals = analystSummaries.reduce(
      (acc, summary) => {
        acc.reviewed += summary.reviewed;
        acc.inProgress += summary.inProgress;
        acc.unreviewed += summary.unreviewed;
        return acc;
      },
      { reviewed: 0, inProgress: 0, unreviewed: 0 }
    );

    return [
      { name: 'Reviewed', value: totals.reviewed, color: '#10b981' },
      { name: 'In Progress', value: totals.inProgress, color: '#f59e0b' },
      { name: 'Unreviewed', value: totals.unreviewed, color: '#6b7280' },
    ];
  }, [analystSummaries]);

  const analystCollection = React.useMemo(
    () =>
      createListCollection({
        items: [
          { label: 'All Analysts', value: 'all' },
          ...analystSummaries.map((s) => ({
            label: s.analyst,
            value: s.analyst,
          })),
        ],
      }),
    [analystSummaries]
  );

  return (
    <VStack align="stretch" gap={6}>
      {/* Header */}
      <HStack justify="space-between" align="center">
        <HStack gap={2}>
          <Box color="blue.500">
            <UserCog size={24} />
          </Box>
          <Text fontSize="lg" fontWeight="bold" color="gray.900">
            Manager Queue
          </Text>
        </HStack>
        <Select.Root
          collection={analystCollection}
          value={[selectedAnalyst]}
          onValueChange={(e) => setSelectedAnalyst(e.value[0] || 'all')}
          size="sm"
          width="200px"
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
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {analystCollection.items.map((item) => (
                  <Select.Item item={item} key={item.value}>
                    {item.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      </HStack>

      {/* Summary Chart */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
        <Box
          bg="white"
          p={6}
          borderRadius="xl"
          boxShadow="0 2px 8px rgba(0,0,0,0.05)"
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Text fontSize="md" fontWeight="semibold" color="gray.900" mb={4}>
            Workload Overview
          </Text>
          <Box height="250px" width="100%">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }: { name: string; percent?: number }) =>
                    `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Summary Stats */}
        <Box
          bg="white"
          p={6}
          borderRadius="xl"
          boxShadow="0 2px 8px rgba(0,0,0,0.05)"
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Text fontSize="md" fontWeight="semibold" color="gray.900" mb={4}>
            Summary Statistics
          </Text>
          <VStack align="stretch" gap={4}>
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.600">
                Total Analysts
              </Text>
              <Text fontSize="lg" fontWeight="bold" color="gray.900">
                {analystSummaries.length}
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.600">
                Total Batches
              </Text>
              <Text fontSize="lg" fontWeight="bold" color="gray.900">
                {analystSummaries.reduce((sum, s) => sum + s.totalBatches, 0)}
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.600">
                Reviewed
              </Text>
              <Badge colorPalette="green" variant="solid" px={3} py={1}>
                {chartData[0]?.value ?? 0}
              </Badge>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.600">
                In Progress
              </Text>
              <Badge colorPalette="yellow" variant="solid" px={3} py={1}>
                {chartData[1]?.value ?? 0}
              </Badge>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.600">
                Unreviewed
              </Text>
              <Badge colorPalette="gray" variant="solid" px={3} py={1}>
                {chartData[2]?.value ?? 0}
              </Badge>
            </HStack>
          </VStack>
        </Box>
      </SimpleGrid>

      {/* Analyst Table */}
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
                <Table.ColumnHeader>Analyst</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">Total Batches</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">Reviewed</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">In Progress</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">Unreviewed</Table.ColumnHeader>
                <Table.ColumnHeader>Last Updated</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center">Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredSummaries.map((summary) => (
                <Table.Row key={summary.analyst}>
                  <Table.Cell>
                    <Text fontWeight="semibold">{summary.analyst}</Text>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    {summary.totalBatches}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Badge colorPalette="green" variant="subtle">
                      {summary.reviewed}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Badge colorPalette="yellow" variant="subtle">
                      {summary.inProgress}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Badge colorPalette="gray" variant="subtle">
                      {summary.unreviewed}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{summary.lastUpdated}</Table.Cell>
                  <Table.Cell textAlign="center">
                    <HStack justify="center" gap={2}>
                      {summary.batches.map((batch, index) => (
                        <BatchDrawer
                          key={index}
                          batch={batch}
                          trigger={
                            <Button size="xs" variant="outline">
                              <Eye size={14} />
                              View
                            </Button>
                          }
                        />
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

