'use client';
import React from 'react';
import {
  Box,
  Table,
  Text,
  Badge,
  HStack,
  Button,
  IconButton,
  Dialog,
  Portal,
  VStack,
  Select,
  createListCollection,
} from '@chakra-ui/react';
import { Eye, UserCog } from 'lucide-react';
import { AnalystWorkload } from '../types';
import { toaster } from '@/ui/components/common/atoms/toaster/toaster';

interface AnalystWorkloadTableProps {
  workloads: AnalystWorkload[];
  onFilterByAnalyst?: (analyst: string) => void;
}

export default function AnalystWorkloadTable({
  workloads,
  onFilterByAnalyst,
}: AnalystWorkloadTableProps) {
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof AnalystWorkload;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [reassignAnalyst, setReassignAnalyst] = React.useState<string | null>(null);
  const [isReassignDialogOpen, setIsReassignDialogOpen] = React.useState(false);
  const [selectedAnalyst, setSelectedAnalyst] = React.useState<string>('');
  const [isReassigning, setIsReassigning] = React.useState(false);

  const analysts = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams'];
  const analystCollection = React.useMemo(
    () =>
      createListCollection({
        items: analysts
          .filter((a) => a !== reassignAnalyst)
          .map((analyst) => ({ label: analyst, value: analyst })),
      }),
    [reassignAnalyst]
  );

  const sortedWorkloads = React.useMemo(() => {
    if (!sortConfig) return workloads;

    return [...workloads].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return sortConfig.direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [workloads, sortConfig]);

  const handleSort = (key: keyof AnalystWorkload) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const getSlaBadgeColor = (breaches: number) => {
    if (breaches === 0) return 'green';
    if (breaches <= 2) return 'yellow';
    return 'red';
  };

  const handleReassignClick = (analyst: string) => {
    setReassignAnalyst(analyst);
    setSelectedAnalyst('');
    setIsReassignDialogOpen(true);
  };

  const handleConfirmReassign = async () => {
    if (!reassignAnalyst || !selectedAnalyst) return;

    setIsReassigning(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toaster.success({
        title: 'Workload reassigned',
        description: `Items from ${reassignAnalyst} have been reassigned to ${selectedAnalyst}.`,
      });
      setIsReassignDialogOpen(false);
      setReassignAnalyst(null);
    } catch (error) {
      toaster.error({
        title: 'Error',
        description: 'Failed to reassign workload.',
      });
    } finally {
      setIsReassigning(false);
    }
  };

  return (
    <Box
      bg="white"
      borderRadius="xl"
      boxShadow="0 2px 8px rgba(0,0,0,0.05)"
      borderWidth="1px"
      borderColor="gray.200"
      overflowX="auto"
    >
      <Box p={4} borderBottomWidth="1px" borderColor="gray.200">
        <HStack gap={2} align="center">
          <UserCog size={20} color="#6b7280" />
          <Text fontSize="lg" fontWeight="semibold" color="gray.900">
            Analyst Workload
          </Text>
        </HStack>
      </Box>
      <Table.ScrollArea>
        <Table.Root size="sm">
          <Table.Header position="sticky" top={0} bg="gray.50" zIndex={5}>
            <Table.Row>
              <Table.ColumnHeader
                cursor="pointer"
                onClick={() => handleSort('analyst')}
                _hover={{ bg: 'gray.100' }}
              >
                <HStack gap={1}>
                  <Text>Analyst Name</Text>
                  {sortConfig?.key === 'analyst' && (
                    <Text fontSize="xs">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </Text>
                  )}
                </HStack>
              </Table.ColumnHeader>
              <Table.ColumnHeader
                textAlign="right"
                cursor="pointer"
                onClick={() => handleSort('assignedItems')}
                _hover={{ bg: 'gray.100' }}
              >
                <HStack gap={1} justify="flex-end">
                  <Text>Assigned Items</Text>
                  {sortConfig?.key === 'assignedItems' && (
                    <Text fontSize="xs">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </Text>
                  )}
                </HStack>
              </Table.ColumnHeader>
              <Table.ColumnHeader
                textAlign="right"
                cursor="pointer"
                onClick={() => handleSort('escalations')}
                _hover={{ bg: 'gray.100' }}
              >
                <HStack gap={1} justify="flex-end">
                  <Text>Escalations</Text>
                  {sortConfig?.key === 'escalations' && (
                    <Text fontSize="xs">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </Text>
                  )}
                </HStack>
              </Table.ColumnHeader>
              <Table.ColumnHeader
                textAlign="right"
                cursor="pointer"
                onClick={() => handleSort('averageReviewTime')}
                _hover={{ bg: 'gray.100' }}
              >
                <HStack gap={1} justify="flex-end">
                  <Text>Avg Review Time</Text>
                  {sortConfig?.key === 'averageReviewTime' && (
                    <Text fontSize="xs">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </Text>
                  )}
                </HStack>
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right">On-Hold Items</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right">SLA Breaches</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sortedWorkloads.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={7} textAlign="center" py={8}>
                  <Text fontSize="sm" color="gray.600">
                    No analyst data available
                  </Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              sortedWorkloads.map((workload, index) => (
                <Table.Row
                  key={index}
                  _hover={{ bg: 'gray.50' }}
                  bg={index % 2 === 0 ? 'white' : 'gray.50'}
                >
                  <Table.Cell>
                    <Text fontSize="sm" fontWeight="medium" color="gray.900">
                      {workload.analyst}
                    </Text>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Text fontSize="sm" color="gray.700">
                      {workload.assignedItems}
                    </Text>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Badge
                      colorPalette={workload.escalations > 0 ? 'orange' : 'gray'}
                      variant="subtle"
                    >
                      {workload.escalations}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Text fontSize="sm" color="gray.700">
                      {workload.averageReviewTime}
                    </Text>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Text fontSize="sm" color="gray.700">
                      {workload.onHoldItems}
                    </Text>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Badge
                      colorPalette={getSlaBadgeColor(workload.slaBreaches)}
                      variant="subtle"
                    >
                      {workload.slaBreaches}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <HStack gap={2} justify="center">
                      <Button 
                        size="xs" 
                        variant="outline" 
                        colorPalette="blue"
                        onClick={() => {
                          if (onFilterByAnalyst) {
                            onFilterByAnalyst(workload.analyst);
                          }
                        }}
                      >
                        <Eye size={14} />
                        View Queue
                      </Button>
                      <IconButton
                        size="xs"
                        variant="outline"
                        aria-label="Reassign"
                        onClick={() => handleReassignClick(workload.analyst)}
                      >
                        <UserCog size={14} />
                      </IconButton>
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      {/* Reassign Dialog */}
      {reassignAnalyst && (
        <Dialog.Root
          open={isReassignDialogOpen}
          onOpenChange={(e) => {
            setIsReassignDialogOpen(e.open);
            if (!e.open) {
              setTimeout(() => setReassignAnalyst(null), 200);
            }
          }}
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content maxW="500px">
                <Dialog.Header>
                  <Dialog.Title>Reassign Workload</Dialog.Title>
                  <Dialog.Description>
                    Reassign all items from {reassignAnalyst} to another analyst.
                  </Dialog.Description>
                </Dialog.Header>
                <Dialog.Body>
                  <VStack align="stretch" gap={4}>
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>
                        From Analyst
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {reassignAnalyst}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>
                        Select Target Analyst
                      </Text>
                      <Select.Root
                        collection={analystCollection}
                        value={[selectedAnalyst]}
                        onValueChange={(e) => setSelectedAnalyst(e.value[0] || '')}
                      >
                        <Select.HiddenSelect />
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select analyst..." />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                          <Select.Positioner zIndex={10000}>
                            <Select.Content zIndex={10000}>
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
                    </Box>
                  </VStack>
                </Dialog.Body>
                <Dialog.Footer>
                  <HStack gap={3} w="full" justify="flex-end">
                    <Button
                      variant="ghost"
                      onClick={() => setIsReassignDialogOpen(false)}
                      disabled={isReassigning}
                    >
                      Cancel
                    </Button>
                    <Button
                      colorPalette="blue"
                      onClick={handleConfirmReassign}
                      loading={isReassigning}
                      disabled={isReassigning || !selectedAnalyst}
                    >
                      Confirm Reassignment
                    </Button>
                  </HStack>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      )}
    </Box>
  );
}

