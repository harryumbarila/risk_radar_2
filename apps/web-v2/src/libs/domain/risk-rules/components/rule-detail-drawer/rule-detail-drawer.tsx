'use client';

import React from 'react';
import {
  Box,
  Drawer,
  HStack,
  VStack,
  Text,
  Badge,
  Button,
  Tabs,
  Separator,
  Portal,
  Dialog,
  Tooltip,
  SimpleGrid,
} from '@chakra-ui/react';
import { X, Save, Info } from 'lucide-react';
import { useRules, EFFECTIVE_DATE_PARAM_KEY } from '../../context/rules-context';
import RuleEditForm from '../rule-edit-form/rule-edit-form';
import RuleAuditLog from '../rule-audit-log/rule-audit-log';
import { toaster } from '@/ui/components/common/atoms/toaster/toaster';

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'Critical':
      return 'red';
    case 'Moderate':
      return 'yellow';
    case 'Info':
      return 'blue';
    default:
      return 'gray';
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function RuleDetailDrawer(): React.JSX.Element | null {
  const { selectedRule, isDrawerOpen, closeDrawer, updateRule, isLoading } = useRules();
  const [activeTab, setActiveTab] = React.useState('overview');
  const [formData, setFormData] = React.useState<Record<string, any> | null>(null);
  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = React.useState(false);

  React.useEffect(() => {
    if (selectedRule) {
      setFormData({
        ...selectedRule.parameters,
        [EFFECTIVE_DATE_PARAM_KEY]:
          selectedRule.parameters[EFFECTIVE_DATE_PARAM_KEY] ?? '',
      });
      setActiveTab('overview');
    }
  }, [selectedRule]);

  const handleSaveClick = () => {
    setIsSaveConfirmOpen(true);
  };

  const handleSaveConfirm = async () => {
    if (!selectedRule || !formData) return;

    try {
      await updateRule(selectedRule.id, {
        ...selectedRule,
        parameters: formData,
        last_updated: new Date().toISOString().substring(0, 10),
      });
      toaster.success({
        title: 'Rule updated successfully',
        description: `${selectedRule.name} has been updated.`,
        duration: 3000,
      });
      setIsSaveConfirmOpen(false);
      closeDrawer();
    } catch (error) {
      toaster.error({
        title: 'Error updating rule',
        description: 'Failed to update the rule. Please try again.',
      });
      setIsSaveConfirmOpen(false);
    }
  };

  const handleSaveCancel = () => {
    setIsSaveConfirmOpen(false);
  };

  if (!selectedRule) return null;

  return (
    <Drawer.Root open={isDrawerOpen} onOpenChange={(e) => !e.open && closeDrawer()} size="xl">
      <Portal>
        <Drawer.Backdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header
              position="sticky"
              top={0}
              zIndex={10}
              bg="white"
              borderBottomWidth="1px"
              borderColor="gray.200"
            >
              <HStack justify="space-between" align="center">
                <VStack align="start" gap={1}>
                  <HStack gap={2} align="center">
                    <Text fontSize="xl" fontWeight="bold" color="gray.900">
                      {selectedRule.name}
                    </Text>
                    <Badge variant="subtle" colorPalette="gray">
                      {selectedRule.type}
                    </Badge>
                  </HStack>
                  <HStack gap={2} align="center">
                    <Text fontSize="sm" color="gray.600">
                      {selectedRule.description}
                    </Text>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <Box
                          as="span"
                          color="gray.400"
                          _hover={{ color: 'gray.600' }}
                          cursor="help"
                          display="inline-flex"
                          alignItems="center"
                          aria-label="Extended technical notes"
                        >
                          <Info size={14} />
                        </Box>
                      </Tooltip.Trigger>
                      <Portal>
                        <Tooltip.Positioner>
                          <Tooltip.Content
                            maxW="400px"
                            zIndex={2000}
                            bg="gray.900"
                            color="white"
                            px={3}
                            py={2}
                            borderRadius="md"
                            fontSize="sm"
                            boxShadow="lg"
                          >
                            <Tooltip.Arrow />
                            <Text>
                              <strong>Technical Notes:</strong> {selectedRule.description}
                              <br />
                              <br />
                              This rule monitors transaction patterns and triggers alerts based on configured thresholds.
                              Parameters can be adjusted in the Parameters tab.
                            </Text>
                          </Tooltip.Content>
                        </Tooltip.Positioner>
                      </Portal>
                    </Tooltip.Root>
                  </HStack>
                </VStack>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeDrawer}
                  aria-label="Close drawer"
                >
                  <X size={20} />
                </Button>
              </HStack>
            </Drawer.Header>

            <Drawer.Body overflowY="auto" px={6} py={6}>
              <Tabs.Root value={activeTab} onValueChange={(e) => setActiveTab(e.value)}>
                <Tabs.List
                  bg="gray.50"
                  rounded="lg"
                  p={1}
                  mb={6}
                  borderBottomWidth="2px"
                  borderColor="transparent"
                  role="tablist"
                >
                  <Tabs.Trigger
                    value="overview"
                    _focusVisible={{
                      outline: '2px solid',
                      outlineColor: 'blue.500',
                      outlineOffset: '2px',
                    }}
                  >
                    Overview
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="parameters"
                    _focusVisible={{
                      outline: '2px solid',
                      outlineColor: 'blue.500',
                      outlineOffset: '2px',
                    }}
                  >
                    Parameters
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="audit"
                    _focusVisible={{
                      outline: '2px solid',
                      outlineColor: 'blue.500',
                      outlineOffset: '2px',
                    }}
                  >
                    Audit Log
                  </Tabs.Trigger>
                  <Tabs.Indicator />
                </Tabs.List>

                <Tabs.Content value="overview" pt={4}>
                  <VStack align="stretch" gap={6}>
                    <Box>
                      <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={2} textTransform="uppercase">
                        Rule Information
                      </Text>
                      <VStack align="stretch" gap={3}>
                        <HStack justify="space-between">
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">
                            Rule ID:
                          </Text>
                          <Text fontSize="sm" color="gray.900">
                            {selectedRule.id}
                          </Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">
                            Type:
                          </Text>
                          <Badge variant="subtle" colorPalette="gray">
                            {selectedRule.type}
                          </Badge>
                        </HStack>
                        <HStack justify="space-between">
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">
                            Source:
                          </Text>
                          <Text fontSize="sm" color="gray.900">
                            {selectedRule.source}
                          </Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">
                            Status:
                          </Text>
                          <Badge
                            variant="subtle"
                            colorPalette={selectedRule.status ? 'green' : 'gray'}
                          >
                            {selectedRule.status ? 'Active' : 'Inactive'}
                          </Badge>
                        </HStack>
                      </VStack>
                    </Box>

                    <Separator />

                    <Box>
                      <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={2} textTransform="uppercase">
                        Execution Details
                      </Text>
                      <VStack align="stretch" gap={3}>
                        <HStack justify="space-between">
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">
                            Last Execution:
                          </Text>
                          <Text fontSize="sm" color="gray.900">
                            {formatDate(selectedRule.last_execution)}
                          </Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">
                            Last Updated:
                          </Text>
                          <Text fontSize="sm" color="gray.900">
                            {formatDate(selectedRule.last_updated)}
                          </Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">
                            Created By:
                          </Text>
                          <Text fontSize="sm" color="gray.900">
                            {selectedRule.created_by}
                          </Text>
                        </HStack>
                      </VStack>
                    </Box>

                    <Separator />

                    <Box>
                      <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={4} textTransform="uppercase">
                        Threshold Settings
                      </Text>
                      <Box
                        bg="gray.50"
                        p={4}
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor="gray.200"
                      >
                        <HStack justify="space-between" mb={3} px={1}>
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">
                            Effective Date
                          </Text>
                          <Text fontSize="sm" color="gray.900">
                            {selectedRule.parameters[EFFECTIVE_DATE_PARAM_KEY] || '—'}
                          </Text>
                        </HStack>
                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                          {Object.entries(selectedRule.parameters)
                            .filter(([key]) => key !== EFFECTIVE_DATE_PARAM_KEY)
                            .map(([key, value]) => {
                            const displayValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
                            const isThreshold = key.toLowerCase().includes('threshold') || key.toLowerCase().includes('window');
                            
                            return (
                              <Box
                                key={key}
                                bg="white"
                                p={3}
                                borderRadius="md"
                                borderWidth="1px"
                                borderColor="gray.200"
                              >
                                <VStack align="start" gap={1}>
                                  <Text fontSize="xs" fontWeight="semibold" color="gray.500" textTransform="uppercase">
                                    {key.replace(/_/g, ' ')}
                                  </Text>
                                  {isThreshold ? (
                                    <Badge
                                      variant="subtle"
                                      colorPalette="blue"
                                      px={2}
                                      py={1}
                                      borderRadius="md"
                                      fontSize="sm"
                                    >
                                      {displayValue}
                                    </Badge>
                                  ) : (
                                    <Text fontSize="sm" color="gray.900" fontFamily="mono">
                                      {displayValue}
                                    </Text>
                                  )}
                                </VStack>
                              </Box>
                            );
                          })}
                        </SimpleGrid>
                      </Box>
                    </Box>
                  </VStack>
                </Tabs.Content>

                <Tabs.Content value="parameters" pt={4}>
                  <RuleEditForm
                    rule={selectedRule}
                    formData={formData}
                    onFormDataChange={setFormData}
                  />
                </Tabs.Content>

                <Tabs.Content value="audit" pt={4}>
                  <RuleAuditLog ruleId={selectedRule.id} />
                </Tabs.Content>
              </Tabs.Root>
            </Drawer.Body>

            <Drawer.Footer
              position="sticky"
              bottom={0}
              zIndex={10}
              bg="white"
              borderTopWidth="1px"
              borderColor="gray.200"
            >
              <HStack justify="flex-end" w="full" gap={3}>
                <Button variant="outline" onClick={closeDrawer} disabled={isLoading}>
                  Cancel
                </Button>
                <Button
                  colorPalette="blue"
                  onClick={handleSaveClick}
                  disabled={isLoading}
                  aria-label="Save changes"
                >
                  <HStack gap={1}>
                    <Save size={16} />
                    <Text>{isLoading ? 'Saving...' : 'Save'}</Text>
                  </HStack>
                </Button>
              </HStack>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>

      {/* Save Confirmation Dialog */}
      <Dialog.Root open={isSaveConfirmOpen} onOpenChange={(e) => {
        if (!e.open) {
          handleSaveCancel();
        }
      }}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content p={6}>
              <Dialog.Header pb={4}>
                <Dialog.Title>Save Changes</Dialog.Title>
                <Dialog.Description mt={2}>
                  Are you sure you want to save the changes to <strong>{selectedRule?.name}</strong>? This will update the rule parameters and cannot be easily undone.
                </Dialog.Description>
              </Dialog.Header>
              <Dialog.Footer pt={4} gap={3}>
                <Button variant="outline" onClick={handleSaveCancel}>
                  Cancel
                </Button>
                <Button
                  colorPalette="blue"
                  onClick={handleSaveConfirm}
                  loading={isLoading}
                  loadingText="Saving..."
                >
                  Save Changes
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Drawer.Root>
  );
}

