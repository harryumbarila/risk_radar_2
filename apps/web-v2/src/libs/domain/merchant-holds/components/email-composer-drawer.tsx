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
} from '@chakra-ui/react';
import { Mail } from 'lucide-react';
import { toaster } from '@/ui/components/common/atoms/toaster/toaster';

interface EmailComposerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  merchantName: string;
  merchantEmail: string;
}

export default function EmailComposerDrawer({
  isOpen,
  onClose,
  merchantName,
  merchantEmail,
}: EmailComposerDrawerProps) {
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>('');
  const [emailSubject, setEmailSubject] = React.useState('');
  const [emailBody, setEmailBody] = React.useState('');
  const [isSendingEmail, setIsSendingEmail] = React.useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);

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

  // Email templates (same as Auto-Hold module)
  const emailTemplates = React.useMemo(() => {
    return {
      'Missing Documentation Request': {
        subject: 'Missing Documentation Request - Action Required',
        body: `Dear ${merchantName || 'Merchant'},

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
        body: `Dear ${merchantName || 'Merchant'},

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
        body: `Dear ${merchantName || 'Merchant'},

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
  }, [merchantName]);

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

  const handleClose = () => {
    setSelectedTemplate('');
    setEmailSubject('');
    setEmailBody('');
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
        description: `Email sent to ${firstOwnerEmail}`,
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
                    {firstOwnerEmail}
                  </Text>
                  <Text fontSize="xs" color="gray.500" fontStyle="italic">
                    (First Owner)
                  </Text>
                </VStack>
                <CloseButton onClick={handleClose} />
              </HStack>
            </Drawer.Header>

            {/* Body */}
            <Drawer.Body flex={1} overflowY="auto" px={6} py={6}>
              <VStack align="stretch" gap={4}>
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
                  disabled={isSendingEmail || !emailSubject || !emailBody}
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
                    Recipient Email:
                  </Text>
                  <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                    {firstOwnerEmail}
                  </Text>
                  <Text fontSize="xs" color="gray.500" fontStyle="italic">
                    (First Owner)
                  </Text>
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

