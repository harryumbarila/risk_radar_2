'use client';
import React from 'react';

import { usePathname, useRouter } from 'next/navigation';
// import { useAuth } from '@frontegg/nextjs';

import {
  Box,
  Flex,
  VStack,
  Button,
  Portal,
  HStack,
  IconButton,
  Popover,
} from '@chakra-ui/react';
import {
  MdNotifications,
  MdSettings,
  MdPerson,
  MdLogout,
} from 'react-icons/md';

import { ROUTE_STRUCTURE } from '@/libs/navigation/routes.config';

import { ColorModeButton, CustomBreadcrumb } from '../../molecules';

export default function AuthHeader(): React.JSX.Element {
  const pathname = usePathname();

  const segments = pathname?.split('/').filter(Boolean) || [];

  let currentLevel: any = ROUTE_STRUCTURE;

  // Build breadcrumb items from the current route path
  const paths = segments.map((segment, index) => {
    const node = currentLevel?.[segment];
    const label = node?.label || segment;
    const href = node?.href || '/' + segments.slice(0, index + 1).join('/');

    // For the *current segment*, dropdown should show its children (if any)
    const children =
      node?.children &&
      Object.entries(node.children).map(([key, value]: [string, any]) => ({
        label: value.label || key,
        value: value.label || key,
        href:
          value.href ||
          '/' +
            segments
              .slice(0, index + 1)
              .concat(key)
              .join('/'),
      }));

    // Move deeper in the structure
    currentLevel = node?.children;

    return {
      label,
      href,
      menu: children || [],
      isCurrent: index === segments.length - 1,
    };
  });

  // Always prepend Dashboard (root)
  const fullPaths = [
    {
      label: ROUTE_STRUCTURE.dashboard.label,
      href: ROUTE_STRUCTURE.dashboard.href,
      menu: [],
      isCurrent: segments.length === 0,
    },
    ...paths,
  ];

  const router = useRouter();
  console.log({
    fullPaths,
  });
  // const { user } = useAuth();

  // console.log({ user });

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
          <CustomBreadcrumb paths={fullPaths} />
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
                        {/* <Text>{user?.email}</Text> */}
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
