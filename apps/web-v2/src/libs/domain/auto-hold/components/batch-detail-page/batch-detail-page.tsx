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
import SharedAttachmentsTab from '../tabs/shared-attachments-tab';

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

  // Mock account status (Open/Closed) based on MID
  // In real app, this would come from API
  // Using deterministic logic based on MID hash to ensure consistency
  const getAccountStatus = React.useCallback((mid: string | undefined): 'Open' | 'Closed' => {
    if (!mid) return 'Open';
    // Mock: Use MID hash to deterministically assign status
    // This ensures the same MID always gets the same status
    const midHash = mid.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    // ~15% of accounts are closed
    return (midHash % 7 === 0) ? 'Closed' : 'Open';
  }, []);

  // Mock Amex program status based on MID
  // In real app, this would come from API
  // Using deterministic logic based on MID hash to ensure consistency
  const getAmexProgram = React.useCallback((mid: string | undefined): 'Opt Blue' | 'EASI' | null => {
    if (!mid) return null;
    // Mock: Use MID hash to deterministically assign programs
    // This ensures the same MID always gets the same program
    const midHash = mid.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const programIndex = midHash % 10;
    
    // Assign Opt Blue to ~30% of MIDs
    if (programIndex < 3) return 'Opt Blue';
    // Assign EASI to ~20% of MIDs
    if (programIndex >= 3 && programIndex < 5) return 'EASI';
    // Rest have no Amex program
    return null;
  }, []);

  const accountStatus = getAccountStatus(merchantInfo?.mid);
  const amexProgram = getAmexProgram(merchantInfo?.mid);
  
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
  
  // Helper function to extract last 4 digits from card number
  const extractCardLastFour = (cardNumber?: string, cardLastFour?: string): string => {
    if (cardLastFour) {
      return cardLastFour;
    }
    if (cardNumber) {
      // Extract last 4 digits from various formats:
      // "****1234" -> "1234"
      // "123456 •••• 7890" -> "7890"
      // "1234567890123456" -> "3456"
      const match = cardNumber.match(/(\d{4})[^\d]*$/);
      if (match && match[1]) {
        return match[1];
      }
      // Try to extract from middle format "123456 •••• 7890"
      const middleMatch = cardNumber.match(/•{4}\s*(\d{4})/);
      if (middleMatch && middleMatch[1]) {
        return middleMatch[1];
      }
    }
    return '';
  };

  // Helper function to extract AVS code
  const extractAVSCode = (avsCode?: string, avsResult?: string): string => {
    if (avsCode) {
      return avsCode;
    }
    if (avsResult) {
      // Extract code from formats like "Y - Match" or "Y"
      const match = avsResult.match(/^([YNZA])/);
      if (match && match[1]) {
        return match[1];
      }
    }
    return '';
  };

  // Helper function to replace placeholders in email templates
  const replaceTemplatePlaceholders = (
    template: string,
    transaction?: MerchantTransaction | null,
    merchantName?: string,
    contactName?: string
  ): string => {
    let result = template;
    
    // Merchant info
    result = result.replace(/\{\{MERCHANT_NAME\}\}/g, merchantName || merchantInfo?.merchant || 'Merchant');
    result = result.replace(/\{\{CONTACT_NAME\}\}/g, contactName || 'Contact');
    result = result.replace(/\{\{MERCHANT_ID\}\}/g, merchantInfo?.mid || '');
    
    // Transaction info (only if transaction is provided)
    if (transaction) {
      result = result.replace(/\{\{TRANSACTION_DATE\}\}/g, transaction.date || 'N/A');
      result = result.replace(/\{\{TRANSACTION_AMOUNT\}\}/g, transaction.amount || 'N/A');
      
      // Extract and format card number (last 4 digits)
      const cardLastFour = extractCardLastFour(transaction.cardNumber, transaction.cardLastFour);
      const cardMasked = cardLastFour ? `****${cardLastFour}` : (transaction.cardNumber || 'N/A');
      result = result.replace(/\{\{CARD_MASKED\}\}/g, cardMasked);
      
      // Extract AVS code
      const avsCode = extractAVSCode(transaction.avsCode, transaction.avsResult);
      result = result.replace(/\{\{AVS_CODE\}\}/g, avsCode || 'N/A');
      
      // Auth code
      result = result.replace(/\{\{AUTH_CODE\}\}/g, transaction.authCode || 'N/A');
    } else {
      // Remove transaction-specific placeholders if no transaction
      result = result.replace(/\{\{TRANSACTION_DATE\}\}/g, 'N/A');
      result = result.replace(/\{\{TRANSACTION_AMOUNT\}\}/g, 'N/A');
      result = result.replace(/\{\{CARD_MASKED\}\}/g, 'N/A');
      result = result.replace(/\{\{AVS_CODE\}\}/g, 'N/A');
      result = result.replace(/\{\{AUTH_CODE\}\}/g, 'N/A');
    }
    
    // Processing parameters (for template 3)
    result = result.replace(/\{\{APPROVED_VOLUME\}\}/g, 'N/A');
    result = result.replace(/\{\{APPROVED_HIGH_TICKET\}\}/g, 'N/A');
    result = result.replace(/\{\{APPROVED_SWIPE_RATE\}\}/g, 'N/A');
    result = result.replace(/\{\{CURRENT_VOLUME\}\}/g, 'N/A');
    result = result.replace(/\{\{CURRENT_HIGH_TICKET\}\}/g, 'N/A');
    result = result.replace(/\{\{CURRENT_SWIPE_RATE\}\}/g, 'N/A');
    result = result.replace(/\{\{DORMANT_PERIOD\}\}/g, 'N/A');
    
    return result;
  };

  // Get contact name (mock - in real app would come from API)
  const contactName = React.useMemo(() => {
    const owners = [
      { name: 'John Smith', email: 'john.smith@example.com' },
      { name: 'Jane Doe', email: 'jane.doe@example.com' },
    ];
    return owners[0]?.name || 'Contact';
  }, []);

  // Email templates
  const emailTemplates = React.useMemo(() => {
    const merchantName = merchantInfo?.merchant || 'Merchant';
    const merchantId = merchantInfo?.mid || '';
    
    return {
      'Duplicate Card Charges Investigation': {
        subject: 'Action Required: Multiple Transactions on the Same Card – {{MERCHANT_NAME}}',
        body: `Hello {{CONTACT_NAME}} at {{MERCHANT_NAME}},

We noticed that multiple transactions were processed on the same credit card. Please see the details below:

Transaction Date: {{TRANSACTION_DATE}}
Transaction Amount: {{TRANSACTION_AMOUNT}}
Card #: {{CARD_MASKED}}

We would like to confirm the details of these transactions. When you have a moment, please provide a brief explanation as to why the same credit card was charged multiple times on the same day.

If you were not aware of these transactions and they were processed in error, please notify us and ensure the correct amount is refunded to the cardholder. This will help avoid potential chargebacks.

Please feel free to contact us if you have any questions.

Thank you for your cooperation,

Risk Management Department  
Talus Payments`,
        requiresTransaction: true,
      },
      'High Ticket / Large Transaction Verification': {
        subject: 'Documentation Required: Large Transaction Review – {{MERCHANT_NAME}}',
        body: `Dear {{CONTACT_NAME}} at {{MERCHANT_NAME}},

This email is to collect documentation required to remove a temporary hold of funds. A recent transaction flagged our security system for verification.

Please provide a copy of the signed credit card receipt and invoice that includes:
- Cardholder name
- Billing address
- Description of products or services rendered

Transaction Details:
Transaction Date: {{TRANSACTION_DATE}}
Transaction Amount: {{TRANSACTION_AMOUNT}}
Card #: {{CARD_MASKED}}
AVS: {{AVS_CODE}}
Auth Code: {{AUTH_CODE}}

Please do not release any product or service related to this transaction until our review is complete.

Thank you for your cooperation,

Risk Management Department  
Talus Payments`,
        requiresTransaction: true,
      },
      'Processing Outside Approved Parameters': {
        subject: 'Action Required: Processing Outside Approved Parameters – {{MERCHANT_NAME}}',
        body: `Hello {{CONTACT_NAME}} at {{MERCHANT_NAME}},

We are reaching out from the Risk Department regarding recent processing activity on your account.

Approved Parameters:
- Average Monthly Volume: {{APPROVED_VOLUME}}
- High Ticket: {{APPROVED_HIGH_TICKET}}
- Swipe Rate: {{APPROVED_SWIPE_RATE}}

Current Activity:
- Average Monthly Volume: {{CURRENT_VOLUME}}
- High Ticket: {{CURRENT_HIGH_TICKET}}
- Swipe Rate: {{CURRENT_SWIPE_RATE}}

Due to this variance, please provide:
1. Whether this increase is expected to continue
2. Three most recent business bank statements

Thank you for your cooperation,

Risk Management Department  
Talus Payments`,
        requiresTransaction: false,
      },
      'Risk Best Practices for Keyed Transactions': {
        subject: 'Best Practices for Keyed Transactions – {{MERCHANT_NAME}} – {{MERCHANT_ID}}',
        body: `Dear {{CONTACT_NAME}} at {{MERCHANT_NAME}},

We are reaching out to share best practices for manually entered (keyed) transactions.

For large keyed transactions, we strongly recommend:
- Obtaining a positive AVS match (Y)
- Capturing a card imprint or copy (when applicable)
- Shipping only to the billing address
- Retaining signed receipts and invoices

Below is a recent transaction for reference:
Transaction Date: {{TRANSACTION_DATE}}
Transaction Amount: {{TRANSACTION_AMOUNT}}
Card #: {{CARD_MASKED}}
AVS: {{AVS_CODE}}
Auth Code: {{AUTH_CODE}}

AVS Codes:
Y = Address and ZIP match  
A = Address match  
Z = ZIP match  
N = No match  

Thank you for helping reduce risk on your account.

Risk Management Department  
Talus Payments`,
        requiresTransaction: true,
      },
      'Refund Without Offsetting Sale': {
        subject: 'Refund Verification Required – {{MERCHANT_NAME}}',
        body: `Hello {{CONTACT_NAME}} at {{MERCHANT_NAME}},

We are reaching out regarding the following refund transaction:

Transaction Date: {{TRANSACTION_DATE}}
Transaction Amount: {{TRANSACTION_AMOUNT}}
Card #: {{CARD_MASKED}}
AVS: {{AVS_CODE}}
Auth Code: {{AUTH_CODE}}

We are unable to locate an offsetting sale. Please clarify:
- When the original sale occurred
- Why the refund amount differs
- Why the refund was issued to a different card

As a reminder, refunds should always be processed to the original card used.

Thank you,

Risk Management Department  
Talus Payments`,
        requiresTransaction: true,
      },
      'Processing on Dormant Account': {
        subject: 'Action Needed: Processing on Dormant Account – {{MERCHANT_NAME}} – {{MERCHANT_ID}}',
        body: `Dear {{CONTACT_NAME}} at {{MERCHANT_NAME}},

We are reaching out regarding recent activity on your account after a period of inactivity.

Please provide documentation for the following transaction(s):
Transaction Date: {{TRANSACTION_DATE}}
Transaction Amount: {{TRANSACTION_AMOUNT}}
Card #: {{CARD_MASKED}}
AVS: {{AVS_CODE}}
Auth Code: {{AUTH_CODE}}

It appears there was no processing activity during:
{{DORMANT_PERIOD}}

Please clarify:
- Reason for dormancy
- Any ownership or business changes
- Whether alternative processors were used
- Whether dormancy is seasonal or expected

Thank you for your cooperation,

Risk Management Department  
Talus Payments`,
        requiresTransaction: true,
      },
    };
  }, [merchantInfo?.merchant, merchantInfo?.mid]);
  
  // Get available templates based on whether a transaction is selected
  const availableTemplates = React.useMemo(() => {
    if (selectedTransaction) {
      // When transaction is selected, show only templates that require transaction data
      return Object.entries(emailTemplates)
        .filter(([_, template]) => template.requiresTransaction)
        .map(([key]) => ({ label: key, value: key }));
    } else {
      // When no transaction is selected, show all templates
      return Object.keys(emailTemplates).map((key) => ({ label: key, value: key }));
    }
  }, [selectedTransaction, emailTemplates]);

  const templateCollection = React.useMemo(
    () => createListCollection({ items: availableTemplates }),
    [availableTemplates]
  );
  
  // Handle template selection
  React.useEffect(() => {
    if (selectedTemplate && emailTemplates[selectedTemplate as keyof typeof emailTemplates]) {
      const template = emailTemplates[selectedTemplate as keyof typeof emailTemplates];
      const merchantName = merchantInfo?.merchant || 'Merchant';
      const merchantId = merchantInfo?.mid || '';
      
      // Replace placeholders
      const subject = replaceTemplatePlaceholders(
        template.subject,
        selectedTransaction,
        merchantName,
        contactName
      );
      const body = replaceTemplatePlaceholders(
        template.body,
        selectedTransaction,
        merchantName,
        contactName
      );
      
      setEmailSubject(subject);
      setEmailBody(body);
    }
  }, [selectedTemplate, emailTemplates, selectedTransaction, merchantInfo, contactName]);

  const status = merchantInfo?.status || 'Unreviewed';
  
  // Mock data for demographics
  const merchantSource = merchantInfo?.source || 'Talus Pay';
  const riskWatch = merchantInfo?.riskWatch || false;

  // Mock notes count
  const notesCount = 3;

  // Mock shared attachments count
  const sharedAttachmentsCount = 5;

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
          { label: `Shared Attachments (${sharedAttachmentsCount})`, value: 'shared-attachments' },
        ],
      }),
    [batch.length, notesCount, sentEmails.length, sharedAttachmentsCount]
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
    // Reset selected transaction when opening drawer without clicking a transaction
    setSelectedTransaction(null);
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
    
    // Pre-fill email with first transaction-based template (Duplicate Card Charges Investigation)
    const templateKey = 'Duplicate Card Charges Investigation';
    const template = emailTemplates[templateKey];
    
    if (template) {
      const merchantName = merchantInfo?.merchant || transaction.merchant || transaction.dbaName || 'Merchant';
      const subject = replaceTemplatePlaceholders(
        template.subject,
        transaction,
        merchantName,
        contactName
      );
      const body = replaceTemplatePlaceholders(
        template.body,
        transaction,
        merchantName,
        contactName
      );
      
      setSelectedTemplate(templateKey);
      setEmailSubject(subject);
      setEmailBody(body);
    }
    
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
              <Badge
                colorPalette={accountStatus === 'Open' ? 'green' : 'red'}
                variant="subtle"
                px={2}
                py={0.5}
                fontSize="xs"
                fontWeight="medium"
              >
                {accountStatus}
              </Badge>
            </HStack>
            {amexProgram && (
              <HStack gap={2}>
                <Text fontSize="xs" color="gray.600" textTransform="uppercase">
                  Amex Program:
                </Text>
                <Badge
                  colorPalette="blue"
                  variant="subtle"
                  px={2}
                  py={0.5}
                  fontSize="xs"
                  fontWeight="medium"
                >
                  {amexProgram}
                </Badge>
              </HStack>
            )}
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
                <Tabs.Trigger value="shared-attachments" suppressHydrationWarning>
                  <HStack gap={2}>
                    <Text>Shared Attachments</Text>
                    <Badge
                      colorPalette="purple"
                      variant="solid"
                      px={2}
                      py={0.5}
                      borderRadius="full"
                      fontSize="xs"
                    >
                      {sharedAttachmentsCount}
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

              <Tabs.Content value="shared-attachments" pt={4}>
                <SharedAttachmentsTab merchantId={merchantInfo?.mid || ''} />
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

