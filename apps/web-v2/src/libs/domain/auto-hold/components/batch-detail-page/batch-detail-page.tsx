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
  Dialog,
  Textarea,
  Portal,
  Tooltip,
  Drawer,
  Input,
  CloseButton,
  Table,
} from '@chakra-ui/react';
import { X, Plus } from 'lucide-react';
import { MerchantTransaction } from '@/data/interfaces/transaction';
import { toaster } from '@/ui/components/common/atoms/toaster/toaster';
import { Check, ArrowLeft, TrendingUp, Pause, Mail, Play } from 'lucide-react';
import { format } from 'date-fns';
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
  const [isOnHold, setIsOnHold] = React.useState(true);
  const [isHoldModalOpen, setIsHoldModalOpen] = React.useState(false);
  const [holdNote, setHoldNote] = React.useState('');
  const [isConfirmingHold, setIsConfirmingHold] = React.useState(false);
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = React.useState(false);
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>('');
  const [emailSubject, setEmailSubject] = React.useState('');
  const [emailBody, setEmailBody] = React.useState('');
  const [isSendingEmail, setIsSendingEmail] = React.useState(false);
  const [isEscalateModalOpen, setIsEscalateModalOpen] = React.useState(false);
  const [isReviewedModalOpen, setIsReviewedModalOpen] = React.useState(false);
  const [isEmailConfirmModalOpen, setIsEmailConfirmModalOpen] = React.useState(false);
  const [emailRecipients, setEmailRecipients] = React.useState<string[]>([]);
  const [newRecipient, setNewRecipient] = React.useState('');
  const [sentEmails, setSentEmails] = React.useState<Array<{
    id: string;
    timestamp: Date;
    recipients: string[];
    subject: string;
    body: string;
    transactionId?: string;
  }>>([]);
  const [selectedTransaction, setSelectedTransaction] = React.useState<MerchantTransaction | null>(null);
  const [autoNotes, setAutoNotes] = React.useState<Array<{
    id: string;
    note: string;
    dateCreated: string;
    createdBy: string;
    pushToIris: boolean;
    pinned: boolean;
  }>>([]);
  
  // Check if we came from Manager Queue
  const sourceParam = searchParams?.get('source');
  const isFromManagerQueue = sourceParam === 'manager-queue';

  // Function to add automatic note
  // createdBy defaults to 'System' for automated actions, but can be overridden for manual actions
  const addAutoNote = React.useCallback((noteText: string, createdBy?: string) => {
    const newNote = {
      id: `auto-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      note: noteText,
      dateCreated: new Date().toISOString().substring(0, 10),
      createdBy: createdBy || 'System', // Use provided user or default to 'System' for automated actions
      pushToIris: false,
      pinned: false,
    };
    setAutoNotes((prev) => [newNote, ...prev]);
  }, []);

  // Get current user name (mock - in real app, get from auth context)
  // TODO: Replace with actual auth context when available
  const getCurrentUserName = React.useCallback(() => {
    // In real app: const { user } = useAuth(); return user?.name || 'Unknown User';
    return 'Current User'; // Mock user name
  }, []);

  // TODO: Add whitelist functionality
  // When whitelist is implemented, add this note:
  // addAutoNote(`Account whitelisted. Merchant ${merchantInfo?.merchant || merchantInfo?.dbaName} (MID: ${merchantInfo?.mid}) has been added to the whitelist.`);

  // Get merchant info from first transaction (must be defined before useMemo hooks)
  const merchantInfo = batch[0];
  
  // Get first owner email (mock - in real app would come from API)
  const firstOwnerEmail = React.useMemo(() => {
    // Mock: Get first owner email from contact tab data
    // In real app, this would come from merchant contact API
    const owners = [
      {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1 (555) 123-4567',
        title: 'CEO',
        role: 'Primary Owner',
      },
      {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '+1 (555) 987-6543',
        title: 'CFO',
        role: 'Secondary Owner',
      },
    ];
    return owners[0]?.email || 'contact@example.com';
  }, []);

  // Mock merchant email (fallback)
  const merchantEmail = React.useMemo(() => {
    return firstOwnerEmail;
  }, [firstOwnerEmail]);
  
  // Email templates
  const emailTemplates = React.useMemo(() => {
    return {
      'Missing Documentation Request': {
        subject: 'Missing Documentation Request - Action Required',
        body: `Dear ${merchantInfo?.merchant || 'Merchant'},

We are writing to request additional documentation for your account. This information is required to complete our review process.

Please provide the following documents:
- Business license
- Bank statements (last 3 months)
- Proof of address

Please submit these documents within 7 business days.

If you have any questions, please contact our support team.

Best regards,
Risk Management Team`,
      },
      'Unusual Activity Notification': {
        subject: 'Unusual Activity Notification - Account Review',
        body: `Dear ${merchantInfo?.merchant || 'Merchant'},

We have detected unusual activity on your account that requires our attention. Our automated risk monitoring system has flagged certain transactions for review.

We are currently reviewing the following:
- Transaction patterns
- Volume changes
- Risk indicators

This is a standard review process. We will contact you if any additional information is needed.

Thank you for your understanding.

Best regards,
Risk Management Team`,
      },
      'Follow-Up: Auto-Hold Review': {
        subject: 'Follow-Up: Auto-Hold Review - Action Required',
        body: `Dear ${merchantInfo?.merchant || 'Merchant'},

This is a follow-up regarding the auto-hold review for your account. We need to discuss the current status and next steps.

Please review the following:
- Current account status
- Pending transactions
- Required actions

We recommend scheduling a call to discuss this matter in detail. Please contact us at your earliest convenience.

Best regards,
Risk Management Team`,
      },
    };
  }, [merchantInfo?.merchant]);
  
  const templateCollection = React.useMemo(
    () =>
      createListCollection({
        items: [
          { label: 'Missing Documentation Request', value: 'Missing Documentation Request' },
          { label: 'Unusual Activity Notification', value: 'Unusual Activity Notification' },
          { label: 'Follow-Up: Auto-Hold Review', value: 'Follow-Up: Auto-Hold Review' },
        ],
      }),
    []
  );
  
  // Handle template selection
  React.useEffect(() => {
    if (selectedTemplate && emailTemplates[selectedTemplate as keyof typeof emailTemplates]) {
      const template = emailTemplates[selectedTemplate as keyof typeof emailTemplates];
      setEmailSubject(template.subject);
      setEmailBody(template.body);
    }
  }, [selectedTemplate, emailTemplates]);

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
          { label: `Sent Emails (${sentEmails.length})`, value: 'sent-emails' },
        ],
      }),
    [batch.length, notesCount, sentEmails.length]
  );

  const handleMarkAsReviewed = () => {
    setIsReviewedModalOpen(true);
  };

  const handleConfirmMarkAsReviewed = async () => {
    setIsReviewedModalOpen(false);
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

  const handleEscalate = () => {
    setIsEscalateModalOpen(true);
  };

  const handleConfirmEscalate = () => {
    setIsEscalateModalOpen(false);
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        toaster.success({
          title: 'Batch escalated',
          description: 'This batch has been escalated for priority review.',
        });
        // Add automatic note with current user name
        addAutoNote('Batch escalated to Manager Queue for priority review.', getCurrentUserName());
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

  const handlePutOnHold = () => {
    setIsHoldModalOpen(true);
  };

  const handleConfirmHold = async () => {
    setIsConfirmingHold(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      if (isOnHold) {
        // Removing hold
        setIsOnHold(false);
        setIsHoldModalOpen(false);
        const noteText = holdNote 
          ? `Merchant hold removed. Internal note: ${holdNote}`
          : 'Merchant hold removed. Automated actions will resume.';
        setHoldNote('');
        toaster.success({
          title: 'Merchant hold removed',
          description: 'The merchant hold has been removed. Automated actions will resume.',
        });
        // Add automatic note with current user name
        addAutoNote(noteText, getCurrentUserName());
      } else {
        // Placing on hold
        setIsOnHold(true);
        setIsHoldModalOpen(false);
        const noteText = holdNote 
          ? `Merchant placed on hold. Internal note: ${holdNote}`
          : 'Merchant placed on hold. No automated actions will be taken.';
        setHoldNote('');
        toaster.success({
          title: 'Merchant placed on hold',
          description: 'The merchant has been placed on hold. No automated actions will be taken.',
        });
        // Add automatic note with current user name
        addAutoNote(noteText, getCurrentUserName());
      }
    } catch (error) {
      toaster.error({
        title: 'Error',
        description: isOnHold 
          ? 'Failed to remove merchant hold.'
          : 'Failed to place merchant on hold.',
      });
    } finally {
      setIsConfirmingHold(false);
    }
  };

  const handleCancelHold = () => {
    setIsHoldModalOpen(false);
    setHoldNote('');
  };

  const handleOpenEmailDrawer = () => {
    setIsEmailDrawerOpen(true);
    setSelectedTemplate('');
    setEmailSubject('');
    setEmailBody('');
    setEmailRecipients([firstOwnerEmail]);
    setNewRecipient('');
  };

  const handleCloseEmailDrawer = () => {
    setIsEmailDrawerOpen(false);
    setSelectedTemplate('');
    setEmailSubject('');
    setEmailBody('');
    setEmailRecipients([]);
    setNewRecipient('');
    setSelectedTransaction(null);
  };

  const handleAddRecipient = () => {
    const email = newRecipient.trim();
    if (email && email.includes('@') && !emailRecipients.includes(email)) {
      setEmailRecipients([...emailRecipients, email]);
      setNewRecipient('');
    } else if (emailRecipients.includes(email)) {
      toaster.warning({
        title: 'Duplicate email',
        description: 'This email is already in the recipient list.',
      });
    } else {
      toaster.warning({
        title: 'Invalid email',
        description: 'Please enter a valid email address.',
      });
    }
  };

  const handleRemoveRecipient = (email: string) => {
    setEmailRecipients(emailRecipients.filter((r) => r !== email));
  };

  const handleSendEmail = () => {
    setIsEmailConfirmModalOpen(true);
  };

  const handleConfirmSendEmail = async () => {
    setIsEmailConfirmModalOpen(false);
    setIsSendingEmail(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Save email to sent emails list
      const newEmail = {
        id: `email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        recipients: emailRecipients,
        subject: emailSubject,
        body: emailBody,
        transactionId: selectedTransaction?.id,
      };
      setSentEmails((prev) => [newEmail, ...prev]);
      
      // Add automatic note with current user name
      const recipientsList = emailRecipients.join(', ');
      const emailNote = selectedTransaction
        ? `Email sent to ${recipientsList}. Subject: "${emailSubject}". Related to transaction ${selectedTransaction.id}.`
        : `Email sent to ${recipientsList}. Subject: "${emailSubject}".`;
      addAutoNote(emailNote, getCurrentUserName());
      
      toaster.success({
        title: 'Email sent successfully (mock)',
        description: `Email sent to ${emailRecipients.length} recipient${emailRecipients.length !== 1 ? 's' : ''}`,
      });
      handleCloseEmailDrawer();
      setSelectedTransaction(null);
    } catch (error) {
      toaster.error({
        title: 'Error',
        description: 'Failed to send email.',
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleTransactionClick = (transaction: MerchantTransaction) => {
    setSelectedTransaction(transaction);
    // Pre-fill email with transaction details
    const transactionDetails = `
Transaction Details:
- MID: ${transaction.mid}
- Amount: ${transaction.amount}
- Date: ${transaction.date}
- Merchant: ${transaction.merchant || transaction.dbaName}
- Status: ${transaction.status}

Please review this transaction and take appropriate action.

Best regards,
Risk Management Team`;
    setEmailSubject(`Transaction Review Required - ${transaction.mid}`);
    setEmailBody(transactionDetails);
    setEmailRecipients([firstOwnerEmail]);
    setNewRecipient('');
    setIsEmailDrawerOpen(true);
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
              <HStack gap={2} align="center">
                <Text fontSize="xl" fontWeight="bold">
                  {merchantInfo?.merchant || 'Batch Details'}
                </Text>
                {isOnHold && (
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <Badge
                        colorPalette="amber"
                        variant="solid"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="xs"
                        fontWeight="medium"
                      >
                        On Hold
                      </Badge>
                    </Tooltip.Trigger>
                    <Portal>
                      <Tooltip.Positioner>
                        <Tooltip.Content
                          maxW="250px"
                          zIndex={1100}
                          bg="gray.900"
                          color="white"
                          px={3}
                          py={2}
                          borderRadius="md"
                          fontSize="sm"
                          boxShadow="lg"
                        >
                          <Tooltip.Arrow />
                          Merchant was placed on hold by analyst.
                        </Tooltip.Content>
                      </Tooltip.Positioner>
                    </Portal>
                  </Tooltip.Root>
                )}
              </HStack>
              <Text fontSize="sm" color="gray.600">
                {batch.length} transactions in this batch
              </Text>
            </VStack>
          </HStack>
          <HStack gap={4} flexWrap="wrap">
            <HStack gap={2}>
              <Text fontSize="xs" color="gray.600" textTransform="uppercase">
                MID:
              </Text>
              <Text fontSize="sm" fontWeight="semibold" color="gray.900" fontFamily="mono">
                {merchantInfo?.mid || 'N/A'}
              </Text>
            </HStack>
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
              merchantName={merchantInfo?.dbaName || merchantInfo?.merchant || ''}
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
                suppressHydrationWarning
              >
                <Tabs.Trigger value="transactions" suppressHydrationWarning>
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
                <Tabs.Trigger value="contact" suppressHydrationWarning>Contact</Tabs.Trigger>
                <Tabs.Trigger value="chargebacks" suppressHydrationWarning>Chargebacks</Tabs.Trigger>
                <Tabs.Trigger value="match" suppressHydrationWarning>Match</Tabs.Trigger>
                <Tabs.Trigger value="underwriting" suppressHydrationWarning>Underwriting</Tabs.Trigger>
                <Tabs.Trigger value="net-settlement" suppressHydrationWarning>Net Settlement</Tabs.Trigger>
                <Tabs.Trigger value="notes" suppressHydrationWarning>
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
                <Tabs.Trigger value="sent-emails" suppressHydrationWarning>
                  <HStack gap={2}>
                    <Text>Sent Emails</Text>
                    <Badge
                      colorPalette="blue"
                      variant="solid"
                      px={2}
                      py={0.5}
                      borderRadius="full"
                      fontSize="xs"
                    >
                      {sentEmails.length}
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
                  suppressHydrationWarning
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
                <TransactionsTab transactions={batch} onTransactionClick={handleTransactionClick} />
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
                <NotesTab 
                  merchantId={merchantInfo?.mid || ''} 
                  externalNotes={autoNotes}
                />
              </Tabs.Content>

              <Tabs.Content value="sent-emails" pt={4}>
                <Box
                  bg="white"
                  borderRadius="xl"
                  boxShadow="0 2px 8px rgba(0,0,0,0.05)"
                  borderWidth="1px"
                  borderColor="gray.200"
                  p={6}
                >
                  <VStack align="stretch" gap={4}>
                    {sentEmails.length === 0 ? (
                      <Box textAlign="center" py={12}>
                        <Text fontSize="md" color="gray.500">
                          No emails sent yet
                        </Text>
                        <Text fontSize="sm" color="gray.400" mt={2}>
                          Emails sent from this batch will appear here
                        </Text>
                      </Box>
                    ) : (
                      <Table.Root size="sm">
                        <Table.Header>
                          <Table.Row>
                            <Table.ColumnHeader>Sent Date</Table.ColumnHeader>
                            <Table.ColumnHeader>Recipients</Table.ColumnHeader>
                            <Table.ColumnHeader>Subject</Table.ColumnHeader>
                            <Table.ColumnHeader>Transaction</Table.ColumnHeader>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {sentEmails.map((email) => (
                            <Table.Row key={email.id}>
                              <Table.Cell>
                                <Text fontSize="sm">
                                  {format(email.timestamp, 'MMM dd, yyyy HH:mm')}
                                </Text>
                              </Table.Cell>
                              <Table.Cell>
                                <VStack align="start" gap={1}>
                                  {email.recipients.map((recipient, idx) => (
                                    <Text key={idx} fontSize="sm" color="gray.700">
                                      {recipient}
                                    </Text>
                                  ))}
                                </VStack>
                              </Table.Cell>
                              <Table.Cell>
                                <Text fontSize="sm" fontWeight="medium">
                                  {email.subject}
                                </Text>
                              </Table.Cell>
                              <Table.Cell>
                                {email.transactionId ? (
                                  <Badge colorPalette="blue" variant="subtle">
                                    {email.transactionId.substring(0, 8)}...
                                  </Badge>
                                ) : (
                                  <Text fontSize="sm" color="gray.400">
                                    N/A
                                  </Text>
                                )}
                              </Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table.Root>
                    )}
                  </VStack>
                </Box>
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
            suppressHydrationWarning
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
          {isOnHold ? (
            <Button
              colorPalette="green"
              variant="outline"
              onClick={handlePutOnHold}
              disabled={isLoading}
              aria-label="Remove Merchant Hold"
              suppressHydrationWarning
            >
              <Play size={16} />
              Remove Merchant Hold
            </Button>
          ) : (
            <Button
              colorPalette="red"
              variant="outline"
              onClick={handlePutOnHold}
              disabled={isLoading}
              aria-label="Put Merchant On Hold"
              suppressHydrationWarning
            >
              <Pause size={16} />
              Put Merchant On Hold
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleOpenEmailDrawer}
            disabled={isLoading}
            aria-label="Email Merchant"
            suppressHydrationWarning
          >
            <Mail size={16} />
            Email Merchant
          </Button>
          <Button
            variant="outline"
            onClick={handleEscalate}
            disabled={isLoading}
            aria-label="Escalate"
            suppressHydrationWarning
          >
            <TrendingUp size={16} />
            Escalate
          </Button>
          <Button
            colorPalette="blue"
            onClick={handleMarkAsReviewed}
            loading={isLoading}
            disabled={isLoading}
            aria-label="Mark as Reviewed"
            suppressHydrationWarning
          >
            <Check size={16} />
            Mark as Reviewed
          </Button>
        </HStack>
      </Box>

      {/* Put On Hold Confirmation Modal */}
      <Dialog.Root
        open={isHoldModalOpen}
        onOpenChange={(e) => {
          if (!e.open) {
            handleCancelHold();
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content maxW="500px">
              <Dialog.Header>
                <Dialog.Title>
                  {isOnHold ? 'Remove Merchant Hold?' : 'Put Merchant On Hold?'}
                </Dialog.Title>
                <Dialog.Description>
                  {isOnHold
                    ? 'This will remove the hold on the merchant. Automated actions will resume for this merchant.'
                    : 'This will mark the merchant as On Hold in the Auto-Hold workflow. No automated actions will be taken while the merchant remains on hold.'}
                </Dialog.Description>
              </Dialog.Header>
              <Dialog.Body>
                <VStack align="stretch" gap={4}>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                      Internal Note (Optional)
                    </Text>
                    <Textarea
                      placeholder={isOnHold 
                        ? 'Add an internal note about why this merchant hold is being removed...'
                        : 'Add an internal note about why this merchant is being placed on hold...'}
                      value={holdNote}
                      onChange={(e) => setHoldNote(e.target.value)}
                      rows={4}
                      resize="vertical"
                    />
                  </Box>
                </VStack>
              </Dialog.Body>
              <Dialog.Footer>
                <HStack gap={3} w="full" justify="flex-end">
                  <Button
                    variant="outline"
                    onClick={handleCancelHold}
                    disabled={isConfirmingHold}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorPalette={isOnHold ? 'green' : 'blue'}
                    onClick={handleConfirmHold}
                    loading={isConfirmingHold}
                    disabled={isConfirmingHold}
                  >
                    {isOnHold ? 'Remove Hold' : 'Confirm Hold'}
                  </Button>
                </HStack>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Email Merchant Drawer */}
      <Drawer.Root
        open={isEmailDrawerOpen}
        onOpenChange={(e) => !e.open && handleCloseEmailDrawer()}
        placement="end"
        size="md"
      >
        <Portal>
          <Drawer.Backdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
          <Drawer.Positioner>
            <Drawer.Content
              width={{ base: '100%', md: '480px' }}
              height="full"
              display="flex"
              flexDirection="column"
              bg="white"
              boxShadow="lg"
            >
              {/* Header */}
              <Drawer.Header
                position="sticky"
                top={0}
                zIndex={10}
                bg="white"
                borderBottomWidth="1px"
                borderColor="gray.200"
                px={6}
                py={4}
              >
                <HStack justify="space-between" align="center">
                  <VStack align="start" gap={0}>
                    <Text fontSize="lg" fontWeight="semibold" color="gray.900">
                      Email Merchant
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {firstOwnerEmail}
                    </Text>
                    <Text fontSize="xs" color="gray.500" fontStyle="italic">
                      (First Owner)
                    </Text>
                  </VStack>
                  <CloseButton onClick={handleCloseEmailDrawer} />
                </HStack>
              </Drawer.Header>

              {/* Body */}
              <Drawer.Body flex={1} overflowY="auto" px={6} py={6}>
                <VStack align="stretch" gap={4}>
                  {/* Recipients */}
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                      Recipients
                    </Text>
                    <VStack align="stretch" gap={2}>
                      {/* Recipient badges */}
                      {emailRecipients.length > 0 && (
                        <HStack flexWrap="wrap" gap={2}>
                          {emailRecipients.map((email) => (
                            <Badge
                              key={email}
                              colorPalette="blue"
                              variant="subtle"
                              px={3}
                              py={1}
                              borderRadius="md"
                              display="flex"
                              alignItems="center"
                              gap={2}
                            >
                              <Text fontSize="xs">{email}</Text>
                              <Box
                                as="button"
                                onClick={() => handleRemoveRecipient(email)}
                                _hover={{ opacity: 0.7 }}
                                cursor="pointer"
                                aria-label={`Remove ${email}`}
                              >
                                <X size={12} />
                              </Box>
                            </Badge>
                          ))}
                        </HStack>
                      )}
                      {/* Add recipient input */}
                      <HStack gap={2}>
                        <Input
                          value={newRecipient}
                          onChange={(e) => setNewRecipient(e.target.value)}
                          placeholder="Add recipient email"
                          type="email"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAddRecipient();
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          onClick={handleAddRecipient}
                          disabled={!newRecipient.trim()}
                        >
                          <Plus size={16} />
                        </Button>
                      </HStack>
                    </VStack>
                  </Box>

                  {/* Template Selector */}
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                      Select Template
                    </Text>
                    <Select.Root
                      collection={templateCollection}
                      value={selectedTemplate ? [selectedTemplate] : undefined}
                      onValueChange={(e) => {
                        const newValue = e.value[0] || '';
                        setSelectedTemplate(newValue);
                      }}
                      suppressHydrationWarning
                    >
                      <Select.HiddenSelect />
                      <Select.Control>
                        <Select.Trigger suppressHydrationWarning>
                          <Select.ValueText placeholder="Select Template" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>
                      <Portal>
                        <Select.Positioner zIndex={10000}>
                          <Select.Content zIndex={10000} maxH="200px" overflowY="auto" minW="200px">
                            {templateCollection.items.map((item) => (
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

                  {/* Subject */}
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                      Subject
                    </Text>
                    <Input
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Email subject"
                    />
                  </Box>

                  {/* Body */}
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                      Body
                    </Text>
                    <Textarea
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="Email body"
                      rows={12}
                      resize="vertical"
                    />
                  </Box>
                </VStack>
              </Drawer.Body>

              {/* Footer */}
              <Drawer.Footer
                position="sticky"
                bottom={0}
                bg="white"
                borderTopWidth="1px"
                borderColor="gray.200"
                px={6}
                py={4}
              >
                <HStack gap={3} w="full" justify="flex-end">
                  <Button
                    variant="outline"
                    onClick={handleCloseEmailDrawer}
                    disabled={isSendingEmail}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorPalette="blue"
                    onClick={handleSendEmail}
                    loading={isSendingEmail}
                    disabled={isSendingEmail || !emailSubject || !emailBody || emailRecipients.length === 0}
                  >
                    Send Email
                  </Button>
                </HStack>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>

      {/* Email Confirmation Modal */}
      <Dialog.Root
        open={isEmailConfirmModalOpen}
        onOpenChange={(e) => {
          if (!e.open) {
            setIsEmailConfirmModalOpen(false);
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content maxW="500px">
              <Dialog.Header>
                <Dialog.Title>Confirm Email Send</Dialog.Title>
                <Dialog.Description>
                  Are you sure you want to send this email?
                </Dialog.Description>
              </Dialog.Header>
            <Dialog.Body>
              <VStack align="stretch" gap={3}>
                <VStack align="start" gap={1}>
                  <Text fontSize="xs" color="gray.600" fontWeight="medium">
                    Recipients ({emailRecipients.length}):
                  </Text>
                  <VStack align="start" gap={1} w="full">
                    {emailRecipients.map((email) => (
                      <Text key={email} fontSize="sm" fontWeight="semibold" color="gray.900">
                        {email}
                      </Text>
                    ))}
                  </VStack>
                </VStack>
                <VStack align="start" gap={1}>
                  <Text fontSize="xs" color="gray.600" fontWeight="medium">
                    Subject:
                  </Text>
                  <Text fontSize="sm" color="gray.700">
                    {emailSubject}
                  </Text>
                </VStack>
              </VStack>
            </Dialog.Body>
              <Dialog.Footer>
                <HStack gap={3} w="full" justify="flex-end">
                  <Button variant="outline" onClick={() => setIsEmailConfirmModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button colorPalette="blue" onClick={handleConfirmSendEmail}>
                    Confirm Send
                  </Button>
                </HStack>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Escalate Confirmation Modal */}
      <Dialog.Root
        open={isEscalateModalOpen}
        onOpenChange={(e) => {
          if (!e.open) {
            setIsEscalateModalOpen(false);
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content maxW="500px">
              <Dialog.Header>
                <Dialog.Title>Escalate Batch?</Dialog.Title>
                <Dialog.Description>
                  This batch will be escalated for priority review by a manager. Are you sure you want to proceed?
                </Dialog.Description>
              </Dialog.Header>
              <Dialog.Footer>
                <HStack gap={3} w="full" justify="flex-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsEscalateModalOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorPalette="blue"
                    onClick={handleConfirmEscalate}
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    Confirm Escalate
                  </Button>
                </HStack>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Mark as Reviewed Confirmation Modal */}
      <Dialog.Root
        open={isReviewedModalOpen}
        onOpenChange={(e) => {
          if (!e.open) {
            setIsReviewedModalOpen(false);
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content maxW="500px">
              <Dialog.Header>
                <Dialog.Title>Mark Batch as Reviewed?</Dialog.Title>
                <Dialog.Description>
                  This will mark all {batch.length} transactions in this batch as reviewed. This action cannot be undone. Are you sure you want to proceed?
                </Dialog.Description>
              </Dialog.Header>
              <Dialog.Footer>
                <HStack gap={3} w="full" justify="flex-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsReviewedModalOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorPalette="blue"
                    onClick={handleConfirmMarkAsReviewed}
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    Confirm Review
                  </Button>
                </HStack>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
}

