'use client';

import React from 'react';
import {
  Box,
  VStack,
  Text,
  Table,
  Badge,
  Checkbox,
  Button,
  Portal,
  Dialog,
} from '@chakra-ui/react';
import { useWhitelistStore } from '../useWhitelistStore';
import { toaster } from '@/ui/components/common/atoms/toaster/toaster';

type BankAccount = {
  routing_number: string;
  account_number: string;
  account_type: 'Credit' | 'Debit';
  bank_change_white_label?: boolean;
};

/** Default mock accounts when MID has none (for demo). */
const DEFAULT_BANK_ACCOUNTS: BankAccount[] = [
  { routing_number: '021000021', account_number: '••••4521', account_type: 'Debit', bank_change_white_label: false },
  { routing_number: '011401533', account_number: '••••7803', account_type: 'Credit', bank_change_white_label: false },
];

export default function RoutingBankingTab(): React.JSX.Element | null {
  const { currentMID, setBankAccounts } = useWhitelistStore();
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [accountToToggle, setAccountToToggle] = React.useState<{
    index: number;
    routing_number: string;
    account_type: string;
    willWhitelist: boolean;
  } | null>(null);

  if (!currentMID) return null;

  const accounts: BankAccount[] =
    currentMID.bank_accounts?.length
      ? currentMID.bank_accounts.map((a) => ({
          ...a,
          bank_change_white_label: a.bank_change_white_label ?? false,
        }))
      : DEFAULT_BANK_ACCOUNTS;

  const handleWhitelistClick = (index: number, currentlyWhitelisted: boolean) => {
    setAccountToToggle({
      index,
      routing_number: accounts[index].routing_number,
      account_type: accounts[index].account_type,
      willWhitelist: !currentlyWhitelisted,
    });
    setIsConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (accountToToggle == null) return;
    const { index, willWhitelist } = accountToToggle;
    const next = accounts.map((acc, i) =>
      i === index ? { ...acc, bank_change_white_label: willWhitelist } : acc
    );
    setBankAccounts(currentMID.mid, next);
    toaster.success({
      title: willWhitelist ? 'Account added to whitelist' : 'Account removed from whitelist',
      description: `Account ${accountToToggle.routing_number} (${accountToToggle.account_type}). AH001 will ${willWhitelist ? 'not' : ''} trigger on bank change for this account. Action is audit logged.`,
      duration: 3000,
    });
    setIsConfirmOpen(false);
    setAccountToToggle(null);
  };

  const handleCancel = () => {
    setIsConfirmOpen(false);
    setAccountToToggle(null);
  };

  return (
    <VStack align="stretch" gap={6}>
      <Box
        bg="white"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="gray.200"
        overflowX="auto"
      >
        <Table.Root size="sm">
          <Table.Header>
            <Table.Row bg="gray.50">
              <Table.ColumnHeader>Routing number</Table.ColumnHeader>
              <Table.ColumnHeader>Account number</Table.ColumnHeader>
              <Table.ColumnHeader>Type</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Whitelist</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {accounts.map((account, index) => {
              const isWhitelisted = account.bank_change_white_label ?? false;
              return (
                <Table.Row key={index}>
                  <Table.Cell fontFamily="mono" fontSize="sm">
                    {account.routing_number}
                  </Table.Cell>
                  <Table.Cell fontFamily="mono" fontSize="sm">
                    {account.account_number}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant="subtle" colorPalette="blue" size="sm">
                      {account.account_type}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <Box
                      as="button"
                      type="button"
                      onClick={() => handleWhitelistClick(index, isWhitelisted)}
                      cursor="pointer"
                      transition="transform 0.2s ease-in-out"
                      _hover={{ transform: 'scale(1.05)' }}
                      _active={{ transform: 'scale(0.95)' }}
                      aria-label={isWhitelisted ? 'Remove from whitelist' : 'Add to whitelist'}
                      display="inline-flex"
                    >
                      <Checkbox.Root
                        checked={isWhitelisted}
                        readOnly
                        pointerEvents="none"
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                      </Checkbox.Root>
                    </Box>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
        {accounts.length === 0 && (
          <Box py={8} textAlign="center">
            <Text fontSize="sm" color="gray.500">
              No accounts associated with this merchant.
            </Text>
          </Box>
        )}
      </Box>

      <Dialog.Root
        open={isConfirmOpen}
        onOpenChange={(e) => {
          if (!e.open) handleCancel();
        }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content p={6}>
              <Dialog.Header pb={4}>
                <Dialog.Title>
                  {accountToToggle?.willWhitelist ? 'Add to whitelist' : 'Remove from whitelist'}
                </Dialog.Title>
                <Dialog.Description mt={2}>
                  {accountToToggle?.willWhitelist ? (
                    <>
                      You're about to <strong>add</strong> this account (routing{' '}
                      <strong>{accountToToggle?.routing_number}</strong>, {accountToToggle?.account_type}) to the bank
                      change whitelist for MID <strong>{currentMID.mid}</strong>. AH001 will not trigger on bank
                      change for this account. Proceed?
                    </>
                  ) : (
                    <>
                      You're about to <strong>remove</strong> this account (routing{' '}
                      <strong>{accountToToggle?.routing_number}</strong>, {accountToToggle?.account_type}) from the
                      bank change whitelist for MID <strong>{currentMID.mid}</strong>. AH001 will trigger on bank
                      change for this account again. Proceed?
                    </>
                  )}
                </Dialog.Description>
              </Dialog.Header>
              <Dialog.Footer pt={4} gap={3}>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  colorPalette={accountToToggle?.willWhitelist ? 'green' : 'red'}
                  onClick={handleConfirm}
                >
                  {accountToToggle?.willWhitelist ? 'Add to whitelist' : 'Remove from whitelist'}
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </VStack>
  );
}
