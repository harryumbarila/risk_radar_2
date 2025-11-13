'use client';
import React from 'react';

import { Box, VStack, HStack, Button, Input } from '@chakra-ui/react';
import { Search } from 'lucide-react';

import MIDMainTable from './components/mid-main-table';
import WhitelistManagerDrawer from './components/whitelist-manager-drawer';
import midWhitelistData from '@/data/mid-whitelist.json';
import type { MIDWhitelistData } from './components/useWhitelistStore';

export default function MIDConfigPage(): React.JSX.Element {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [midData, setMidData] = React.useState<MIDWhitelistData[]>(midWhitelistData as MIDWhitelistData[]);

  // Filter MID data based on search
  const filteredMidData = React.useMemo(() => {
    if (!searchTerm.trim()) {
      return midData;
    }
    return midData.filter(
      (mid) =>
        mid.mid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mid.merchant.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [midData, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by filteredMidData
  };

  return (
    <Box>
      <VStack align="stretch" gap={6}>
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
                  placeholder="Search by MID or merchant name…"
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
          <MIDMainTable midData={filteredMidData} isLoading={false} />

          {/* Whitelist Manager Drawer */}
          <WhitelistManagerDrawer />
        </VStack>
      </Box>
  );
}

