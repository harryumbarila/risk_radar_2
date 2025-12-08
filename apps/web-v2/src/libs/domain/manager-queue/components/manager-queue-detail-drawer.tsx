'use client';
import React from 'react';
import {
  Drawer,
  Portal,
  VStack,
  Box,
  Text,
  Tabs,
  Badge,
  HStack,
  CloseButton,
  Button,
  Input,
  Textarea,
  Dialog,
  Select,
  createListCollection,
} from '@chakra-ui/react';
import { Check, X, ArrowLeft, UserCog, FileText, TrendingUp, Ban } from 'lucide-react';
import { ManagerQueueItem } from '../types';
import { toaster } from '@/ui/components/common/atoms/toaster/toaster';

interface ManagerQueueDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  item: ManagerQueueItem;
}

export default function ManagerQueueDetailDrawer({
  isOpen,
  onClose,
  item,
}: ManagerQueueDetailDrawerProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('summary');
  const [note, setNote] = React.useState('');
  const [isReassignDialogOpen, setIsReassignDialogOpen] = React.useState(false);
  const [selectedAnalyst, setSelectedAnalyst] = React.useState<string>('');

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

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toaster.success({
        title: 'Item approved',
        description: `${item.dbaName} has been approved.`,
      });
      onClose();
    } catch (error) {
      toaster.error({
        title: 'Error',
        description: 'Failed to approve item.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toaster.success({
        title: 'Item rejected',
        description: `${item.dbaName} has been rejected.`,
      });
      onClose();
    } catch (error) {
      toaster.error({
        title: 'Error',
        description: 'Failed to reject item.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReassign = () => {
    setSelectedAnalyst(item.assignedAnalyst || '');
    setIsReassignDialogOpen(true);
  };

  const handleConfirmReassign = async () => {
    if (selectedAnalyst === item.assignedAnalyst) {
      setIsReassignDialogOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toaster.success({
        title: 'Item reassigned',
        description: `${item.dbaName} has been ${selectedAnalyst ? `reassigned to ${selectedAnalyst}` : 'unassigned'}.`,
      });
      setIsReassignDialogOpen(false);
      // In a real app, you would update the item state here
      onClose();
    } catch (error) {
      toaster.error({
        title: 'Error',
        description: 'Failed to reassign item.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = () => {
    if (!note.trim()) return;
    toaster.success({
      title: 'Note added',
      description: 'Note has been added successfully.',
    });
    setNote('');
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

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="end"
      size={{ base: 'full', md: 'xl', lg: 'xl' }}
    >
      <Portal>
        <Drawer.Backdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <Drawer.Positioner>
          <Drawer.Content
            maxW={{ base: '100%', lg: '75%' }}
            w="full"
            display="flex"
            flexDirection="column"
            maxH="100vh"
          >
            {/* Header */}
            <Drawer.Header
              position="sticky"
              top={0}
              zIndex={10}
              bg="white"
              borderBottom="1px"
              borderColor="gray.200"
              pb={4}
            >
              <VStack align="stretch" gap={3}>
                <HStack justify="space-between" align="center">
                  <VStack align="start" gap={1}>
                    <Drawer.Title fontSize="xl" fontWeight="bold">
                      {item.dbaName}
                    </Drawer.Title>
                    <Text fontSize="sm" color="gray.600" fontFamily="mono">
                      MID: {item.mid}
                    </Text>
                  </VStack>
                  <Drawer.CloseTrigger asChild>
                    <CloseButton size="sm" />
                  </Drawer.CloseTrigger>
                </HStack>
                <HStack gap={4} flexWrap="wrap">
                  <HStack gap={2}>
                    <Text fontSize="xs" color="gray.600" textTransform="uppercase">
                      Risk Level:
                    </Text>
                    <Badge
                      colorPalette={getRiskBadgeColor(item.riskLevel)}
                      variant="subtle"
                      px={3}
                      py={1}
                    >
                      {item.riskLevel}
                    </Badge>
                  </HStack>
                  <HStack gap={2}>
                    <Text fontSize="xs" color="gray.600" textTransform="uppercase">
                      Processor:
                    </Text>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                      {item.processor}
                    </Text>
                  </HStack>
                  <HStack gap={2}>
                    <Text fontSize="xs" color="gray.600" textTransform="uppercase">
                      Analyst:
                    </Text>
                    {item.assignedAnalyst ? (
                      <Badge colorPalette="blue" variant="subtle">
                        {item.assignedAnalyst}
                      </Badge>
                    ) : (
                      <Badge colorPalette="red" variant="subtle">
                        Unassigned
                      </Badge>
                    )}
                  </HStack>
                </HStack>
                <Box
                  bg="orange.50"
                  p={3}
                  borderRadius="md"
                  borderLeftWidth="3px"
                  borderLeftColor="orange.500"
                >
                  <HStack gap={2}>
                    <TrendingUp size={16} color="#f59e0b" />
                    <VStack align="start" gap={0}>
                      <Text fontSize="xs" fontWeight="semibold" color="orange.700">
                        {item.reasonForReview}
                      </Text>
                      <Text fontSize="xs" color="orange.600">
                        Escalated on {formatDate(item.submittedOn)}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              </VStack>
            </Drawer.Header>

            {/* Body */}
            <Drawer.Body flex={1} overflowY="auto" px={6} py={6}>
              <Tabs.Root value={activeTab} onValueChange={(e) => setActiveTab(e.value)}>
                <Tabs.List
                  bg="gray.50"
                  rounded="lg"
                  p={1}
                  flexWrap="wrap"
                  mb={4}
                >
                  <Tabs.Trigger value="summary">Summary</Tabs.Trigger>
                  <Tabs.Trigger value="rules">Triggered Rules</Tabs.Trigger>
                  <Tabs.Trigger value="notes">Analyst Notes</Tabs.Trigger>
                  <Tabs.Trigger value="transactions">Transaction Feed</Tabs.Trigger>
                  <Tabs.Indicator />
                </Tabs.List>

                <Tabs.Content value="summary" pt={4}>
                  <VStack align="stretch" gap={4}>
                    <Box
                      bg="white"
                      p={4}
                      borderRadius="lg"
                      borderWidth="1px"
                      borderColor="gray.200"
                    >
                      <Text fontSize="sm" fontWeight="semibold" color="gray.900" mb={3}>
                        Overview
                      </Text>
                      <VStack align="stretch" gap={2}>
                        <HStack justify="space-between">
                          <Text fontSize="sm" color="gray.600">Status:</Text>
                          <Badge
                            colorPalette={
                              item.status === 'Completed'
                                ? 'green'
                                : item.status === 'In-Review'
                                ? 'blue'
                                : 'gray'
                            }
                            variant="subtle"
                          >
                            {item.status}
                          </Badge>
                        </HStack>
                        <HStack justify="space-between">
                          <Text fontSize="sm" color="gray.600">Exceptions Triggered:</Text>
                          <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                            {item.exceptionsTriggered}
                          </Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text fontSize="sm" color="gray.600">Submitted On:</Text>
                          <Text fontSize="sm" color="gray.700">
                            {formatDate(item.submittedOn)}
                          </Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text fontSize="sm" color="gray.600">Last Activity:</Text>
                          <Text fontSize="sm" color="gray.700">
                            {formatDate(item.lastActivity)}
                          </Text>
                        </HStack>
                        {item.mcc && (
                          <HStack justify="space-between">
                            <Text fontSize="sm" color="gray.600">MCC:</Text>
                            <Text fontSize="sm" color="gray.700">{item.mcc}</Text>
                          </HStack>
                        )}
                      </VStack>
                    </Box>
                  </VStack>
                </Tabs.Content>

                <Tabs.Content value="rules" pt={4}>
                  <VStack align="stretch" gap={2}>
                    {Array.from({ length: item.exceptionsTriggered }, (_, i) => (
                      <Box
                        key={i}
                        bg="white"
                        p={4}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor="gray.200"
                      >
                        <HStack justify="space-between">
                          <VStack align="start" gap={0}>
                            <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                              Rule AH{String(i + 1).padStart(3, '0')}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                              Triggered on {formatDate(item.submittedOn)}
                            </Text>
                          </VStack>
                          <Badge colorPalette="orange" variant="subtle">
                            Active
                          </Badge>
                        </HStack>
                      </Box>
                    ))}
                  </VStack>
                </Tabs.Content>

                <Tabs.Content value="notes" pt={4}>
                  <VStack align="stretch" gap={4}>
                    <Box
                      bg="white"
                      p={4}
                      borderRadius="lg"
                      borderWidth="1px"
                      borderColor="gray.200"
                    >
                      <Text fontSize="sm" fontWeight="semibold" color="gray.900" mb={3}>
                        Add Note
                      </Text>
                      <VStack align="stretch" gap={3}>
                        <Textarea
                          placeholder="Enter your note here..."
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          rows={4}
                        />
                        <Button
                          size="sm"
                          colorPalette="blue"
                          onClick={handleAddNote}
                          disabled={!note.trim()}
                        >
                          <FileText size={16} />
                          Add Note
                        </Button>
                      </VStack>
                    </Box>
                    <VStack align="stretch" gap={2}>
                      {[
                        {
                          id: '1',
                          note: 'Initial review completed. Requires manager approval.',
                          author: 'John Doe',
                          date: new Date().toISOString(),
                        },
                        {
                          id: '2',
                          note: 'Additional documentation requested from merchant.',
                          author: 'Jane Smith',
                          date: new Date(Date.now() - 86400000).toISOString(),
                        },
                      ].map((noteItem) => (
                        <Box
                          key={noteItem.id}
                          bg="white"
                          p={4}
                          borderRadius="lg"
                          borderWidth="1px"
                          borderColor="gray.200"
                        >
                          <HStack justify="space-between" mb={2}>
                            <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                              {noteItem.author}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                              {formatDate(noteItem.date)}
                            </Text>
                          </HStack>
                          <Text fontSize="sm" color="gray.700">
                            {noteItem.note}
                          </Text>
                        </Box>
                      ))}
                    </VStack>
                  </VStack>
                </Tabs.Content>

                <Tabs.Content value="transactions" pt={4}>
                  <Box
                    bg="white"
                    p={4}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor="gray.200"
                  >
                    <Text fontSize="sm" color="gray.600">
                      Transaction feed would be displayed here. This would show all transactions
                      related to this merchant for the review period.
                    </Text>
                  </Box>
                </Tabs.Content>
              </Tabs.Root>
            </Drawer.Body>

            {/* Footer */}
            <Drawer.Footer
              position="sticky"
              bottom={0}
              bg="white"
              borderTop="1px"
              borderColor="gray.200"
              px={6}
              py={4}
              boxShadow="0 -2px 8px rgba(0,0,0,0.05)"
            >
              <HStack justify="flex-end" gap={3} w="full">
                <Drawer.ActionTrigger asChild>
                  <Button
                    variant="ghost"
                    disabled={isLoading}
                    aria-label="Back"
                  >
                    <ArrowLeft size={16} />
                    Back
                  </Button>
                </Drawer.ActionTrigger>
                <Button
                  variant="outline"
                  onClick={handleReassign}
                  disabled={isLoading}
                  aria-label="Reassign"
                >
                  <UserCog size={16} />
                  Reassign
                </Button>
                <Button
                  colorPalette="red"
                  variant="outline"
                  onClick={handleReject}
                  loading={isLoading}
                  disabled={isLoading}
                  aria-label="Reject"
                >
                  <X size={16} />
                  Reject
                </Button>
                <Drawer.ActionTrigger asChild>
                  <Button
                    colorPalette="blue"
                    onClick={handleApprove}
                    loading={isLoading}
                    disabled={isLoading}
                    aria-label="Approve"
                  >
                    <Check size={16} />
                    Approve
                  </Button>
                </Drawer.ActionTrigger>
              </HStack>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>

      {/* Reassign Dialog */}
      <Dialog.Root open={isReassignDialogOpen} onOpenChange={(e) => setIsReassignDialogOpen(e.open)}>
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
                      Current Assignment
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {item.assignedAnalyst || 'Unassigned'}
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
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorPalette="blue"
                    onClick={handleConfirmReassign}
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    Confirm Reassignment
                  </Button>
                </HStack>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Drawer.Root>
  );
}

