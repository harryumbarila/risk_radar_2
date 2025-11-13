'use client';

import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Switch,
  Button,
  Portal,
  Dialog,
  Tooltip,
  Separator,
  SimpleGrid,
} from '@chakra-ui/react';
import { Info } from 'lucide-react';
import { useWhitelistStore, type RiskThresholds } from '../useWhitelistStore';
import { toaster } from '@/ui/components/common/atoms/toaster/toaster';

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function parseCurrency(value: string): number {
  return parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0;
}

export default function RiskThresholdsTab(): React.JSX.Element | null {
  const {
    currentMID,
    tempThresholds,
    setTempThresholds,
    resetTempThresholds,
    hasThresholdChanges,
    saveThresholds,
    isLoading,
    closeDrawer,
  } = useWhitelistStore();

  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = React.useState(false);
  const [inheritFromMCC, setInheritFromMCC] = React.useState(currentMID?.inherit_from_mcc || false);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (currentMID) {
      setInheritFromMCC(currentMID.inherit_from_mcc || false);
      if (!tempThresholds && currentMID.thresholds) {
        setTempThresholds(currentMID.thresholds);
      }
    }
  }, [currentMID, tempThresholds, setTempThresholds]);

  if (!currentMID) return null;

  const originalThresholds = currentMID.thresholds;
  const thresholds = tempThresholds || {
    monthly_volume: 0,
    decline_percent: 0,
    high_ticket: 0,
    transaction_count: 0,
    keyed_percent: 0,
  };

  const getFieldChanged = (field: keyof RiskThresholds): boolean => {
    if (!originalThresholds) return false;
    return originalThresholds[field] !== thresholds[field];
  };

  const handleFieldChange = (field: keyof RiskThresholds, value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    
    // Validation
    const errors: Record<string, string> = { ...fieldErrors };
    if (isNaN(numValue) || numValue < 0) {
      errors[field] = 'Must be a positive number';
    } else {
      delete errors[field];
    }
    setFieldErrors(errors);

    setTempThresholds({
      ...thresholds,
      [field]: numValue,
    });
  };

  const handleCurrencyChange = (field: 'monthly_volume' | 'high_ticket', value: string) => {
    const numValue = parseCurrency(value);
    handleFieldChange(field, numValue);
  };

  const handleSaveClick = () => {
    // Validate all fields
    const hasErrors = Object.keys(fieldErrors).length > 0;
    if (hasErrors) {
      toaster.error({
        title: 'Validation Error',
        description: 'Please fix the errors before saving.',
        duration: 3000,
      });
      return;
    }
    setIsSaveConfirmOpen(true);
  };

  const handleSaveConfirm = async () => {
    if (!currentMID || !tempThresholds) return;

    try {
      await saveThresholds(currentMID.mid, tempThresholds);
      
      // Count changed fields
      const changedFields = Object.keys(thresholds).filter((key) =>
        getFieldChanged(key as keyof RiskThresholds)
      ).length;

      toaster.success({
        title: 'Thresholds updated successfully',
        description: `Thresholds updated for MID ${currentMID.mid} — ${changedFields} ${changedFields === 1 ? 'field' : 'fields'} modified.`,
        duration: 4000,
      });
      setIsSaveConfirmOpen(false);
    } catch (error) {
      toaster.error({
        title: 'Error updating thresholds',
        description: 'Failed to update the thresholds. Please try again.',
      });
      setIsSaveConfirmOpen(false);
    }
  };

  const handleCancel = () => {
    resetTempThresholds();
    closeDrawer();
  };

  const hasValidationErrors = Object.keys(fieldErrors).length > 0;

  return (
    <VStack align="stretch" gap={6}>
      {/* Summary Bar */}
      {currentMID.last_updated_by && (
        <Box
          bg="gray.50"
          p={3}
          borderRadius="md"
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Text fontSize="xs" color="gray.600">
            Last updated on{' '}
            <Text as="span" fontWeight="semibold">
              {formatDate(currentMID.last_updated)}
            </Text>{' '}
            by{' '}
            <Text as="span" fontWeight="semibold">
              {currentMID.last_updated_by}
            </Text>
          </Text>
        </Box>
      )}

      {/* Inherit from MCC Toggle */}
      <Box
        bg="white"
        p={4}
        borderRadius="xl"
        borderWidth="1px"
        borderColor="gray.200"
        boxShadow="0 2px 8px rgba(0,0,0,0.05)"
      >
        <HStack justify="space-between" align="center">
          <VStack align="start" gap={1}>
            <Text fontSize="sm" fontWeight="semibold" color="gray.900">
              Inherit defaults from MCC
            </Text>
            <Text fontSize="xs" color="gray.500">
              Use default thresholds from the merchant's MCC category
            </Text>
          </VStack>
          <Switch.Root
            checked={inheritFromMCC}
            onCheckedChange={(e) => setInheritFromMCC(e.checked)}
            colorPalette="blue"
          >
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch.Root>
        </HStack>
      </Box>

      {/* Thresholds Form */}
      <Box
        bg="white"
        p={6}
        borderRadius="xl"
        borderWidth="1px"
        borderColor="gray.200"
        boxShadow="0 2px 8px rgba(0,0,0,0.05)"
      >
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
          {/* Monthly Volume */}
          <VStack align="stretch" gap={2}>
            <HStack gap={2} align="center">
              <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                Monthly Volume
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
                    aria-label="Monthly volume information"
                  >
                    <Info size={14} />
                  </Box>
                </Tooltip.Trigger>
                <Portal>
                  <Tooltip.Positioner>
                    <Tooltip.Content
                      maxW="300px"
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
                      Maximum allowed monthly volume before triggering review.
                    </Tooltip.Content>
                  </Tooltip.Positioner>
                </Portal>
              </Tooltip.Root>
            </HStack>
            <Input
              type="text"
              value={formatCurrency(thresholds.monthly_volume)}
              onChange={(e) => handleCurrencyChange('monthly_volume', e.target.value)}
              placeholder="$0.00"
              bg={getFieldChanged('monthly_volume') ? 'blue.50' : 'white'}
              borderColor={fieldErrors.monthly_volume ? 'red.300' : 'gray.300'}
              _focus={{
                borderColor: fieldErrors.monthly_volume ? 'red.500' : 'blue.500',
                boxShadow: fieldErrors.monthly_volume ? '0 0 0 1px red.500' : '0 0 0 1px blue.500',
              }}
              suppressHydrationWarning
            />
            {fieldErrors.monthly_volume && (
              <Text fontSize="xs" color="red.600">
                {fieldErrors.monthly_volume}
              </Text>
            )}
          </VStack>

          {/* Decline % */}
          <VStack align="stretch" gap={2}>
            <HStack gap={2} align="center">
              <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                Decline %
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
                    aria-label="Decline percent information"
                  >
                    <Info size={14} />
                  </Box>
                </Tooltip.Trigger>
                <Portal>
                  <Tooltip.Positioner>
                    <Tooltip.Content
                      maxW="300px"
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
                      Maximum decline percentage before triggering review.
                    </Tooltip.Content>
                  </Tooltip.Positioner>
                </Portal>
              </Tooltip.Root>
            </HStack>
            <Input
              type="number"
              value={thresholds.decline_percent}
              onChange={(e) => handleFieldChange('decline_percent', e.target.value)}
              placeholder="0"
              min={0}
              max={100}
              step={0.1}
              bg={getFieldChanged('decline_percent') ? 'blue.50' : 'white'}
              borderColor={fieldErrors.decline_percent ? 'red.300' : 'gray.300'}
              _focus={{
                borderColor: fieldErrors.decline_percent ? 'red.500' : 'blue.500',
                boxShadow: fieldErrors.decline_percent ? '0 0 0 1px red.500' : '0 0 0 1px blue.500',
              }}
              suppressHydrationWarning
            />
            {fieldErrors.decline_percent && (
              <Text fontSize="xs" color="red.600">
                {fieldErrors.decline_percent}
              </Text>
            )}
          </VStack>

          {/* High Ticket */}
          <VStack align="stretch" gap={2}>
            <HStack gap={2} align="center">
              <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                High Ticket
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
                    aria-label="High ticket information"
                  >
                    <Info size={14} />
                  </Box>
                </Tooltip.Trigger>
                <Portal>
                  <Tooltip.Positioner>
                    <Tooltip.Content
                      maxW="300px"
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
                      Maximum transaction amount before triggering review.
                    </Tooltip.Content>
                  </Tooltip.Positioner>
                </Portal>
              </Tooltip.Root>
            </HStack>
            <Input
              type="text"
              value={formatCurrency(thresholds.high_ticket)}
              onChange={(e) => handleCurrencyChange('high_ticket', e.target.value)}
              placeholder="$0.00"
              bg={getFieldChanged('high_ticket') ? 'blue.50' : 'white'}
              borderColor={fieldErrors.high_ticket ? 'red.300' : 'gray.300'}
              _focus={{
                borderColor: fieldErrors.high_ticket ? 'red.500' : 'blue.500',
                boxShadow: fieldErrors.high_ticket ? '0 0 0 1px red.500' : '0 0 0 1px blue.500',
              }}
              suppressHydrationWarning
            />
            {fieldErrors.high_ticket && (
              <Text fontSize="xs" color="red.600">
                {fieldErrors.high_ticket}
              </Text>
            )}
          </VStack>

          {/* Transaction Count */}
          <VStack align="stretch" gap={2}>
            <HStack gap={2} align="center">
              <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                Transaction Count
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
                    aria-label="Transaction count information"
                  >
                    <Info size={14} />
                  </Box>
                </Tooltip.Trigger>
                <Portal>
                  <Tooltip.Positioner>
                    <Tooltip.Content
                      maxW="300px"
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
                      Maximum number of transactions before triggering review.
                    </Tooltip.Content>
                  </Tooltip.Positioner>
                </Portal>
              </Tooltip.Root>
            </HStack>
            <Input
              type="number"
              value={thresholds.transaction_count}
              onChange={(e) => handleFieldChange('transaction_count', e.target.value)}
              placeholder="0"
              min={0}
              step={1}
              bg={getFieldChanged('transaction_count') ? 'blue.50' : 'white'}
              borderColor={fieldErrors.transaction_count ? 'red.300' : 'gray.300'}
              _focus={{
                borderColor: fieldErrors.transaction_count ? 'red.500' : 'blue.500',
                boxShadow: fieldErrors.transaction_count ? '0 0 0 1px red.500' : '0 0 0 1px blue.500',
              }}
              suppressHydrationWarning
            />
            {fieldErrors.transaction_count && (
              <Text fontSize="xs" color="red.600">
                {fieldErrors.transaction_count}
              </Text>
            )}
          </VStack>

          {/* Keyed % */}
          <VStack align="stretch" gap={2}>
            <HStack gap={2} align="center">
              <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                Keyed %
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
                    aria-label="Keyed percent information"
                  >
                    <Info size={14} />
                  </Box>
                </Tooltip.Trigger>
                <Portal>
                  <Tooltip.Positioner>
                    <Tooltip.Content
                      maxW="300px"
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
                      Maximum percentage of keyed transactions before triggering review.
                    </Tooltip.Content>
                  </Tooltip.Positioner>
                </Portal>
              </Tooltip.Root>
            </HStack>
            <Input
              type="number"
              value={thresholds.keyed_percent}
              onChange={(e) => handleFieldChange('keyed_percent', e.target.value)}
              placeholder="0"
              min={0}
              max={100}
              step={0.1}
              bg={getFieldChanged('keyed_percent') ? 'blue.50' : 'white'}
              borderColor={fieldErrors.keyed_percent ? 'red.300' : 'gray.300'}
              _focus={{
                borderColor: fieldErrors.keyed_percent ? 'red.500' : 'blue.500',
                boxShadow: fieldErrors.keyed_percent ? '0 0 0 1px red.500' : '0 0 0 1px blue.500',
              }}
              suppressHydrationWarning
            />
            {fieldErrors.keyed_percent && (
              <Text fontSize="xs" color="red.600">
                {fieldErrors.keyed_percent}
              </Text>
            )}
          </VStack>
        </SimpleGrid>
      </Box>

      {/* Sticky Footer */}
      <Box
        position="sticky"
        bottom={-6}
        left={-6}
        right={-6}
        bg="white"
        p={4}
        borderTopWidth="1px"
        borderColor="gray.200"
        boxShadow="0 -2px 8px rgba(0,0,0,0.05)"
        zIndex={10}
        mt={6}
      >
        <HStack justify="flex-end" gap={3}>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            colorPalette="blue"
            onClick={handleSaveClick}
            loading={isLoading}
            disabled={isLoading || !hasThresholdChanges || hasValidationErrors}
          >
            Save Changes
          </Button>
        </HStack>
      </Box>

      {/* Save Confirmation Dialog */}
      <Dialog.Root
        open={isSaveConfirmOpen}
        onOpenChange={(e) => {
          if (!e.open) {
            setIsSaveConfirmOpen(false);
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content p={6}>
              <Dialog.Header pb={4}>
                <Dialog.Title>Confirm Threshold Update</Dialog.Title>
                <Dialog.Description mt={2}>
                  You're about to update risk thresholds for MID <strong>{currentMID.mid}</strong> — proceed?
                </Dialog.Description>
              </Dialog.Header>
              <Dialog.Footer pt={4} gap={3}>
                <Button variant="outline" onClick={() => setIsSaveConfirmOpen(false)}>
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
    </VStack>
  );
}

