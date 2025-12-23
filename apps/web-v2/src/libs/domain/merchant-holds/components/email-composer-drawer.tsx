'use client';
import React from 'react';
import {
  Drawer,
  Portal,
  VStack,
  HStack,
  Text,
  Box,
  Button,
  Input,
  Textarea,
  Select,
  createListCollection,
  CloseButton,
  Dialog,
  Badge,
} from '@chakra-ui/react';
import { Mail, X, Plus } from 'lucide-react';
import { toaster } from '@/ui/components/common/atoms/toaster/toaster';

interface EmailComposerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  merchantName: string;
  merchantEmail: string;
  initialRecipients?: string[];
  initialSubject?: string;
  initialBody?: string;
}

export default function EmailComposerDrawer({
  isOpen,
  onClose,
  merchantName,
  merchantEmail,
  initialRecipients,
  initialSubject,
  initialBody,
}: EmailComposerDrawerProps) {
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>('');
  const [emailSubject, setEmailSubject] = React.useState(initialSubject || '');
  const [emailBody, setEmailBody] = React.useState(initialBody || '');
  const [isSendingEmail, setIsSendingEmail] = React.useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
  const [newRecipient, setNewRecipient] = React.useState('');
  const [recipients, setRecipients] = React.useState<string[]>([]);

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
    return owners[0]?.email || merchantEmail;
  }, [merchantEmail]);

  // Initialize recipients when drawer opens
  React.useEffect(() => {
    if (isOpen) {
      if (initialRecipients && initialRecipients.length > 0) {
        setRecipients([...initialRecipients]);
      } else {
        setRecipients([firstOwnerEmail]);
      }
      if (initialSubject) {
        setEmailSubject(initialSubject);
      }
      if (initialBody) {
        setEmailBody(initialBody);
      }
    }
  }, [isOpen, initialRecipients, initialSubject, initialBody, firstOwnerEmail]);

  const handleAddRecipient = () => {
    const email = newRecipient.trim();
    if (email && email.includes('@') && !recipients.includes(email)) {
      setRecipients([...recipients, email]);
      setNewRecipient('');
    } else if (recipients.includes(email)) {
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
    setRecipients(recipients.filter((r) => r !== email));
  };

  // Helper function to replace placeholders in email templates
  const replaceTemplatePlaceholders = (template: string): string => {
    let result = template;
    
    // Merchant info
    result = result.replace(/\{\{MERCHANT_NAME\}\}/g, merchantName || 'Merchant');
    result = result.replace(/\{\{CONTACT_NAME\}\}/g, 'Contact');
    result = result.replace(/\{\{MERCHANT_ID\}\}/g, '');
    
    // Transaction info (not available in this context, leave placeholders)
    // These will remain as placeholders for user to fill manually
    
    // Processing parameters
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
  }, [merchantName]);

  const templateCollection = React.useMemo(
    () =>
      createListCollection({
        items: [
          { label: 'Duplicate Card Charges Investigation', value: 'Duplicate Card Charges Investigation' },
          { label: 'High Ticket / Large Transaction Verification', value: 'High Ticket / Large Transaction Verification' },
          { label: 'Processing Outside Approved Parameters', value: 'Processing Outside Approved Parameters' },
          { label: 'Risk Best Practices for Keyed Transactions', value: 'Risk Best Practices for Keyed Transactions' },
          { label: 'Refund Without Offsetting Sale', value: 'Refund Without Offsetting Sale' },
          { label: 'Processing on Dormant Account', value: 'Processing on Dormant Account' },
        ],
      }),
    []
  );

  // Handle template selection
  React.useEffect(() => {
    if (selectedTemplate && emailTemplates[selectedTemplate as keyof typeof emailTemplates]) {
      const template = emailTemplates[selectedTemplate as keyof typeof emailTemplates];
      
      // Replace placeholders
      const subject = replaceTemplatePlaceholders(template.subject);
      const body = replaceTemplatePlaceholders(template.body);
      
      setEmailSubject(subject);
      setEmailBody(body);
    }
  }, [selectedTemplate, emailTemplates, merchantName]);

  const handleClose = () => {
    setSelectedTemplate('');
    setEmailSubject('');
    setEmailBody('');
    setRecipients([]);
    setNewRecipient('');
    onClose();
  };

  const handleSendEmail = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSendEmail = async () => {
    setIsConfirmModalOpen(false);
    setIsSendingEmail(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toaster.success({
        title: 'Email sent successfully (mock)',
        description: `Email sent to ${recipients.length} recipient${recipients.length !== 1 ? 's' : ''}`,
      });
      handleClose();
    } catch (error) {
      toaster.error({
        title: 'Error',
        description: 'Failed to send email.',
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <>
    <Drawer.Root
      open={isOpen}
      onOpenChange={(e) => !e.open && handleClose()}
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
                    {merchantName || 'Merchant'}
                  </Text>
                </VStack>
                <CloseButton onClick={handleClose} />
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
                    {recipients.length > 0 && (
                      <HStack flexWrap="wrap" gap={2}>
                        {recipients.map((email) => (
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
                <Button variant="outline" onClick={handleClose} disabled={isSendingEmail}>
                  Cancel
                </Button>
                <Button
                  colorPalette="blue"
                  onClick={handleSendEmail}
                  loading={isSendingEmail}
                  disabled={isSendingEmail || !emailSubject || !emailBody || recipients.length === 0}
                >
                  <Mail size={16} />
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
      open={isConfirmModalOpen}
      onOpenChange={(e) => {
        if (!e.open) {
          setIsConfirmModalOpen(false);
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
                    Recipients ({recipients.length}):
                  </Text>
                  <VStack align="start" gap={1} w="full">
                    {recipients.map((email) => (
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
                <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>
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
    </>
  );
}

