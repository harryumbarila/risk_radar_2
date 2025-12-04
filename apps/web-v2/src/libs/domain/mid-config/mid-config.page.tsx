'use client';
import React from 'react';

import { Box, VStack, HStack, Button, Input, Skeleton } from '@chakra-ui/react';
import { Search } from 'lucide-react';

import MIDMainTable from './components/mid-main-table';
import WhitelistManagerDrawer from './components/whitelist-manager-drawer';
import midWhitelistData from '@/data/mid-whitelist.json';
import type { MIDWhitelistData } from './components/useWhitelistStore';

export default function MIDConfigPage(): React.JSX.Element {
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [midData, setMidData] = React.useState<MIDWhitelistData[]>([]);

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

  // Simulate data loading on mount
  React.useEffect(() => {
    setIsLoading(true);
    // Simulate API call delay
    const timer = setTimeout(() => {
      setMidData(midWhitelistData as MIDWhitelistData[]);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by filteredMidData
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <Box>
        <VStack align="stretch" gap={6}>
          {/* Search Bar skeleton */}
          <Box
            bg="white"
            p={4}
            borderRadius="xl"
            borderWidth="1px"
            borderColor="gray.200"
            boxShadow="0 2px 8px rgba(0,0,0,0.05)"
          >
            <Skeleton height="40px" width="100%" />
          </Box>

          {/* Table skeleton */}
          <VStack align="stretch" gap={2}>
            <Skeleton height="50px" width="100%" />
            {Array(10).fill(0).map((_, i) => (
              <Skeleton key={i} height="60px" width="100%" />
            ))}
          </VStack>
        </VStack>
      </Box>
    );
  }

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

