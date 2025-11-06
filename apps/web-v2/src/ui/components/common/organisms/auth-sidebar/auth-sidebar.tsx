'use client';

import React from 'react';
import Link from 'next/link';

import {
  Box,
  VStack,
  HStack,
  Text,
  Separator,
  Drawer,
  IconButton,
  useDisclosure,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  MdHome,
  MdBarChart,
  MdPerson,
  MdMenu,
  MdAutorenew,
} from 'react-icons/md';

import { AuthSidebarMenuItem } from './auth-sidebar.model';
import { usePathname } from 'next/navigation';

export default function AuthSidebar(): React.JSX.Element {
  const currentPath = usePathname();

  const { open, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const menuItems: AuthSidebarMenuItem[] = [
    { name: 'Dashboard', icon: MdHome, path: '/' },
    { name: 'Auto Hold', icon: MdAutorenew, path: '/auto-hold' },
    { name: 'Settings', icon: MdBarChart, path: '/settings' },
  ];

  const accountItems: AuthSidebarMenuItem[] = [
    { name: 'Profile', icon: MdPerson, path: '/login' },
  ];

  const isActiveRoute = (href: string) => {
    if (typeof href === 'string') {
      if (href === '/') {
        return currentPath === '/';
      }
      return currentPath?.startsWith(href);
    }
    // if (typeof href === 'object') {
    //   return currentPath.includes(href?.pathname?.split('[')?.[0]);
    // }
    return false;
  };

  const SidebarContent = (
    <VStack gap={6} align="stretch" p={6}>
      {/* Logo */}
      <HStack gap={2} mb={4}>
        <Text fontSize="xl" fontWeight="bold" letterSpacing="wider">
          Talus
        </Text>
      </HStack>

      <Separator />

      {/* Main Menu */}
      <VStack gap={2} align="stretch">
        {menuItems.map((item) => (
          <Link key={item.name} href={item.path} onClick={onClose}>
            <HStack
              gap={3}
              p={3}
              borderRadius="lg"
              bg={isActiveRoute(item.path) ? 'brand.500' : 'transparent'}
              color={isActiveRoute(item.path) ? 'white' : 'gray.700'}
              _hover={{
                bg: isActiveRoute(item.path) ? 'brand.400' : 'gray.200',
              }}
              cursor="pointer"
              transition="all 0.2s"
            >
              <item.icon size={20} />
              <Text fontSize="sm" fontWeight="medium">
                {item.name}
              </Text>
            </HStack>
          </Link>
        ))}
      </VStack>

      {/* Account Pages */}
      <Box>
        <Text
          fontSize="xs"
          fontWeight="bold"
          color="gray.400"
          mb={3}
          letterSpacing="wider"
        >
          ACCOUNT PAGES
        </Text>
        <VStack gap={2} align="stretch">
          {accountItems.map((item) => (
            <Link key={item.name} href={item.path} onClick={onClose}>
              <HStack
                gap={3}
                p={3}
                borderRadius="lg"
                bg={isActiveRoute(item.path) ? 'brand.400' : 'transparent'}
                color={isActiveRoute(item.path) ? 'white' : 'gray.700'}
                _hover={{
                  bg: isActiveRoute(item.path) ? 'brand.300' : 'gray.50',
                }}
                cursor="pointer"
                transition="all 0.2s"
              >
                <item.icon size={20} />
                <Text fontSize="sm" fontWeight="medium">
                  {item.name}
                </Text>
              </HStack>
            </Link>
          ))}
        </VStack>
      </Box>
    </VStack>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Box
          w="260px"
          h="100vh"
          bg="white"
          boxShadow="0px 3.5px 5.5px rgba(0, 0, 0, 0.02)"
          position="fixed"
          left={0}
          top={0}
          overflowY="auto"
        >
          {SidebarContent}
        </Box>
      )}

      <Drawer.Root open={open} placement="start" onOpenChange={onClose}>
        {isMobile && (
          <Drawer.Trigger asChild>
            <IconButton
              aria-label="Open menu"
              position="fixed"
              top="20px"
              left="20px"
              zIndex={1000}
              variant="ghost"
              colorScheme="gray"
            >
              <MdMenu />
            </IconButton>
          </Drawer.Trigger>
        )}
        <Drawer.Content>
          <Drawer.ActionTrigger />
          <Drawer.Header>
            <Drawer.Title>Talus</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>{SidebarContent}</Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
}
