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
} from '@chakra-ui/react';
import { Info } from 'lucide-react';
import type { RiskRule } from '../../context/rules-context';

interface RuleEditFormProps {
  rule: RiskRule;
  formData: Record<string, any> | null;
  onFormDataChange: (data: Record<string, any>) => void;
}

export default function RuleEditForm({
  rule,
  formData,
  onFormDataChange,
}: RuleEditFormProps): React.JSX.Element {
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

  return (
    <VStack align="stretch" gap={6}>
      {/* Threshold Settings */}
      <Box>
        <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={4} textTransform="uppercase">
          Threshold Settings
        </Text>
        <VStack align="stretch" gap={4}>
          {renderField(
            'threshold',
            'Threshold',
            'number',
            'The risk threshold value (0.0 to 1.0). Higher values indicate stricter rules.'
          )}
          {formData.window && renderField('window', 'Time Window', 'text', 'The time window for evaluation (e.g., "24h", "5m")')}
          {formData.min_transactions && renderField('min_transactions', 'Min Transactions', 'number', 'Minimum number of transactions required to trigger this rule')}
        </VStack>
      </Box>

      {/* Exception Patterns */}
      {(formData.country_list || formData.avs_codes || formData.max_daily_attempts) && (
        <Box>
          <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={4} textTransform="uppercase">
            Exception Patterns
          </Text>
          <VStack align="stretch" gap={4}>
            {formData.country_list &&
              renderField(
                'country_list',
                'Country List',
                'json',
                'Array of country codes to monitor (e.g., ["MX", "BR"])'
              )}
            {formData.avs_codes &&
              renderField(
                'avs_codes',
                'AVS Codes',
                'json',
                'Address Verification System codes to flag (e.g., ["N", "Z"])'
              )}
            {formData.max_daily_attempts &&
              renderField(
                'max_daily_attempts',
                'Max Daily Attempts',
                'number',
                'Maximum number of attempts allowed per day'
              )}
          </VStack>
        </Box>
      )}

      {/* Other Parameters */}
      {(formData.max_amount ||
        formData.currency ||
        formData.lookback_days ||
        formData.deviation_factor ||
        formData.max_merchants ||
        formData.time_window ||
        formData.max_transactions ||
        formData.max_distance_km ||
        formData.require_match) && (
        <Box>
          <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={4} textTransform="uppercase">
            Other Parameters
          </Text>
          <VStack align="stretch" gap={4}>
            {formData.max_amount && renderField('max_amount', 'Max Amount', 'number', 'Maximum transaction amount in base currency')}
            {formData.currency && renderField('currency', 'Currency', 'text', 'Currency code (e.g., "USD")')}
            {formData.lookback_days && renderField('lookback_days', 'Lookback Days', 'number', 'Number of days to look back for pattern analysis')}
            {formData.deviation_factor && renderField('deviation_factor', 'Deviation Factor', 'number', 'Factor for detecting deviations from normal patterns')}
            {formData.max_merchants && renderField('max_merchants', 'Max Merchants', 'number', 'Maximum number of merchants allowed in time window')}
            {formData.time_window && renderField('time_window', 'Time Window', 'text', 'Time window for evaluation')}
            {formData.max_transactions && renderField('max_transactions', 'Max Transactions', 'number', 'Maximum number of transactions allowed in time window')}
            {formData.max_distance_km && renderField('max_distance_km', 'Max Distance (km)', 'number', 'Maximum distance in kilometers for geographic validation')}
            {formData.require_match && renderField('require_match', 'Require Match', 'text', 'Whether to require exact match (true/false)')}
          </VStack>
        </Box>
      )}
    </VStack>
  );
}

