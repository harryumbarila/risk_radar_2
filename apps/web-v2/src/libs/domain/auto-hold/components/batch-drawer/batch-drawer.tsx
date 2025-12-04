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
  Select,
  createListCollection,
} from '@chakra-ui/react';
import { MerchantTransaction } from '@/data/interfaces/transaction';
import BatchSummary, { type BatchSummaryData } from '../batch-summary/batch-summary';
import { toaster } from '@/ui/components/common/atoms/toaster/toaster';
import { Check, Ban, ArrowLeft, TrendingUp } from 'lucide-react';
import { Button } from '@chakra-ui/react';
import ContactTab from '../tabs/contact-tab';
import ChargebacksTab from '../tabs/chargebacks-tab';
import MatchTab from '../tabs/match-tab';
import VolumeTab from '../tabs/volume-tab';
import NotesTab from '../tabs/notes-tab';
import TransactionsTab from '../tabs/transactions-tab';
import UnderwritingTab from '../tabs/underwriting-tab';
import NetSettlementTab from '../tabs/net-settlement-tab';

interface BatchDrawerProps {
  batch: MerchantTransaction[];
  trigger?: React.ReactNode;
}

// Generate mock batch data
function generateBatchData(batch: MerchantTransaction[]): {
  summary: BatchSummaryData;
} {
  // Calculate total amount
  const totalAmount = batch.reduce((sum, tx) => {
    const amount = parseFloat(tx.amount.replace(/[^0-9.]/g, ''));
    return sum + amount;
  }, 0);

  // Extract exception types
  const exceptionTypesSet = new Set<string>();
  batch.forEach((tx) => {
    const exceptions = tx.exception.split(',').map((e) => e.trim());
    exceptions.forEach((e) => exceptionTypesSet.add(e));
  });

  // Get time window
  const dates = batch
    .map((tx) => {
      const dateStr = tx.createdAt || tx.date;
      return dateStr ? new Date(dateStr) : null;
    })
    .filter((d): d is Date => d !== null);
  const startDate = dates.length > 0 ? new Date(Math.min(...dates.map((d) => d.getTime()))) : new Date();
  const endDate = dates.length > 0 ? new Date(Math.max(...dates.map((d) => d.getTime()))) : new Date();

  // Generate exception distribution counts for summary
  const exceptionCounts: Record<string, number> = {};
  batch.forEach((tx) => {
    const exceptions = tx.exception.split(',').map((e) => e.trim());
    exceptions.forEach((e) => {
      exceptionCounts[e] = (exceptionCounts[e] || 0) + 1;
    });
  });

  const summary: BatchSummaryData = {
    totalTransactions: batch.length,
    totalAmount: `$${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    timeWindow: {
      start: startDate.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      end: endDate.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
    cronJobSource: 'Daily Risk Batch Job',
    exceptionTypes: Array.from(exceptionTypesSet),
    exceptionCounts,
  };

  return { summary };
}

export default function BatchDrawer({ batch, trigger }: BatchDrawerProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('transactions');

  const { summary } = React.useMemo(
    () => generateBatchData(batch),
    [batch]
  );

  // Get merchant info from first transaction
  const merchantInfo = batch[0];
  const status = merchantInfo?.status || 'Unreviewed';

  // Mock notes count
  const notesCount = 3;

  // Create collection for mobile tab select
  const tabCollection = React.useMemo(
    () =>
      createListCollection({
        items: [
          { label: `Transactions (${batch.length})`, value: 'transactions' },
          { label: 'Contact', value: 'contact' },
          { label: 'Chargebacks', value: 'chargebacks' },
          { label: 'Match', value: 'match' },
          { label: 'Underwriting', value: 'underwriting' },
          { label: 'Net Settlement', value: 'net-settlement' },
          { label: `Notes (${notesCount})`, value: 'notes' },
        ],
      }),
    [batch.length, notesCount]
  );

  const handleMarkAsReviewed = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toaster.success({
        title: 'Batch marked as reviewed',
        description: `${batch.length} transactions have been marked as reviewed.`,
      });
      // Drawer will close via Drawer.ActionTrigger or manually
    } catch (error) {
      toaster.error({
        title: 'Error',
        description: 'Failed to mark batch as reviewed.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDivertCase = () => {
      toaster.create({
        title: 'Case diverted',
        description: 'This batch has been diverted for further review.',
      });
  };

  const handleEscalate = () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        toaster.success({
          title: 'Batch escalated',
          description: 'This batch has been escalated for priority review.',
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toaster.error({
        title: 'Error',
        description: 'Failed to escalate batch.',
      });
      setIsLoading(false);
    }
  };

  return (
    <Drawer.Root
      placement="end"
      size={{ base: 'full', md: 'xl', lg: 'xl' }}
    >
      {trigger && <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>}
      <Portal>
        <Drawer.Backdrop
          bg="black"
          opacity={0.2}
          backdropFilter="blur(4px)"
        />
        <Drawer.Positioner>
          <Drawer.Content
            maxW={{ base: '100%', lg: '75%' }}
            w="full"
            display="flex"
            flexDirection="column"
            maxH="100vh"
          >
            {/* Sticky Header */}
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
                      {merchantInfo?.merchant || 'Batch Details'}
                    </Drawer.Title>
                    <Text fontSize="sm" color="gray.600">
                      {batch.length} transactions in this batch
                    </Text>
                  </VStack>
                  <Drawer.CloseTrigger asChild>
                    <CloseButton size="sm" />
                  </Drawer.CloseTrigger>
                </HStack>
                <HStack gap={4} flexWrap="wrap">
                  <HStack gap={2}>
                    <Text fontSize="xs" color="gray.600" textTransform="uppercase">
                      Processor:
                    </Text>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                      {merchantInfo?.processor || 'N/A'}
                    </Text>
                  </HStack>
                  <HStack gap={2}>
                    <Text fontSize="xs" color="gray.600" textTransform="uppercase">
                      Status:
                    </Text>
                    <Badge
                      colorPalette={
                        status === 'Reviewed'
                          ? 'green'
                          : status === 'In Progress'
                          ? 'yellow'
                          : 'gray'
                      }
                      variant="subtle"
                      px={3}
                      py={1}
                    >
                      {status}
                    </Badge>
                  </HStack>
                </HStack>
              </VStack>
            </Drawer.Header>

            <Drawer.Body
              flex={1}
              overflowY="auto"
              px={6}
              py={6}
            >
              <VStack align="stretch" gap={6}>
                {/* Batch Summary */}
                <BatchSummary data={summary} />

                {/* Volume Tab - Fixed below summary */}
                <Box
                  bg="white"
                  p={6}
                  borderRadius="xl"
                  boxShadow="0 2px 8px rgba(0,0,0,0.05)"
                  borderWidth="1px"
                  borderColor="gray.200"
                >
                  <VolumeTab merchantId={merchantInfo?.mid || ''} />
                </Box>

                {/* Tabs */}
                <Box
                  bg="white"
                  p={6}
                  borderRadius="xl"
                  boxShadow="0 2px 8px rgba(0,0,0,0.05)"
                  borderWidth="1px"
                  borderColor="gray.200"
                >
                  <Tabs.Root value={activeTab} onValueChange={(e) => setActiveTab(e.value)}>
                    <Tabs.List
                    bg="gray.50"
                    rounded="lg"
                    p={1}
                    flexWrap="wrap"
                    display={{ base: 'none', md: 'flex' }}
                  >
                      <Tabs.Trigger value="transactions">
                        <HStack gap={2}>
                          <Text>Transactions</Text>
                          <Badge
                            colorPalette="blue"
                            variant="solid"
                            px={2}
                            py={0.5}
                            borderRadius="full"
                            fontSize="xs"
                          >
                            {batch.length}
                          </Badge>
                        </HStack>
                      </Tabs.Trigger>
                      <Tabs.Trigger value="contact">Contact</Tabs.Trigger>
                      <Tabs.Trigger value="chargebacks">Chargebacks</Tabs.Trigger>
                      <Tabs.Trigger value="match">Match</Tabs.Trigger>
                      <Tabs.Trigger value="underwriting">Underwriting</Tabs.Trigger>
                      <Tabs.Trigger value="net-settlement">Net Settlement</Tabs.Trigger>
                      <Tabs.Trigger value="notes">
                        <HStack gap={2}>
                          <Text>Notes</Text>
                          <Badge
                            colorPalette="gray"
                            variant="solid"
                            px={2}
                            py={0.5}
                            borderRadius="full"
                            fontSize="xs"
                          >
                            {notesCount}
                          </Badge>
                        </HStack>
                      </Tabs.Trigger>
                      <Tabs.Indicator />
                    </Tabs.List>
                    {/* Mobile: Dropdown select for tabs */}
                    <Box display={{ base: 'block', md: 'none' }} mb={4}>
                      <Select.Root
                        collection={tabCollection}
                        value={[activeTab]}
                        onValueChange={(e) => setActiveTab(e.value[0] || 'transactions')}
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
                              {tabCollection.items.map((item) => (
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

                    <Tabs.Content value="transactions" pt={4}>
                      <TransactionsTab transactions={batch} />
                    </Tabs.Content>

                    <Tabs.Content value="contact" pt={4}>
                      <ContactTab
                        merchantId={merchantInfo?.mid || ''}
                        merchantName={merchantInfo?.merchant || ''}
                      />
                    </Tabs.Content>

                    <Tabs.Content value="chargebacks" pt={4}>
                      <ChargebacksTab merchantId={merchantInfo?.mid || ''} />
                    </Tabs.Content>

                    <Tabs.Content value="match" pt={4}>
                      <MatchTab merchantId={merchantInfo?.mid || ''} />
                    </Tabs.Content>

                    <Tabs.Content value="underwriting" pt={4}>
                      <UnderwritingTab merchantId={merchantInfo?.mid || ''} />
                    </Tabs.Content>

                    <Tabs.Content value="net-settlement" pt={4}>
                      <NetSettlementTab merchantId={merchantInfo?.mid || ''} />
                    </Tabs.Content>

                    <Tabs.Content value="notes" pt={4}>
                      <NotesTab merchantId={merchantInfo?.mid || ''} />
                    </Tabs.Content>
                  </Tabs.Root>
                </Box>
              </VStack>
            </Drawer.Body>

            {/* Sticky Action Footer */}
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
                    aria-label="Back to Queue"
                  >
                    <ArrowLeft size={16} />
                    Back to Queue
                  </Button>
                </Drawer.ActionTrigger>
                <Button
                  variant="outline"
                  onClick={handleEscalate}
                  disabled={isLoading}
                  aria-label="Escalate"
                >
                  <TrendingUp size={16} />
                  Escalate
                </Button>
                <Button
                  colorPalette="red"
                  variant="outline"
                  onClick={handleDivertCase}
                  disabled={isLoading}
                  aria-label="Divert Case"
                >
                  <Ban size={16} />
                  Divert Case
                </Button>
                <Drawer.ActionTrigger asChild>
                  <Button
                    colorPalette="blue"
                    onClick={handleMarkAsReviewed}
                    loading={isLoading}
                    disabled={isLoading}
                    aria-label="Mark as Reviewed"
                  >
                    <Check size={16} />
                    Mark as Reviewed
                  </Button>
                </Drawer.ActionTrigger>
              </HStack>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}

