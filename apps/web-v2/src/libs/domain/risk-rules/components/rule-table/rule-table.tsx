'use client';

import React from 'react';
import {
  Box,
  Table,
  HStack,
  VStack,
  Text,
  Badge,
  Switch,
  Button,
  Skeleton,
  useBreakpointValue,
  Dialog,
  Portal,
} from '@chakra-ui/react';
import { Eye } from 'lucide-react';
import { useRules, type RiskRule } from '../../context/rules-context';
import { toaster } from '@/ui/components/common/atoms/toaster/toaster';
import RuleCard from '../rule-card/rule-card';

function getSeverityColor(severity: RiskRule['severity']): string {
  switch (severity) {
    case 'Critical':
      return 'red';
    case 'Moderate':
      return 'yellow';
    case 'Info':
      return 'blue';
    default:
      return 'gray';
  }
}

// Color tokens matching Auto Hold module
const severityColors = {
  Critical: { bg: 'red.50', text: 'red.700', badge: 'red' },
  Moderate: { bg: 'yellow.50', text: 'yellow.700', badge: 'yellow' },
  Info: { bg: 'blue.50', text: 'blue.700', badge: 'blue' },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function RuleTable(): React.JSX.Element {
  const { filteredRules, isLoading, toggleRuleStatus, openDrawer } = useRules();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [ruleToToggle, setRuleToToggle] = React.useState<RiskRule | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

  const handleToggleClick = (rule: RiskRule) => {
    setRuleToToggle(rule);
    setIsConfirmOpen(true);
  };

  const handleConfirmToggle = async () => {
    if (!ruleToToggle) return;

    const wasActive = ruleToToggle.status;
    await toggleRuleStatus(ruleToToggle.id);
    toaster.create({
      title: wasActive ? 'Rule deactivated' : 'Rule activated',
      description: `${ruleToToggle.name} has been ${wasActive ? 'deactivated' : 'activated'}.`,
      status: 'success',
      duration: 3000,
    });
    setIsConfirmOpen(false);
    setRuleToToggle(null);
  };

  const handleCancelToggle = () => {
    setIsConfirmOpen(false);
    setRuleToToggle(null);
  };

  const handleViewRule = (rule: RiskRule) => {
    openDrawer(rule);
  };

  if (isLoading) {
    return (
      <VStack align="stretch" gap={4}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height="80px" borderRadius="lg" />
        ))}
      </VStack>
    );
  }

  if (filteredRules.length === 0) {
    return (
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        borderWidth="1px"
        borderColor="gray.200"
        textAlign="center"
      >
        <Text fontSize="lg" color="gray.500">
          No rules found matching your filters.
        </Text>
      </Box>
    );
  }

  // Mobile: Show cards
  if (isMobile) {
    return (
      <>
        <VStack align="stretch" gap={4}>
          {filteredRules.map((rule) => (
            <RuleCard key={rule.id} rule={rule} onView={handleViewRule} onToggle={handleToggleClick} />
          ))}
        </VStack>

        {/* Confirmation Dialog */}
        <Dialog.Root open={isConfirmOpen} onOpenChange={(e) => {
          if (!e.open) {
            handleCancelToggle();
          }
        }}>
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content p={6}>
                <Dialog.Header pb={4}>
                  <Dialog.Title>
                    {ruleToToggle?.status ? 'Deactivate Rule' : 'Activate Rule'}
                  </Dialog.Title>
                  <Dialog.Description mt={2}>
                    Are you sure you want to {ruleToToggle?.status ? 'deactivate' : 'activate'} the rule{' '}
                    <strong>{ruleToToggle?.name}</strong>? This will{' '}
                    {ruleToToggle?.status
                      ? 'prevent it from triggering alerts and auto-hold actions.'
                      : 'enable it to trigger alerts and auto-hold actions based on its parameters.'}
                  </Dialog.Description>
                </Dialog.Header>
                <Dialog.Footer pt={4} gap={3}>
                  <Button variant="outline" onClick={handleCancelToggle}>
                    Cancel
                  </Button>
                  <Button
                    colorPalette={ruleToToggle?.status ? 'red' : 'blue'}
                    onClick={handleConfirmToggle}
                    isLoading={isLoading}
                    loadingText={ruleToToggle?.status ? 'Deactivating...' : 'Activating...'}
                  >
                    {ruleToToggle?.status ? 'Deactivate' : 'Activate'}
                  </Button>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </>
    );
  }

  // Desktop: Show table
  return (
    <Box
      bg="white"
      borderRadius="xl"
      borderWidth="1px"
      borderColor="gray.200"
      boxShadow="0 2px 8px rgba(0,0,0,0.05)"
      overflowX="auto"
    >
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Rule</Table.ColumnHeader>
            <Table.ColumnHeader>Type</Table.ColumnHeader>
            <Table.ColumnHeader>Source</Table.ColumnHeader>
            <Table.ColumnHeader>Severity</Table.ColumnHeader>
            <Table.ColumnHeader>Status</Table.ColumnHeader>
            <Table.ColumnHeader>Last Updated</Table.ColumnHeader>
            <Table.ColumnHeader>Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredRules.map((rule) => (
            <Table.Row
              key={rule.id}
              _hover={{
                bg: 'gray.50',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
              transition="all 0.15s ease-in-out"
              cursor="pointer"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleViewRule(rule);
                }
              }}
              _focusVisible={{
                outline: '2px solid',
                outlineColor: 'blue.500',
                outlineOffset: '2px',
              }}
            >
              <Table.Cell>
                <VStack align="start" gap={1}>
                  <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                    {rule.name}
                  </Text>
                  <Text fontSize="xs" color="gray.500" noOfLines={1}>
                    {rule.description}
                  </Text>
                </VStack>
              </Table.Cell>
              <Table.Cell>
                <Badge variant="subtle" colorPalette="gray">
                  {rule.type}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm" color="gray.700">
                  {rule.source}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Badge
                  variant="subtle"
                  colorPalette={getSeverityColor(rule.severity)}
                  px={3}
                  py={1}
                  borderRadius="md"
                >
                  {rule.severity}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Box
                  as="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleToggleClick(rule);
                  }}
                  aria-label={`Toggle ${rule.name} status`}
                  cursor="pointer"
                  display="inline-flex"
                  alignItems="center"
                  p={1}
                  borderRadius="md"
                  _hover={{
                    bg: 'gray.50',
                  }}
                  _active={{
                    bg: 'gray.100',
                  }}
                >
                  <Switch.Root
                    checked={rule.status}
                    aria-label={`Toggle ${rule.name} status`}
                    colorPalette={rule.status ? 'green' : 'gray'}
                    transition="all 0.2s ease-in-out"
                    _hover={{
                      transform: 'scale(1.05)',
                    }}
                    _active={{
                      transform: 'scale(0.95)',
                    }}
                  >
                    <Switch.HiddenInput />
                    <Switch.Control />
                  </Switch.Root>
                </Box>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm" color="gray.600">
                  {formatDate(rule.last_updated)}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewRule(rule)}
                  aria-label={`View ${rule.name}`}
                >
                  <HStack gap={1}>
                    <Eye size={16} />
                    <Text>View</Text>
                  </HStack>
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {/* Confirmation Dialog */}
      <Dialog.Root open={isConfirmOpen} onOpenChange={(e) => {
        if (!e.open) {
          handleCancelToggle();
        }
      }}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>
                  {ruleToToggle?.status ? 'Deactivate Rule' : 'Activate Rule'}
                </Dialog.Title>
                <Dialog.Description>
                  Are you sure you want to {ruleToToggle?.status ? 'deactivate' : 'activate'} the rule{' '}
                  <strong>{ruleToToggle?.name}</strong>? This will{' '}
                  {ruleToToggle?.status
                    ? 'prevent it from triggering alerts and auto-hold actions.'
                    : 'enable it to trigger alerts and auto-hold actions based on its parameters.'}
                </Dialog.Description>
              </Dialog.Header>
              <Dialog.Footer>
                <Button variant="outline" onClick={handleCancelToggle}>
                  Cancel
                </Button>
                <Button
                  colorPalette={ruleToToggle?.status ? 'red' : 'blue'}
                  onClick={handleConfirmToggle}
                >
                  {ruleToToggle?.status ? 'Deactivate' : 'Activate'}
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
}

