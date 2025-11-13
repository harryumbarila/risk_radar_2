'use client';
import React from 'react';

import { Box, VStack, HStack, Text, Breadcrumb, Button, Input } from '@chakra-ui/react';
import Link from 'next/link';
import { Search } from 'lucide-react';

import { WhitelistProvider } from './components/useWhitelistStore';
import MCCMainTable from './components/mcc-main-table';
import WhitelistManagerDrawer from './components/whitelist-manager-drawer';
import mccWhitelistData from '@/data/mcc-whitelist.json';
import type { MCCWhitelistData } from './components/useWhitelistStore';

export default function SettingsMCCConfig(): React.JSX.Element {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [mccData, setMccData] = React.useState<MCCWhitelistData[]>(mccWhitelistData as MCCWhitelistData[]);

  // Filter MCC data based on search
  const filteredMccData = React.useMemo(() => {
    if (!searchTerm.trim()) {
      return mccData;
    }
    return mccData.filter(
      (mcc) =>
        mcc.mcc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mcc.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [mccData, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by filteredMccData
  };

  return (
    <WhitelistProvider>
      <Box>
        <VStack align="stretch" gap={6}>
          {/* Breadcrumb */}
          <Breadcrumb.Root>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link as={Link} href="/">
                  Dashboard
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator>/</Breadcrumb.Separator>
              <Breadcrumb.Item>
                <Breadcrumb.CurrentLink>MCC Configuration</Breadcrumb.CurrentLink>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>

          {/* Header */}
          <VStack align="start" gap={1}>
            <Text fontSize="2xl" fontWeight="bold" color="gray.900">
              MCC Configuration
            </Text>
            <Text fontSize="sm" color="gray.600">
              Manage whitelist rules for Merchant Category Codes
            </Text>
          </VStack>

          {/* Search Bar */}
          <Box
            bg="white"
            p={4}
            borderRadius="xl"
            borderWidth="1px"
            borderColor="gray.200"
            boxShadow="0 2px 8px rgba(0,0,0,0.05)"
          >
            <HStack
              as="form"
              onSubmit={handleSearch}
              gap={4}
              flexWrap={{ base: 'wrap', md: 'nowrap' }}
              align={{ base: 'stretch', md: 'center' }}
            >
              <Box flex={1} minW={{ base: '100%', md: '300px' }} position="relative">
                <Box
                  position="absolute"
                  left={3}
                  top="50%"
                  transform="translateY(-50%)"
                  zIndex={1}
                  pointerEvents="none"
                  color="gray.400"
                >
                  <Search size={16} />
                </Box>
                <Input
                  placeholder="Search by MCC code or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  pl={10}
                  suppressHydrationWarning
                />
              </Box>
              <Button type="submit" colorPalette="blue" suppressHydrationWarning>
                Search
              </Button>
            </HStack>
          </Box>

          {/* Main Table */}
          <MCCMainTable mccData={filteredMccData} isLoading={false} />

          {/* Whitelist Manager Drawer */}
          <WhitelistManagerDrawer />
        </VStack>
      </Box>
    </WhitelistProvider>
  );
}
