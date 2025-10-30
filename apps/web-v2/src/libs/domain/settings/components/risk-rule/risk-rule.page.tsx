'use client';
import React from 'react';

import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
  Badge,
  Separator,
} from '@chakra-ui/react';
import { MdAdd } from 'react-icons/md';
import AddParamValueDialog from '../add-risk-rule/add-risk-rule';
// import { $riskApi } from '@/libs/shared/api/risk.api';

const mockRiskRules = {
  edges: [
    {
      node: {
        id: '1',
        definition: 'Bank Change Rule',
        source: { definition: 'TSYS ADF Auth' },
        ruleType: { definition: 'Auto Hold', code: 'AH' },
        paramValues: {
          edges: [
            {
              node: {
                id: '1',
                effectiveDate: '2025-08-30T14:19:19.547Z',
                value: 30,
              },
            },
          ],
        },
      },
    },
    {
      node: {
        id: '2',
        definition: 'Foreign Card Rule',
        source: { definition: 'TSYS ADF Auth' },
        ruleType: { definition: 'Auto Hold', code: 'AH' },
        paramValues: {
          edges: [
            {
              node: {
                id: '2',
                effectiveDate: '2025-08-30T14:19:19.547Z',
                value: 300,
              },
            },
          ],
        },
      },
    },
    {
      node: {
        id: '3',
        definition: 'High Trans Rule',
        source: { definition: 'TSYS ADF Auth' },
        ruleType: { definition: 'Auto Hold', code: 'AH' },
        paramValues: {
          edges: [
            {
              node: {
                id: '3',
                effectiveDate: '2025-08-30T14:19:19.547Z',
                value: 500,
              },
            },
          ],
        },
      },
    },
    {
      node: {
        id: '4',
        definition: 'High $ Batch Rule',
        source: { definition: 'TSYS ADF Auth' },
        ruleType: { definition: 'Auto Hold', code: 'AH' },
        paramValues: {
          edges: [
            {
              node: {
                id: '4',
                effectiveDate: '2025-08-30T14:19:19.547Z',
                value: 20000,
              },
            },
          ],
        },
      },
    },
    {
      node: {
        id: '5',
        definition: 'Dormant account of 90 days',
        source: { definition: 'TSYS ADF Auth' },
        ruleType: { definition: 'Auto Hold', code: 'AH' },
        paramValues: {
          edges: [
            {
              node: {
                id: '5',
                effectiveDate: '2025-08-30T14:19:19.547Z',
                value: 75,
              },
            },
          ],
        },
      },
    },
    {
      node: {
        id: '6',
        definition: 'Prepaid Rule',
        source: { definition: 'TSYS ADF Auth' },
        ruleType: { definition: 'Auto Hold', code: 'AH' },
        paramValues: {
          edges: [
            {
              node: {
                id: '6',
                effectiveDate: '2025-08-30T14:19:19.547Z',
                value: 25000,
              },
            },
          ],
        },
      },
    },
    {
      node: {
        id: '7',
        definition: 'Risk thresholds',
        source: { definition: 'TSYS ADF Auth' },
        ruleType: { definition: 'Auto Hold', code: 'AH' },
        paramValues: {
          edges: [
            {
              node: {
                id: '7',
                effectiveDate: '2025-08-30T14:19:19.547Z',
                value: 50000,
              },
            },
          ],
        },
      },
    },
    {
      node: {
        id: '8',
        definition: 'Location rule',
        source: { definition: 'TSYS ADF Auth' },
        ruleType: { definition: 'Auto Hold', code: 'AH' },
        paramValues: { edges: [] },
      },
    },
  ],
};

interface RiskRule {
  id: string;
  definition: string;
  source: { definition: string };
  ruleType: { definition: string; code: string };
  paramValues: {
    edges: Array<{
      node: {
        id: string;
        effectiveDate: string;
        value: number;
      };
    }>;
  };
}

export default function RiskRulePage() {
  const [selectedRule, setSelectedRule] = React.useState<RiskRule | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  // const { data, isLoading } = $riskApi.useQuery('get', '/v1/risk-rule', {
  //   params: {
  //     query: {
  //       join: ['source', 'ruleType', 'parameters', 'parameters.values'],
  //     },
  //   },
  // });

  const handleAddParamValue = (rule: RiskRule) => {
    setSelectedRule(rule);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Box ml="260px" p={10} mt={50}>
      <Box bg="white" borderRadius="xl" boxShadow="md" p={4}>
        <HStack justify="space-between" mb={6}>
          <VStack align="start" gap={1}>
            <Text fontSize="2xl" fontWeight="bold" color="gray.700">
              Risk Rules Configuration
            </Text>
            <Text fontSize="sm" color="gray.500">
              Manage risk rules and parameter values for your applications
            </Text>
          </VStack>
        </HStack>

        <Separator mb={6} />

        <VStack gap={4} align="stretch">
          {mockRiskRules.edges.map(({ node: rule }) => (
            <Box
              key={rule.id}
              p={4}
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.200"
              _hover={{ bg: 'gray.50', borderColor: 'brand.300' }}
              transition="all 0.2s"
            >
              <HStack justify="space-between" align="start">
                <VStack align="start" gap={2} flex={1}>
                  <HStack gap={2}>
                    <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                      {rule.definition}
                    </Text>
                    <Badge variant="subtle">{rule.ruleType.code}</Badge>
                  </HStack>

                  <HStack gap={4} fontSize="sm" color="gray.600">
                    <HStack gap={1}>
                      <Text fontWeight="medium">Source:</Text>
                      <Text>{rule.source.definition}</Text>
                    </HStack>
                    <Text color="gray.300">|</Text>
                    <HStack gap={1}>
                      <Text fontWeight="medium">Type:</Text>
                      <Text>{rule.ruleType.definition}</Text>
                    </HStack>
                  </HStack>

                  {rule.paramValues.edges.length > 0 && (
                    <Box
                      mt={2}
                      pt={2}
                      borderTop="1px solid"
                      borderColor="gray.100"
                      w="full"
                    >
                      <Text
                        fontSize="xs"
                        fontWeight="semibold"
                        color="gray.500"
                        mb={2}
                      >
                        PARAMETER VALUES
                      </Text>
                      <VStack gap={2} align="start">
                        {rule.paramValues.edges.map(({ node: param }) => (
                          <HStack
                            key={param.id}
                            gap={3}
                            fontSize="sm"
                            p={2}
                            bg="brand.50"
                            borderRadius="md"
                            w="full"
                          >
                            <Text fontWeight="medium" color="brand.700">
                              Value: {param.value}
                            </Text>
                            <Text color="gray.400">•</Text>
                            <Text color="gray.600">
                              Effective: {formatDate(param.effectiveDate)}
                            </Text>
                          </HStack>
                        ))}
                      </VStack>
                    </Box>
                  )}
                </VStack>

                <Button size="sm" onClick={() => handleAddParamValue(rule)}>
                  <MdAdd size={16} />
                  <Text ml={1}>Add Value</Text>
                </Button>
              </HStack>
            </Box>
          ))}
        </VStack>

        <AddParamValueDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          rule={selectedRule}
        />
      </Box>
    </Box>
  );
}
