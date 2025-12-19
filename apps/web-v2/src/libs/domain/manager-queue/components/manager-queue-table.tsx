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
  VStack,
  Pagination,
  Dialog,
  Portal,
  Select,
  createListCollection,
  Tooltip,
} from '@chakra-ui/react';
import { Eye, UserCog, Check, X, ArrowLeft, FileText, TrendingUp, Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ManagerQueueItem } from '../types';
import ManagerQueueDetailDrawer from './manager-queue-detail-drawer';
import { toaster } from '@/ui/components/common/atoms/toaster/toaster';
import { getRuleName } from '@/libs/domain/dashboard/utils/ruleNames';

interface ManagerQueueTableProps {
  items: ManagerQueueItem[];
}

export default function ManagerQueueTable({ items }: ManagerQueueTableProps) {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = React.useState<ManagerQueueItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [reassignItem, setReassignItem] = React.useState<ManagerQueueItem | null>(null);
  const [isReassignDialogOpen, setIsReassignDialogOpen] = React.useState(false);
  const [selectedAnalyst, setSelectedAnalyst] = React.useState<string>('');
  const [isReassigning, setIsReassigning] = React.useState(false);
  const itemsPerPage = 10;

  const analysts = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams'];
  const analystCollection = React.useMemo(
    () =>
      createListCollection({
        items: [
          { label: 'Unassigned', value: '' },
          ...analysts.map((analyst) => ({ label: analyst, value: analyst })),
        ],
      }),
    []
  );

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRowClick = (item: ManagerQueueItem) => {
    // Navigate to batch detail page using MID, with source parameter to return to Manager Queue
    router.push(`/auto-hold/batch/${encodeURIComponent(item.mid)}?source=manager-queue`);
  };

  const handleViewBatch = (item: ManagerQueueItem, e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigate to batch detail page using MID, with source parameter to return to Manager Queue
    router.push(`/auto-hold/batch/${encodeURIComponent(item.mid)}?source=manager-queue`);
  };

  const handleReassignClick = (item: ManagerQueueItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setReassignItem(item);
    setSelectedAnalyst(item.assignedAnalyst || '');
    setIsReassignDialogOpen(true);
  };

  const handleConfirmReassign = async () => {
    if (!reassignItem) return;
    
    if (selectedAnalyst === reassignItem.assignedAnalyst) {
      setIsReassignDialogOpen(false);
      return;
    }

    setIsReassigning(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toaster.success({
        title: 'Item reassigned',
        description: `${reassignItem.dbaName} has been ${selectedAnalyst ? `reassigned to ${selectedAnalyst}` : 'unassigned'}.`,
      });
      setIsReassignDialogOpen(false);
      setReassignItem(null);
      // In a real app, you would update the items state here
    } catch (error) {
      toaster.error({
        title: 'Error',
        description: 'Failed to reassign item.',
      });
    } finally {
      setIsReassigning(false);
    }
  };

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Critical':
        return 'red';
      case 'High':
        return 'orange';
      case 'Medium':
        return 'yellow';
      case 'Low':
        return 'green';
      default:
        return 'gray';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCopyMID = async (mid: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(mid);
      toaster.success({
        title: 'MID copied',
        description: `MID ${mid} has been copied to clipboard.`,
      });
    } catch (err) {
      console.error('Failed to copy MID:', err);
      toaster.error({
        title: 'Copy failed',
        description: 'Failed to copy MID to clipboard.',
      });
    }
  };

  if (items.length === 0) {
    return (
      <Box
        bg="white"
        borderRadius="xl"
        boxShadow="0 2px 8px rgba(0,0,0,0.05)"
        borderWidth="1px"
        borderColor="gray.200"
        p={12}
        textAlign="center"
      >
        <VStack gap={4}>
          <Text fontSize="lg" fontWeight="semibold" color="gray.700">
            No items require managerial action right now.
          </Text>
          <HStack gap={3} justify="center">
            <Button size="sm" variant="outline" colorPalette="blue">
              View All Pending Reviews
            </Button>
            <Button size="sm" variant="outline" colorPalette="blue">
              View Analyst Workload
            </Button>
          </HStack>
        </VStack>
      </Box>
    );
  }

  return (
    <>
      <Box
        bg="white"
        borderRadius="xl"
        boxShadow="0 2px 8px rgba(0,0,0,0.05)"
        borderWidth="1px"
        borderColor="gray.200"
        overflowX="auto"
      >
        <Box p={4} borderBottomWidth="1px" borderColor="gray.200">
          <Text fontSize="lg" fontWeight="semibold" color="gray.900">
            Manager Queue ({items.length} items)
          </Text>
        </Box>
        <Table.ScrollArea>
          <Table.Root size="sm">
            <Table.Header position="sticky" top={0} bg="gray.50" zIndex={5}>
              <Table.Row>
                <Table.ColumnHeader>DBA Name</Table.ColumnHeader>
                <Table.ColumnHeader>MID</Table.ColumnHeader>
                <Table.ColumnHeader>Analyst Assigned</Table.ColumnHeader>
                <Table.ColumnHeader>Processor</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">Batch Amount</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">Exceptions</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center">Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {paginatedItems.map((item, index) => (
                <Table.Row
                  key={item.id}
                  cursor="pointer"
                  _hover={{ bg: 'blue.50' }}
                  bg={index % 2 === 0 ? 'white' : 'gray.50'}
                  onClick={() => handleRowClick(item)}
                >
                  <Table.Cell>
                    <Text fontSize="sm" fontWeight="medium" color="gray.900">
                      {item.dbaName}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <HStack gap={2} align="center">
                      <Text fontSize="sm" color="gray.700" fontFamily="mono">
                        {item.mid}
                      </Text>
                      <Tooltip.Root openDelay={300} closeDelay={100}>
                        <Tooltip.Trigger asChild>
                          <IconButton
                            size="xs"
                            variant="ghost"
                            aria-label={`Copy MID ${item.mid}`}
                            onClick={(e) => handleCopyMID(item.mid, e)}
                            minW="auto"
                            h="auto"
                            p={1}
                          >
                            <Copy size={12} />
                          </IconButton>
                        </Tooltip.Trigger>
                        <Portal>
                          <Tooltip.Positioner>
                            <Tooltip.Content>
                              <Tooltip.Arrow />
                              Click to copy MID
                            </Tooltip.Content>
                          </Tooltip.Positioner>
                        </Portal>
                      </Tooltip.Root>
                    </HStack>
                  </Table.Cell>
                  <Table.Cell>
                    {item.assignedAnalyst ? (
                      <Badge colorPalette="blue" variant="subtle">
                        {item.assignedAnalyst}
                      </Badge>
                    ) : (
                      <Badge colorPalette="red" variant="subtle">
                        Unassigned
                      </Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm" color="gray.700">
                      {item.processor}
                    </Text>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                      {item.batchAmount || '$0.00'}
                    </Text>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Tooltip.Root openDelay={300} closeDelay={100}>
                      <Tooltip.Trigger asChild>
                        <Box display="inline-block">
                          <Badge colorPalette="orange" variant="subtle" cursor="help">
                            {item.exceptionsTriggered}
                          </Badge>
                        </Box>
                      </Tooltip.Trigger>
                      <Portal>
                        <Tooltip.Positioner>
                          <Tooltip.Content 
                            maxW="350px" 
                            p={4}
                            bg="white"
                            borderWidth="1px"
                            borderColor="gray.200"
                            boxShadow="lg"
                          >
                            <VStack align="start" gap={3}>
                              <Text fontSize="sm" fontWeight="bold" color="gray.900">
                                Triggered Rules ({item.triggeredRules.length})
                              </Text>
                              {item.triggeredRules.length > 0 ? (
                                <VStack align="start" gap={2} w="full">
                                  {item.triggeredRules.map((ruleId) => (
                                    <HStack key={ruleId} gap={2} align="start" w="full">
                                      <Badge 
                                        colorPalette="blue" 
                                        variant="solid" 
                                        fontSize="xs"
                                        fontWeight="semibold"
                                        px={2}
                                        py={0.5}
                                      >
                                        {ruleId}
                                      </Badge>
                                      <Text 
                                        fontSize="sm" 
                                        color="gray.900"
                                        fontWeight="medium"
                                        flex={1}
                                      >
                                        {getRuleName(ruleId)}
                                      </Text>
                                    </HStack>
                                  ))}
                                </VStack>
                              ) : (
                                <Text fontSize="sm" color="gray.600">
                                  No rules triggered
                                </Text>
                              )}
                            </VStack>
                          </Tooltip.Content>
                        </Tooltip.Positioner>
                      </Portal>
                    </Tooltip.Root>
                  </Table.Cell>
                  <Table.Cell textAlign="center" onClick={(e) => e.stopPropagation()}>
                    <HStack gap={1} justify="center">
                      <Button
                        size="xs"
                        variant="outline"
                        colorPalette="blue"
                        onClick={(e) => handleViewBatch(item, e)}
                      >
                        <Eye size={14} />
                        View
                      </Button>
                      <IconButton
                        size="xs"
                        variant="ghost"
                        aria-label="Reassign"
                        onClick={(e) => handleReassignClick(item, e)}
                      >
                        <UserCog size={14} />
                      </IconButton>
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box
            p={4}
            borderTopWidth="1px"
            borderColor="gray.200"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text fontSize="sm" color="gray.600">
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, items.length)} of {items.length}
            </Text>
            <HStack gap={2}>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  size="sm"
                  variant={currentPage === page ? 'solid' : 'outline'}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </HStack>
          </Box>
        )}
      </Box>

      {/* Detail Drawer */}
      {selectedItem && (
        <ManagerQueueDetailDrawer
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setTimeout(() => setSelectedItem(null), 200);
          }}
          item={selectedItem}
        />
      )}

      {/* Reassign Dialog */}
      {reassignItem && (
        <Dialog.Root
          open={isReassignDialogOpen}
          onOpenChange={(e) => {
            setIsReassignDialogOpen(e.open);
            if (!e.open) {
              setTimeout(() => setReassignItem(null), 200);
            }
          }}
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content maxW="500px">
                <Dialog.Header>
                  <Dialog.Title>Reassign Analyst</Dialog.Title>
                  <Dialog.Description>
                    Select a new analyst for this item or unassign it.
                  </Dialog.Description>
                </Dialog.Header>
                <Dialog.Body>
                  <VStack align="stretch" gap={4}>
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>
                        Item
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {reassignItem.dbaName} ({reassignItem.mid})
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>
                        Current Assignment
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {reassignItem.assignedAnalyst || 'Unassigned'}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>
                        Select New Analyst
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
                      disabled={isReassigning}
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
    </>
  );
}

