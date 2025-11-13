'use client';

import React from 'react';
import {
  Box,
  Drawer,
  HStack,
  VStack,
  Text,
  Badge,
  Input,
  Button,
  Portal,
  Separator,
  SimpleGrid,
} from '@chakra-ui/react';
import { X, Search } from 'lucide-react';
import riskRulesData from '@/data/risk-rules.json';
import type { RiskRule } from '@/libs/domain/risk-rules/context/rules-context';

interface RulesWikiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  lastUpdated?: string;
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'Critical':
      return 'red';
    case 'Moderate':
      return 'amber';
    case 'Info':
      return 'blue';
    default:
      return 'gray';
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function RulesWikiDrawer({
  isOpen,
  onClose,
  title = 'Risk Rules Reference',
  lastUpdated,
}: RulesWikiDrawerProps): React.JSX.Element {
  const [searchValue, setSearchValue] = React.useState('');
  const rules = riskRulesData as unknown as RiskRule[];

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  // Filter rules
  const filteredRules = React.useMemo(() => {
    if (!debouncedSearch.trim()) {
      return rules;
    }
    const searchLower = debouncedSearch.toLowerCase();
    return rules.filter(
      (rule) =>
        rule.name.toLowerCase().includes(searchLower) ||
        rule.id.toLowerCase().includes(searchLower) ||
        rule.type.toLowerCase().includes(searchLower) ||
        rule.description.toLowerCase().includes(searchLower)
    );
  }, [rules, debouncedSearch]);


  return (
    <Drawer.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="end">
      <Portal>
        <Drawer.Backdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <Drawer.Positioner>
          <Drawer.Content
            width={{ base: '100%', md: '1600px' }}
            maxW={{ base: '100%', md: '90vw' }}
            height="full"
            display="flex"
            flexDirection="column"
            bg="white"
            boxShadow="0px 4px 16px rgba(0,0,0,0.15)"
          >
            {/* Sticky Header */}
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
                <Text fontSize="lg" fontWeight="semibold" color="gray.900">
                  {title}
                </Text>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  aria-label="Close drawer"
                >
                  <X size={20} />
                </Button>
              </HStack>
            </Drawer.Header>

            {/* Search Bar */}
            <Box px={6} py={4} borderBottomWidth="1px" borderColor="gray.200" bg="white">
              <Box position="relative">
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
                  placeholder="Search rules by name, type, or description..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  pl={10}
                  suppressHydrationWarning
                />
              </Box>
              {filteredRules.length > 0 && (
                <Text fontSize="xs" color="gray.600" mt={2}>
                  {filteredRules.length} {filteredRules.length === 1 ? 'rule' : 'rules'} found
                </Text>
              )}
            </Box>

            {/* Scrollable Content */}
            <Drawer.Body overflowY="auto" px={6} py={4}>
              {filteredRules.length === 0 ? (
                <Box
                  bg="gray.50"
                  p={8}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="gray.200"
                  textAlign="center"
                >
                  <Text fontSize="sm" color="gray.500">
                    No rules found matching your search.
                  </Text>
                </Box>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                  {filteredRules.map((rule) => (
                    <Box
                      key={rule.id}
                      bg="white"
                      p={4}
                      borderRadius="lg"
                      borderWidth="1px"
                      borderColor="gray.200"
                      boxShadow="0 1px 3px rgba(0,0,0,0.05)"
                      _hover={{
                        borderColor: 'gray.300',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                      }}
                      transition="all 0.15s ease-in-out"
                    >
                      <VStack align="stretch" gap={3}>
                        {/* Rule Header */}
                        <HStack justify="space-between" align="start">
                          <VStack align="start" gap={1} flex={1}>
                            <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                              {rule.name}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {rule.id}
                            </Text>
                          </VStack>
                          <Badge
                            variant="subtle"
                            colorPalette={getSeverityColor(rule.severity)}
                            px={3}
                            py={1}
                            borderRadius="md"
                            bg={
                              rule.severity === 'Critical'
                                ? 'red.100'
                                : rule.severity === 'Moderate'
                                  ? 'amber.100'
                                  : 'blue.100'
                            }
                            color={
                              rule.severity === 'Critical'
                                ? 'red.700'
                                : rule.severity === 'Moderate'
                                  ? 'amber.700'
                                  : 'blue.700'
                            }
                          >
                            {rule.severity}
                          </Badge>
                        </HStack>

                        {/* Rule Meta */}
                        <HStack gap={2} flexWrap="wrap">
                          <Badge variant="subtle" colorPalette="gray" fontSize="xs">
                            {rule.type}
                          </Badge>
                          <Badge variant="subtle" colorPalette="gray" fontSize="xs">
                            {rule.source}
                          </Badge>
                        </HStack>

                        {/* Description */}
                        <Text
                          fontSize="sm"
                          color="gray.700"
                          lineHeight="1.5"
                          noOfLines={3}
                          css={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {rule.description}
                        </Text>
                      </VStack>
                    </Box>
                  ))}
                </SimpleGrid>
              )}
            </Drawer.Body>

            {/* Footer */}
            {lastUpdated && (
              <Box
                px={6}
                py={3}
                borderTopWidth="1px"
                borderColor="gray.200"
                bg="gray.50"
              >
                <Text fontSize="xs" color="gray.600" textAlign="center">
                  Last updated: {formatDate(lastUpdated)}
                </Text>
              </Box>
            )}
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}

