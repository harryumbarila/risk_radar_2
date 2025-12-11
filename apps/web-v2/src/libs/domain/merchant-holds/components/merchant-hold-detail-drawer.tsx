'use client';
import React from 'react';
import {
  Drawer,
  Portal,
  VStack,
  HStack,
  Text,
  Badge,
  Box,
  Button,
  Separator,
  SimpleGrid,
  CloseButton,
  Dialog,
} from '@chakra-ui/react';
import { Unlock, Mail, Clock, User, AlertCircle } from 'lucide-react';
import { MerchantHold, HoldHistoryEntry } from '../types';
import EmailComposerDrawer from './email-composer-drawer';

interface MerchantHoldDetailDrawerProps {
  hold: MerchantHold;
  isOpen: boolean;
  onClose: () => void;
  onReleaseHold: () => void;
}

export default function MerchantHoldDetailDrawer({
  hold,
  isOpen,
  onClose,
  onReleaseHold,
}: MerchantHoldDetailDrawerProps) {
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = React.useState(false);
  const [isReleaseConfirmOpen, setIsReleaseConfirmOpen] = React.useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Generate hold history timeline
  const holdHistory: HoldHistoryEntry[] = React.useMemo(() => {
    const history: HoldHistoryEntry[] = [
      {
        id: '1',
        action: 'placed',
        date: hold.datePlaced,
        performedBy: hold.placedByName,
        performedByType: hold.placedBy,
        reason: hold.reason,
      },
    ];

    if (hold.holdStatus === 'Released' && hold.releasedDate && hold.releasedByName) {
      history.push({
        id: '2',
        action: 'released',
        date: hold.releasedDate,
        performedBy: hold.releasedByName,
        performedByType: hold.releasedBy || 'analyst',
        notes: 'Hold was released',
      });
    }

    // Add mock previous holds if any
    if (hold.id === '2') {
      history.unshift({
        id: '0',
        action: 'placed',
        date: new Date('2025-01-01T08:00:00'),
        performedBy: 'System',
        performedByType: 'system',
        reason: 'R002 - Pattern Match Anomaly',
      });
      history.push({
        id: '0.5',
        action: 'released',
        date: new Date('2025-01-05T12:00:00'),
        performedBy: 'John Doe',
        performedByType: 'analyst',
        notes: 'Previous hold released after review',
      });
    }

    return history.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [hold]);

  const merchantEmail = React.useMemo(() => {
    const merchant = hold.dbaName || 'merchant';
    return merchant.toLowerCase().replace(/\s+/g, '.') + '@example.com';
  }, [hold.dbaName]);

  return (
    <>
      <Drawer.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="end" size="lg">
        <Portal>
          <Drawer.Backdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
          <Drawer.Positioner>
            <Drawer.Content
              width={{ base: '100%', md: '600px' }}
              height="full"
              display="flex"
              flexDirection="column"
              bg="white"
              boxShadow="xl"
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
                      Merchant Hold Details
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {hold.dbaName}
                    </Text>
                  </VStack>
                  <CloseButton onClick={onClose} />
                </HStack>
              </Drawer.Header>

              {/* Body */}
              <Drawer.Body flex={1} overflowY="auto" px={6} py={6}>
                <VStack align="stretch" gap={6}>
                  {/* Hold Status */}
                  <Box
                    p={4}
                    bg={hold.holdStatus === 'Active' ? 'red.50' : 'gray.50'}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={hold.holdStatus === 'Active' ? 'red.200' : 'gray.200'}
                  >
                    <HStack justify="space-between" align="center">
                      <HStack gap={3}>
                        <Box
                          w={3}
                          h={3}
                          borderRadius="full"
                          bg={hold.holdStatus === 'Active' ? 'red.500' : 'gray.400'}
                        />
                        <VStack align="start" gap={0}>
                          <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                            Hold Status
                          </Text>
                          <Badge
                            colorPalette={hold.holdStatus === 'Active' ? 'red' : 'gray'}
                            variant="solid"
                          >
                            {hold.holdStatus}
                          </Badge>
                        </VStack>
                      </HStack>
                      {hold.holdStatus === 'Active' && (
                        <Button
                          colorPalette="red"
                          variant="outline"
                          size="sm"
                          onClick={onReleaseHold}
                          leftIcon={<Unlock size={16} />}
                        >
                          Release Hold
                        </Button>
                      )}
                    </HStack>
                  </Box>

                  {/* Merchant Information */}
                  <VStack align="stretch" gap={3}>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                      Merchant Information
                    </Text>
                    <SimpleGrid columns={2} gap={4}>
                      <VStack align="start" gap={1}>
                        <Text fontSize="xs" color="gray.600">
                          DBA Name
                        </Text>
                        <Text fontSize="sm" fontWeight="medium">
                          {hold.dbaName}
                        </Text>
                      </VStack>
                      <VStack align="start" gap={1}>
                        <Text fontSize="xs" color="gray.600">
                          MID
                        </Text>
                        <Text fontSize="sm" fontFamily="mono">
                          {hold.mid}
                        </Text>
                      </VStack>
                    </SimpleGrid>
                  </VStack>

                  <Separator />

                  {/* Hold Details */}
                  <VStack align="stretch" gap={3}>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                      Hold Details
                    </Text>
                    <SimpleGrid columns={2} gap={4}>
                      <VStack align="start" gap={1}>
                        <Text fontSize="xs" color="gray.600">
                          Hold Type
                        </Text>
                        <Badge
                          colorPalette={hold.holdType === 'Manual' ? 'blue' : 'orange'}
                          variant="subtle"
                        >
                          {hold.holdType}
                        </Badge>
                      </VStack>
                      <VStack align="start" gap={1}>
                        <Text fontSize="xs" color="gray.600">
                          Placed By
                        </Text>
                        <Text fontSize="sm">
                          {hold.placedByName}
                          {hold.placedBy === 'system' && (
                            <Badge ml={2} colorPalette="gray" variant="subtle" fontSize="xs">
                              System
                            </Badge>
                          )}
                        </Text>
                      </VStack>
                      <VStack align="start" gap={1}>
                        <Text fontSize="xs" color="gray.600">
                          Date Placed
                        </Text>
                        <Text fontSize="sm">{formatDate(hold.datePlaced)}</Text>
                      </VStack>
                      {hold.expirationDate && (
                        <VStack align="start" gap={1}>
                          <Text fontSize="xs" color="gray.600">
                            Expiration Date
                          </Text>
                          <Text fontSize="sm">{formatDate(hold.expirationDate)}</Text>
                        </VStack>
                      )}
                    </SimpleGrid>
                    <VStack align="start" gap={1} mt={2}>
                      <Text fontSize="xs" color="gray.600">
                        Reason
                      </Text>
                      <Text fontSize="sm" color="gray.900">
                        {hold.reason}
                      </Text>
                    </VStack>
                  </VStack>

                  <Separator />

                  {/* Hold History Timeline */}
                  <VStack align="stretch" gap={3}>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                      Hold History
                    </Text>
                    <VStack align="stretch" gap={4}>
                      {holdHistory.map((entry, index) => (
                        <Box key={entry.id} position="relative" pl={8}>
                          {index < holdHistory.length - 1 && (
                            <Box
                              position="absolute"
                              left={3}
                              top={6}
                              bottom={-4}
                              w="2px"
                              bg="gray.200"
                            />
                          )}
                          <HStack gap={3} align="start">
                            <Box
                              w={6}
                              h={6}
                              borderRadius="full"
                              bg={
                                entry.action === 'placed'
                                  ? 'red.500'
                                  : entry.action === 'released'
                                  ? 'green.500'
                                  : 'blue.500'
                              }
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              position="relative"
                              zIndex={1}
                            >
                              {entry.action === 'placed' && <AlertCircle size={12} color="white" />}
                              {entry.action === 'released' && <Unlock size={12} color="white" />}
                              {entry.action !== 'placed' && entry.action !== 'released' && (
                                <Clock size={12} color="white" />
                              )}
                            </Box>
                            <VStack align="start" gap={1} flex={1}>
                              <HStack gap={2}>
                                <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                                  {entry.action === 'placed'
                                    ? 'Hold Placed'
                                    : entry.action === 'released'
                                    ? 'Hold Released'
                                    : 'Hold Modified'}
                                </Text>
                                {entry.performedByType === 'system' && (
                                  <Badge colorPalette="gray" variant="subtle" fontSize="xs">
                                    System
                                  </Badge>
                                )}
                              </HStack>
                              <Text fontSize="xs" color="gray.600">
                                {formatDate(entry.date)}
                              </Text>
                              <Text fontSize="xs" color="gray.600">
                                By: {entry.performedBy}
                              </Text>
                              {entry.reason && (
                                <Text fontSize="sm" color="gray.700" mt={1}>
                                  Reason: {entry.reason}
                                </Text>
                              )}
                              {entry.notes && (
                                <Text fontSize="sm" color="gray.700" mt={1}>
                                  {entry.notes}
                                </Text>
                              )}
                            </VStack>
                          </HStack>
                        </Box>
                      ))}
                    </VStack>
                  </VStack>
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
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEmailDrawerOpen(true)}
                    leftIcon={<Mail size={16} />}
                  >
                    Email Merchant
                  </Button>
                  {hold.holdStatus === 'Active' && (
                    <Button
                      colorPalette="red"
                      onClick={() => setIsReleaseConfirmOpen(true)}
                      leftIcon={<Unlock size={16} />}
                    >
                      Release Hold
                    </Button>
                  )}
                </HStack>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>

      {/* Email Composer Drawer */}
      <EmailComposerDrawer
        isOpen={isEmailDrawerOpen}
        onClose={() => setIsEmailDrawerOpen(false)}
        merchantName={hold.dbaName}
        merchantEmail={merchantEmail}
      />

      {/* Release Hold Confirmation Modal */}
      <Dialog.Root open={isReleaseConfirmOpen} onOpenChange={(e) => setIsReleaseConfirmOpen(e.open)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Release Merchant Hold</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>
                Are you sure you want to release the hold for{' '}
                <Text as="span" fontWeight="semibold">
                  {hold.dbaName}
                </Text>
                {' '}(MID: <Text as="span" fontFamily="mono">{hold.mid}</Text>)?
              </Text>
              <Text mt={2} fontSize="sm" color="gray.600">
                This action will mark the hold as released and the merchant will be able to process transactions again.
              </Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Button
                variant="outline"
                onClick={() => setIsReleaseConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button
                colorPalette="green"
                onClick={() => {
                  onReleaseHold();
                  setIsReleaseConfirmOpen(false);
                }}
              >
                Release Hold
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </>
  );
}

