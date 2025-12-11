'use client';
import React from 'react';
import { Table, Text, Badge, HStack, Box, Button, IconButton, Tooltip, Portal, Dialog } from '@chakra-ui/react';
import { Eye, Unlock, MoreVertical, Check, Copy } from 'lucide-react';
import { MerchantHold } from '../types';
import MerchantHoldDetailDrawer from './merchant-hold-detail-drawer';

// MID Cell Component with Copy Functionality
function MIDCell({ mid }: { mid: string }) {
  const [copied, setCopied] = React.useState(false);
  
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    try {
      await navigator.clipboard.writeText(mid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy MID:', err);
    }
  };
  
  return (
    <HStack 
      gap={2} 
      py={0.5}
      cursor="pointer"
      onClick={handleCopy}
      _hover={{ opacity: 0.8 }}
      role="button"
      aria-label={`Copy MID ${mid}`}
    >
      <Text fontSize="sm" fontFamily="mono">
        {mid}
      </Text>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Box
            as="span"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            color={copied ? 'green.600' : 'gray.400'}
            _hover={{ color: copied ? 'green.600' : 'gray.600' }}
            transition="color 0.2s"
          >
            {copied ? (
              <Check size={14} />
            ) : (
              <Copy size={14} />
            )}
          </Box>
        </Tooltip.Trigger>
        <Portal>
          <Tooltip.Positioner>
            <Tooltip.Content
              maxW="200px"
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
              {copied ? 'Copied!' : 'Click to copy MID'}
            </Tooltip.Content>
          </Tooltip.Positioner>
        </Portal>
      </Tooltip.Root>
    </HStack>
  );
}

interface MerchantHoldsTableProps {
  holds: MerchantHold[];
  onReleaseHold: (holdId: string) => void;
}

export default function MerchantHoldsTable({ holds, onReleaseHold }: MerchantHoldsTableProps) {
  const [selectedHold, setSelectedHold] = React.useState<MerchantHold | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = React.useState(false);
  const [holdToRelease, setHoldToRelease] = React.useState<MerchantHold | null>(null);
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

  const handleViewDetails = (hold: MerchantHold) => {
    setSelectedHold(hold);
    setIsDetailDrawerOpen(true);
  };

  const handleReleaseClick = (hold: MerchantHold) => {
    setHoldToRelease(hold);
    setIsReleaseConfirmOpen(true);
  };

  const handleConfirmRelease = () => {
    if (holdToRelease) {
      onReleaseHold(holdToRelease.id);
      setIsReleaseConfirmOpen(false);
      setHoldToRelease(null);
    }
  };

  return (
    <>
      <Table.ScrollArea>
        <Table.Root size="sm" stickyHeader>
          <Table.Header>
            <Table.Row bg="gray.50">
              <Table.ColumnHeader>DBA Name</Table.ColumnHeader>
              <Table.ColumnHeader>MID</Table.ColumnHeader>
              <Table.ColumnHeader>Hold Type</Table.ColumnHeader>
              <Table.ColumnHeader>Reason</Table.ColumnHeader>
              <Table.ColumnHeader>Date Placed on Hold</Table.ColumnHeader>
              <Table.ColumnHeader>Placed By</Table.ColumnHeader>
              <Table.ColumnHeader>Hold Status</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {holds.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={8} textAlign="center" py={8}>
                  <Text color="gray.500">No merchant holds found</Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              holds.map((hold) => (
                <Table.Row key={hold.id}>
                  <Table.Cell>
                    <Text fontSize="sm" fontWeight="semibold">
                      {hold.dbaName}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <MIDCell mid={hold.mid} />
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      colorPalette={hold.holdType === 'Manual' ? 'blue' : 'orange'}
                      variant="subtle"
                    >
                      {hold.holdType}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm" color="gray.700">
                      {hold.reason}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm">{formatDate(hold.datePlaced)}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm">
                      {hold.placedByName}
                      {hold.placedBy === 'system' && (
                        <Badge ml={2} colorPalette="gray" variant="subtle" fontSize="xs">
                          System
                        </Badge>
                      )}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <HStack gap={2}>
                      <Box
                        w={2}
                        h={2}
                        borderRadius="full"
                        bg={hold.holdStatus === 'Active' ? 'red.500' : 'gray.400'}
                      />
                      <Badge
                        colorPalette={hold.holdStatus === 'Active' ? 'red' : 'gray'}
                        variant="subtle"
                      >
                        {hold.holdStatus}
                      </Badge>
                    </HStack>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <HStack gap={2} justify="flex-end">
                      <Tooltip.Root openDelay={300}>
                        <Tooltip.Trigger asChild>
                          <IconButton
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDetails(hold)}
                            aria-label="View Details"
                            suppressHydrationWarning
                          >
                            <Eye size={16} />
                          </IconButton>
                        </Tooltip.Trigger>
                        <Portal>
                          <Tooltip.Positioner>
                            <Tooltip.Content>View Details</Tooltip.Content>
                          </Tooltip.Positioner>
                        </Portal>
                      </Tooltip.Root>
                      {hold.holdStatus === 'Active' && (
                        <Tooltip.Root openDelay={300}>
                          <Tooltip.Trigger asChild>
                            <IconButton
                              size="sm"
                              variant="ghost"
                              colorPalette="red"
                              onClick={() => handleReleaseClick(hold)}
                              aria-label="Release Hold"
                              suppressHydrationWarning
                            >
                              <Unlock size={16} />
                            </IconButton>
                          </Tooltip.Trigger>
                          <Portal>
                            <Tooltip.Positioner>
                              <Tooltip.Content>Release Hold</Tooltip.Content>
                            </Tooltip.Positioner>
                          </Portal>
                        </Tooltip.Root>
                      )}
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      {/* Detail Drawer */}
      {selectedHold && (
        <MerchantHoldDetailDrawer
          hold={selectedHold}
          isOpen={isDetailDrawerOpen}
          onClose={() => {
            setIsDetailDrawerOpen(false);
            setSelectedHold(null);
          }}
          onReleaseHold={() => {
            onReleaseHold(selectedHold.id);
            setIsDetailDrawerOpen(false);
            setSelectedHold(null);
          }}
        />
      )}

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
                  {holdToRelease?.dbaName}
                </Text>
                {' '}(MID: <Text as="span" fontFamily="mono">{holdToRelease?.mid}</Text>)?
              </Text>
              <Text mt={2} fontSize="sm" color="gray.600">
                This action will mark the hold as released and the merchant will be able to process transactions again.
              </Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Button
                variant="outline"
                onClick={() => {
                  setIsReleaseConfirmOpen(false);
                  setHoldToRelease(null);
                }}
              >
                Cancel
              </Button>
              <Button
                colorPalette="green"
                onClick={handleConfirmRelease}
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

