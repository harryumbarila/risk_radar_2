'use client';
import React from 'react';
import {
  Dialog,
  Portal,
  VStack,
  HStack,
  Text,
  Input,
  Select,
  createListCollection,
  Button,
  Textarea,
  Box,
} from '@chakra-ui/react';
import { PlaceHoldData } from '../types';
import { ALL_TRANSACTIONS } from '@/libs/domain/dashboard/components/transactions/transactions';

interface PlaceHoldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaceHold: (data: PlaceHoldData) => void;
}

export default function PlaceHoldModal({ isOpen, onClose, onPlaceHold }: PlaceHoldModalProps) {
  const [selectedMerchant, setSelectedMerchant] = React.useState<{ mid: string; dbaName: string } | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [reason, setReason] = React.useState('');
  const [expirationDate, setExpirationDate] = React.useState('');
  const [customReason, setCustomReason] = React.useState('');

  // Get unique merchants from transactions
  const availableMerchants = React.useMemo(() => {
    const merchants = new Map<string, { mid: string; dbaName: string }>();
    if (ALL_TRANSACTIONS && Array.isArray(ALL_TRANSACTIONS)) {
      ALL_TRANSACTIONS.forEach(tx => {
        if (tx.mid && tx.dbaName) {
          merchants.set(tx.mid, { mid: tx.mid, dbaName: tx.dbaName });
        }
      });
    }
    return Array.from(merchants.values());
  }, []);

  const filteredMerchants = React.useMemo(() => {
    if (!searchQuery) return availableMerchants.slice(0, 10);
    const query = searchQuery.toLowerCase();
    return availableMerchants
      .filter(m => 
        m.mid.toLowerCase().includes(query) ||
        m.dbaName.toLowerCase().includes(query)
      )
      .slice(0, 10);
  }, [availableMerchants, searchQuery]);

  const reasonCollection = createListCollection({
    items: [
      { label: 'Select Reason', value: '' },
      { label: 'High-risk activity detected', value: 'High-risk activity detected' },
      { label: 'Compliance review required', value: 'Compliance review required' },
      { label: 'Suspicious transaction pattern', value: 'Suspicious transaction pattern' },
      { label: 'Account verification needed', value: 'Account verification needed' },
      { label: 'Manual review requested', value: 'Manual review requested' },
      { label: 'Other (specify below)', value: 'custom' },
    ],
  });

  const handleSubmit = () => {
    if (!selectedMerchant || !reason) return;

    const holdData: PlaceHoldData = {
      mid: selectedMerchant.mid,
      dbaName: selectedMerchant.dbaName,
      reason: reason === 'custom' ? customReason : reason,
      expirationDate: expirationDate ? new Date(expirationDate) : undefined,
    };

    onPlaceHold(holdData);
    // Reset form
    setSelectedMerchant(null);
    setSearchQuery('');
    setReason('');
    setExpirationDate('');
    setCustomReason('');
  };

  const canSubmit = selectedMerchant && reason && (reason !== 'custom' || customReason.trim() !== '');

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="600px">
            <Dialog.Header>
              <Dialog.Title>Put Merchant on Hold</Dialog.Title>
              <Dialog.Description>
                Place a merchant on hold to prevent automated actions. You can specify a reason and optional expiration date.
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Body>
              <VStack align="stretch" gap={4}>
                {/* Merchant Search/Select */}
                <VStack align="start" gap={2}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    Merchant (MID or DBA Name)
                  </Text>
                  <Input
                    placeholder="Search by MID or DBA name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchQuery('')}
                  />
                  {searchQuery && filteredMerchants.length > 0 && (
                    <Box
                      borderWidth="1px"
                      borderColor="gray.200"
                      borderRadius="md"
                      maxH="200px"
                      overflowY="auto"
                      w="full"
                      bg="white"
                    >
                      {filteredMerchants.map((merchant) => (
                        <Box
                          key={merchant.mid}
                          p={3}
                          cursor="pointer"
                          _hover={{ bg: 'gray.50' }}
                          onClick={() => {
                            setSelectedMerchant(merchant);
                            setSearchQuery(merchant.dbaName);
                          }}
                          borderBottomWidth="1px"
                          borderColor="gray.100"
                        >
                          <Text fontSize="sm" fontWeight="semibold">
                            {merchant.dbaName}
                          </Text>
                          <Text fontSize="xs" color="gray.600" fontFamily="mono">
                            {merchant.mid}
                          </Text>
                        </Box>
                      ))}
                    </Box>
                  )}
                  {selectedMerchant && (
                    <Box
                      p={2}
                      bg="blue.50"
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor="blue.200"
                      w="full"
                    >
                      <Text fontSize="sm" fontWeight="semibold">
                        {selectedMerchant.dbaName}
                      </Text>
                      <Text fontSize="xs" color="gray.600" fontFamily="mono">
                        MID: {selectedMerchant.mid}
                      </Text>
                    </Box>
                  )}
                </VStack>

                {/* Reason */}
                <VStack align="start" gap={2}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    Reason
                  </Text>
                  <Select.Root
                    collection={reasonCollection}
                    value={reason ? [reason] : undefined}
                    onValueChange={(e) => setReason(e.value[0] || '')}
                    width="100%"
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select Reason" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Select.Positioner>
                      <Select.Content>
                        {reasonCollection.items.map((item) => (
                          <Select.Item item={item} key={item.value}>
                            {item.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Select.Root>
                  {reason === 'custom' && (
                    <Textarea
                      placeholder="Enter custom reason..."
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      rows={3}
                    />
                  )}
                </VStack>

                {/* Expiration Date (Optional) */}
                <VStack align="start" gap={2}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    Expiration Date (Optional)
                  </Text>
                  <Input
                    type="datetime-local"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    placeholder="Select expiration date"
                  />
                  <Text fontSize="xs" color="gray.500">
                    If not specified, the hold will remain active until manually released.
                  </Text>
                </VStack>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <HStack gap={3} w="full" justify="flex-end">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorPalette="red"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                >
                  Confirm Hold
                </Button>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

