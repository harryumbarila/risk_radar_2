'use client';

import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Field,
  Tooltip,
  Portal,
  Badge,
} from '@chakra-ui/react';
import { Info } from 'lucide-react';
import type { RiskRule } from '../../context/rules-context';
import { getReleaseCriteria } from '../../data/release-criteria';

function ReleaseCriteriaDisplay({ ruleId }: { ruleId: string }): React.JSX.Element | null {
  const criteria = getReleaseCriteria(ruleId);
  if (!criteria) return null;
  const isNever = criteria.releaseType === 'Never';
  return (
    <VStack align="stretch" gap={4}>
      <HStack gap={2} align="center">
        <Text fontSize="sm" fontWeight="medium" color="gray.600">
          Release Type:
        </Text>
        <Badge variant="subtle" colorPalette="blue" size="sm">
          {criteria.releaseType}
        </Badge>
      </HStack>
      <Box>
        <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={2}>
          Auto Release Triggers
        </Text>
        <Box as="ul" listStyleType="disc" pl={5} m={0}>
          {criteria.triggers.map((line, i) => (
            <Text key={i} as="li" fontSize="sm" color="gray.800" mb={1}>
              {line}
            </Text>
          ))}
        </Box>
      </Box>
      <Box>
        <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={2}>
          Auto Release Parameters
        </Text>
        {isNever && criteria.parameters[0] === 'N/A' ? (
          <Text fontSize="sm" color="gray.800">
            N/A
          </Text>
        ) : (
          <Box as="ul" listStyleType="disc" pl={5} m={0}>
            {criteria.parameters.map((line, i) => (
              <Text key={i} as="li" fontSize="sm" color="gray.800" mb={1}>
                {line}
              </Text>
            ))}
          </Box>
        )}
      </Box>
    </VStack>
  );
}

interface RuleEditFormProps {
  rule: RiskRule;
  formData: Record<string, any> | null;
  onFormDataChange: (data: Record<string, any>) => void;
}

export default function RuleEditForm({
  rule,
  formData,
  onFormDataChange,
}: RuleEditFormProps): React.JSX.Element | null {
  const handleChange = (key: string, value: any) => {
    if (!formData) return;
    onFormDataChange({
      ...formData,
      [key]: value,
    });
  };

  if (!formData) return null;

  const renderField = (
    key: string,
    label: string,
    type: 'text' | 'number' | 'json' = 'text',
    tooltip?: string
  ) => {
    const value = formData[key];
    const displayValue = typeof value === 'object' ? JSON.stringify(value) : String(value || '');

    return (
      <Field.Root key={key}>
        <HStack justify="space-between" align="center" mb={1}>
          <Field.Label fontSize="sm" fontWeight="medium" color="gray.700">
            {label}
          </Field.Label>
          {tooltip && (
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Box
                  as="span"
                  color="gray.400"
                  _hover={{ color: 'gray.600' }}
                  cursor="help"
                  display="inline-flex"
                  alignItems="center"
                  aria-label="Field information"
                >
                  <Info size={14} />
                </Box>
              </Tooltip.Trigger>
              <Portal>
                <Tooltip.Positioner>
                  <Tooltip.Content
                    maxW="250px"
                    zIndex={2000}
                    bg="gray.900"
                    color="white"
                    px={3}
                    py={2}
                    borderRadius="md"
                    fontSize="sm"
                    boxShadow="lg"
                  >
                    <Tooltip.Arrow />
                    {tooltip}
                  </Tooltip.Content>
                </Tooltip.Positioner>
              </Portal>
            </Tooltip.Root>
          )}
        </HStack>
        {type === 'json' ? (
          <Input
            value={displayValue}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleChange(key, parsed);
              } catch {
                // Invalid JSON, keep as string
                handleChange(key, e.target.value);
              }
            }}
            fontFamily="mono"
            fontSize="sm"
          />
        ) : (
          <Input
            type={type}
            value={displayValue}
            onChange={(e) =>
              handleChange(
                key,
                type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
              )
            }
            fontSize="sm"
          />
        )}
      </Field.Root>
    );
  };

  // Helper function to determine field type based on value
  const getFieldType = (value: any): 'text' | 'number' | 'json' => {
    if (typeof value === 'number') return 'number';
    if (typeof value === 'object' && value !== null) return 'json';
    return 'text';
  };

  // Helper function to format label from key
  const formatLabel = (key: string): string => {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Get all parameter keys
  const parameterKeys = Object.keys(formData || {});

  // Group parameters by category (optional - can be customized)
  const thresholdKeys = parameterKeys.filter(key => 
    key.includes('threshold') || key.includes('window') || key.includes('min_transactions')
  );
  const exceptionKeys = parameterKeys.filter(key => 
    key.includes('country') || key.includes('avs') || key.includes('attempts')
  );
  const otherKeys = parameterKeys.filter(key => 
    !thresholdKeys.includes(key) && !exceptionKeys.includes(key)
  );

  return (
    <VStack align="stretch" gap={6}>
      {/* Threshold Settings */}
      {thresholdKeys.length > 0 && (
        <Box>
          <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={4} textTransform="uppercase">
            Threshold Settings
          </Text>
          <VStack align="stretch" gap={4}>
            {thresholdKeys.map((key) => {
              const value = formData[key];
              const fieldType = getFieldType(value);
              return renderField(
                key,
                formatLabel(key),
                fieldType,
                `Parameter: ${formatLabel(key)}`
              );
            })}
          </VStack>
        </Box>
      )}

      {/* Exception Patterns */}
      {exceptionKeys.length > 0 && (
        <Box>
          <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={4} textTransform="uppercase">
            Exception Patterns
          </Text>
          <VStack align="stretch" gap={4}>
            {exceptionKeys.map((key) => {
              const value = formData[key];
              const fieldType = getFieldType(value);
              return renderField(
                key,
                formatLabel(key),
                fieldType,
                `Parameter: ${formatLabel(key)}`
              );
            })}
          </VStack>
        </Box>
      )}

      {/* All Other Parameters - Show all remaining parameters dynamically */}
      {otherKeys.length > 0 && (
        <Box>
          <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={4} textTransform="uppercase">
            Variables
          </Text>
          <VStack align="stretch" gap={4}>
            {otherKeys.map((key) => {
              const value = formData[key];
              const fieldType = getFieldType(value);
              return renderField(
                key,
                formatLabel(key),
                fieldType,
                `Parameter: ${formatLabel(key)}`
              );
            })}
          </VStack>
        </Box>
      )}

      {/* Release Criterias (read-only) */}
      {getReleaseCriteria(rule.id) && (
        <Box
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="md"
          p={4}
          bg="gray.50"
        >
          <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={4} textTransform="uppercase">
            Release Criterias
          </Text>
          <ReleaseCriteriaDisplay ruleId={rule.id} />
        </Box>
      )}

      {/* If no parameters exist */}
      {parameterKeys.length === 0 && (
        <Box
          bg="gray.50"
          p={4}
          borderRadius="md"
          borderWidth="1px"
          borderColor="gray.200"
          textAlign="center"
        >
          <Text fontSize="sm" color="gray.500">
            No parameters configured for this rule.
          </Text>
        </Box>
      )}
    </VStack>
  );
}

