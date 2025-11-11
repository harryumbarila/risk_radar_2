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
  Heading,
} from '@chakra-ui/react';
import {
  MdNotifications,
  MdSettings,
  MdPerson,
  MdLogout,
} from 'react-icons/md';

import { ROUTE_STRUCTURE } from '@/libs/navigation/routes.config';
import { useSidebar } from '../auth-sidebar/sidebar-context';

import {
  ColorModeButton,
  CustomBreadcrumb,
  CustomBreadcrumbPath,
} from '../../molecules';

export default function AuthHeader(): React.JSX.Element {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();
  const sidebarWidth = isCollapsed ? '80px' : '260px';

  const segments = pathname?.split('/').filter(Boolean) || [];

  const paths = segments.reduce(
    (acc, segment, index) => {
      // Get the current route level safely
      const parentLevel =
        index === 0 ? ROUTE_STRUCTURE : acc[index - 1]?.node?.children;

      const node = parentLevel?.[segment];
      if (!node) return acc;

      const label = node.label || segment;
      const href = node.href || '/' + segments.slice(0, index + 1).join('/');

      const children =
        node.children &&
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

      acc.push({
        label,
        href,
        menu: children || [],
        isCurrent: index === segments.length - 1,
        node,
      });

      return acc;
    },
    [] as Array<CustomBreadcrumbPath & { node?: any }>
  );

  // Build breadcrumb paths (skip Dashboard for root path since it's already shown in content)
  const fullPaths = segments.length === 0 
    ? [] // Don't show breadcrumb on root path
    : pathname === '/auto-hold'
    ? [
        {
          label: 'Auto Hold',
          href: '/auto-hold',
          menu: [],
          isCurrent: true,
        },
      ]
    : [
        {
          label: ROUTE_STRUCTURE.dashboard.label,
          href: ROUTE_STRUCTURE.dashboard.href,
          menu: [],
          isCurrent: false,
        },
        ...paths,
      ];

  const router = useRouter();
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
      left={{ base: 0, md: sidebarWidth }}
      right={0}
      zIndex={10}
      borderBottom="1px"
      borderColor="gray.100"
      transition="left 0.3s ease"
    >
      <Flex h="full" align="center" justify="space-between">
        {/* Title or Breadcrumb */}
        {pathname === '/' ? (
          <Heading size="xl" fontWeight="bold" color="gray.900">
            Risk Dashboard
          </Heading>
        ) : pathname === '/auto-hold' ? (
          <Heading size="xl" fontWeight="bold" color="gray.900">
            Auto Hold
          </Heading>
        ) : (
          <HStack gap={2} fontSize="sm" color="gray.fg">
            <CustomBreadcrumb paths={fullPaths} />
          </HStack>
        )}

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
