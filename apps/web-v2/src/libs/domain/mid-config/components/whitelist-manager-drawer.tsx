'use client';

import React from 'react';
import {
  Box,
  Drawer,
  HStack,
  VStack,
  Text,
  Badge,
  Button,
  Tabs,
  Portal,
  Breadcrumb,
} from '@chakra-ui/react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useWhitelistStore } from './useWhitelistStore';
import OverviewTab from './whitelist-tabs/overview-tab';
import ManageWhitelistTab from './whitelist-tabs/manage-whitelist-tab';
import RiskThresholdsTab from './whitelist-tabs/risk-thresholds-tab';
import AuditLogTab from './whitelist-tabs/audit-log-tab';

function getRiskLevelColor(riskLevel: string): string {
  switch (riskLevel) {
    case 'High':
      return 'red';
    case 'Medium':
      return 'amber';
    case 'Low':
      return 'green';
    default:
      return 'gray';
  }
}

export default function WhitelistManagerDrawer(): React.JSX.Element | null {
  const { isDrawerOpen, closeDrawer, currentMID } = useWhitelistStore();
  const [activeTab, setActiveTab] = React.useState('overview');

  React.useEffect(() => {
    if (currentMID) {
      setActiveTab('overview');
    }
  }, [currentMID]);

  if (!currentMID) return null;

  return (
    <Drawer.Root open={isDrawerOpen} onOpenChange={(e) => !e.open && closeDrawer()} size="xl">
      <Portal>
        <Drawer.Backdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <Drawer.Positioner>
          <Drawer.Content
            height="full"
            display="flex"
            flexDirection="column"
            bg="white"
            boxShadow="lg"
            borderRadius="none"
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
              <VStack align="stretch" gap={4}>
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
                      <Breadcrumb.Link as={Link} href="/mid-config">
                        MID Configuration
                      </Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator>/</Breadcrumb.Separator>
                    <Breadcrumb.Item>
                      <Breadcrumb.CurrentLink>{currentMID.mid}</Breadcrumb.CurrentLink>
                    </Breadcrumb.Item>
                  </Breadcrumb.List>
                </Breadcrumb.Root>

                {/* Separator */}
                <Box borderBottomWidth="1px" borderColor="gray.200" />

                {/* MID Details */}
                <HStack justify="space-between" align="center">
                  <VStack align="start" gap={2}>
                    <HStack gap={2} align="center">
                      <Text fontSize="xl" fontWeight="bold" color="gray.900">
                        MID: {currentMID.mid}
                      </Text>
                      <Badge
                        variant="subtle"
                        colorPalette={getRiskLevelColor(currentMID.risk_level)}
                        px={3}
                        py={1}
                        borderRadius="md"
                        bg={
                          currentMID.risk_level === 'High'
                            ? 'red.100'
                            : currentMID.risk_level === 'Medium'
                              ? 'amber.100'
                              : 'emerald.100'
                        }
                        color={
                          currentMID.risk_level === 'High'
                            ? 'red.700'
                            : currentMID.risk_level === 'Medium'
                              ? 'amber.700'
                              : 'emerald.700'
                        }
                      >
                        {currentMID.risk_level}
                      </Badge>
                    </HStack>
                    <Text fontSize="sm" color="gray.600">
                      {currentMID.merchant}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      Processor: {currentMID.processor}
                    </Text>
                  </VStack>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeDrawer}
                    aria-label="Close drawer"
                  >
                    <X size={20} />
                  </Button>
                </HStack>
              </VStack>
            </Drawer.Header>

            {/* Body with Tabs */}
            <Drawer.Body overflowY="auto" px={6} py={4}>
              <Tabs.Root value={activeTab} onValueChange={(e) => setActiveTab(e.value)}>
                <Tabs.List
                  bg="gray.50"
                  rounded="lg"
                  p={1}
                  mb={6}
                  borderBottomWidth="2px"
                  borderColor="transparent"
                  role="tablist"
                >
                  <Tabs.Trigger
                    value="overview"
                    _focusVisible={{
                      outline: '2px solid',
                      outlineColor: 'blue.500',
                      outlineOffset: '2px',
                    }}
                  >
                    Overview
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="manage"
                    _focusVisible={{
                      outline: '2px solid',
                      outlineColor: 'blue.500',
                      outlineOffset: '2px',
                    }}
                  >
                    Manage Whitelist
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="thresholds"
                    _focusVisible={{
                      outline: '2px solid',
                      outlineColor: 'blue.500',
                      outlineOffset: '2px',
                    }}
                  >
                    Risk Thresholds
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="audit"
                    _focusVisible={{
                      outline: '2px solid',
                      outlineColor: 'blue.500',
                      outlineOffset: '2px',
                    }}
                  >
                    Audit Log
                  </Tabs.Trigger>
                  <Tabs.Indicator />
                </Tabs.List>

                <Tabs.Content value="overview" pt={4}>
                  <OverviewTab />
                </Tabs.Content>

                <Tabs.Content value="manage" pt={4}>
                  <ManageWhitelistTab />
                </Tabs.Content>

                <Tabs.Content value="thresholds" pt={4}>
                  <RiskThresholdsTab />
                </Tabs.Content>

                <Tabs.Content value="audit" pt={4}>
                  <AuditLogTab />
                </Tabs.Content>
              </Tabs.Root>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}

