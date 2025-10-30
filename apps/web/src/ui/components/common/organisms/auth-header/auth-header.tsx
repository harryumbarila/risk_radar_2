'use client';
import React from 'react';

import { useRouter } from 'next/navigation';
import { useAuth } from '@frontegg/nextjs';

import {
  Box,
  Flex,
  VStack,
  Button,
  Portal,
  HStack,
  Text,
  IconButton,
  Popover,
} from '@chakra-ui/react';
import {
  MdNotifications,
  MdSettings,
  MdPerson,
  MdLogout,
} from 'react-icons/md';

import { ColorModeButton } from '../../molecules';

export default function AuthHeader(): React.JSX.Element {
  const router = useRouter();
  const { user } = useAuth();

  const handleSignOut = React.useCallback(() => {
    router.replace('/account/logout');
  }, [router]);

  return (
    <Box
      bg="bg"
      h="70px"
      px={8}
      position="fixed"
      top={0}
      left="260px"
      right={0}
      zIndex={10}
      borderBottom="1px"
      borderColor="gray.100"
    >
      <Flex h="full" align="center" justify="space-between">
        {/* Breadcrumb */}
        <HStack gap={2} fontSize="sm" color="gray.fg">
          <Text>Pages</Text>
          <Text>/</Text>
          <Text fontWeight="bold" color="gray.fg">
            Dashboard
          </Text>
        </HStack>

        {/* Right Side */}
        <HStack gap={4}>
          <HStack gap={3}>
            <IconButton
              aria-label="Notifications"
              variant="ghost"
              color="gray.fg"
            >
              <MdNotifications size={20} />
            </IconButton>
            <ColorModeButton />
            <Popover.Root>
              <Popover.Trigger asChild>
                <IconButton
                  aria-label="Settings"
                  variant="ghost"
                  color="gray.fg"
                >
                  <MdSettings size={20} />
                </IconButton>
              </Popover.Trigger>
              <Portal>
                <Popover.Positioner>
                  <Popover.Content>
                    <Popover.Arrow />
                    <Popover.Body>
                      <Popover.Title fontWeight="medium">
                        Settings
                      </Popover.Title>

                      <VStack align="stretch" gap={2} divideX="2px">
                        <Text>{user?.email}</Text>
                        <Button
                          variant="ghost"
                          justifyContent="flex-start"
                          onClick={() => console.log('Go to Profile')}
                        >
                          <MdPerson />
                          Profile
                        </Button>

                        <Button
                          variant="plain"
                          color="red"
                          onClick={handleSignOut}
                        >
                          <MdLogout />
                          Logout
                        </Button>
                      </VStack>
                    </Popover.Body>
                  </Popover.Content>
                </Popover.Positioner>
              </Portal>
            </Popover.Root>
          </HStack>
        </HStack>
      </Flex>
    </Box>
  );
}
