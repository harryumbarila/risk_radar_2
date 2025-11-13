'use client';

import React from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Badge,
  Switch,
  Button,
} from '@chakra-ui/react';
import { Eye } from 'lucide-react';
import type { RiskRule } from '../../context/rules-context';

interface RuleCardProps {
  rule: RiskRule;
  onView: (rule: RiskRule) => void;
  onToggle: (rule: RiskRule) => void;
}

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

export default function RuleCard({ rule, onView, onToggle }: RuleCardProps): React.JSX.Element {
  return (
    <Box
      bg="white"
      p={4}
      borderRadius="xl"
      borderWidth="1px"
      borderColor="gray.200"
      boxShadow="0 2px 8px rgba(0,0,0,0.05)"
      _hover={{
        bg: 'gray.50',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transform: 'translateY(-2px)',
      }}
      transition="all 0.15s ease-in-out"
    >
      <VStack align="stretch" gap={3}>
        <HStack justify="space-between" align="start">
          <VStack align="start" gap={1} flex={1}>
            <Text fontSize="md" fontWeight="semibold" color="gray.900">
              {rule.name}
            </Text>
            <Text
              fontSize="xs"
              color="gray.500"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {rule.description}
            </Text>
          </VStack>
          <Badge
            variant="subtle"
            colorPalette={getSeverityColor(rule.severity)}
            px={3}
            py={1}
            borderRadius="md"
          >
            {rule.severity}
          </Badge>
        </HStack>

        <HStack gap={4} flexWrap="wrap" fontSize="xs" color="gray.600">
          <HStack gap={1}>
            <Text fontWeight="medium">Type:</Text>
            <Badge variant="subtle" colorPalette="gray">
              {rule.type}
            </Badge>
          </HStack>
          <HStack gap={1}>
            <Text fontWeight="medium">Source:</Text>
            <Text>{rule.source}</Text>
          </HStack>
          <HStack gap={1}>
            <Text fontWeight="medium">Updated:</Text>
            <Text>{formatDate(rule.last_updated)}</Text>
          </HStack>
        </HStack>

        <HStack justify="space-between" align="center" pt={2} borderTopWidth="1px" borderColor="gray.100">
          <HStack gap={2} align="center">
            <Text fontSize="xs" color="gray.600">
              Status:
            </Text>
            <Box
              as="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggle(rule);
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
              >
                <Switch.HiddenInput />
                <Switch.Control />
              </Switch.Root>
            </Box>
          </HStack>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(rule)}
            aria-label={`View ${rule.name}`}
          >
            <HStack gap={1}>
              <Eye size={16} />
              <Text>View</Text>
            </HStack>
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}

