'use client';
import React from 'react';
import {
  VStack,
  Box,
  Text,
  Tabs,
  Badge,
  HStack,
  Select,
  createListCollection,
} from '@chakra-ui/react';
import { MerchantTransaction } from '@/data/interfaces/transaction';
import { toaster } from '@/ui/components/common/atoms/toaster/toaster';
import { Check, Ban, ArrowLeft, TrendingUp } from 'lucide-react';
import { Button } from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import ContactTab from '../tabs/contact-tab';
import DemographicsTab from '../tabs/demographics-tab';
import ChargebacksTab from '../tabs/chargebacks-tab';
import MatchTab from '../tabs/match-tab';
import VolumeTab from '../tabs/volume-tab';
import NotesTab from '../tabs/notes-tab';
import TransactionsTab from '../tabs/transactions-tab';
import UnderwritingTab from '../tabs/underwriting-tab';
import NetSettlementTab from '../tabs/net-settlement-tab';

interface BatchDetailPageProps {
  batch: MerchantTransaction[];
}

export default function BatchDetailPage({ batch }: BatchDetailPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('transactions');
  
  // Check if we came from Manager Queue
  const sourceParam = searchParams.get('source');
  const isFromManagerQueue = sourceParam === 'manager-queue';

  // Get merchant info from first transaction
  const merchantInfo = batch[0];
  const status = merchantInfo?.status || 'Unreviewed';
  
  // Mock data for demographics
  const merchantSource = merchantInfo?.source || 'Talus Pay';
  const riskWatch = merchantInfo?.riskWatch || false;

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
      router.back();
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
    <Box
      w="full"
      minH="100vh"
      bg="gray.50"
      display="flex"
      flexDirection="column"
    >
      {/* Sticky Header */}
      <Box
        position="sticky"
        top={0}
        zIndex={10}
        bg="white"
        borderBottom="1px"
        borderColor="gray.200"
        px={6}
        py={4}
        boxShadow="0 2px 8px rgba(0,0,0,0.05)"
      >
        <VStack align="stretch" gap={3}>
          <HStack justify="space-between" align="center">
            <VStack align="start" gap={1}>
              <Text fontSize="xl" fontWeight="bold">
                {merchantInfo?.merchant || 'Batch Details'}
              </Text>
              <Text fontSize="sm" color="gray.600">
                {batch.length} transactions in this batch
              </Text>
            </VStack>
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
            <HStack gap={2}>
              <Text fontSize="xs" color="gray.600" textTransform="uppercase">
                Source:
              </Text>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                      {merchantSource}
                    </Text>
            </HStack>
            <HStack gap={2}>
              <Text fontSize="xs" color="gray.600" textTransform="uppercase">
                Risk Watch:
              </Text>
              <Badge
                colorPalette={riskWatch ? 'red' : 'green'}
                variant="subtle"
                px={3}
                py={1}
              >
                {riskWatch ? 'Yes' : 'No'}
              </Badge>
            </HStack>
          </HStack>
        </VStack>
      </Box>

      {/* Main Content */}
      <Box
        flex={1}
        overflowY="auto"
        px={6}
        py={6}
      >
        <VStack align="stretch" gap={6} maxW="1400px" mx="auto">
          {/* Demographics Section - Fixed above tabs */}
          <Box
            bg="white"
            p={6}
            borderRadius="xl"
            boxShadow="0 2px 8px rgba(0,0,0,0.05)"
            borderWidth="1px"
            borderColor="gray.200"
          >
            <DemographicsTab
              merchantId={merchantInfo?.mid || ''}
              merchantName={merchantInfo?.merchant || ''}
            />
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

          {/* Volume Tab - Fixed below tabs */}
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
        </VStack>
      </Box>

      {/* Sticky Action Footer */}
      <Box
        position="sticky"
        bottom={0}
        bg="white"
        borderTop="1px"
        borderColor="gray.200"
        px={6}
        py={4}
        boxShadow="0 -2px 8px rgba(0,0,0,0.05)"
      >
        <HStack justify="flex-end" gap={3} w="full" maxW="1400px" mx="auto">
          <Button
            variant="ghost"
            disabled={isLoading}
            aria-label="Back to Queue"
            onClick={() => {
              if (isFromManagerQueue) {
                // Navigate back to Auto Hold with manager tab active
                router.push('/auto-hold?tab=manager');
              } else {
                router.back();
              }
            }}
          >
            <ArrowLeft size={16} />
            Back to Queue
          </Button>
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
        </HStack>
      </Box>
    </Box>
  );
}

