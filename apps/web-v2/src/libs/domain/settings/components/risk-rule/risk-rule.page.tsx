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
  Loader,
  Center,
} from '@chakra-ui/react';
import { MdAdd } from 'react-icons/md';
import AddParamValueDialog from '../add-risk-rule/add-risk-rule';
import { $riskApi } from '@/libs/shared/api/risk.api';
import { components } from '@/libs/shared/api/schemas/schema';

export default function RiskRulePage() {
  const [selectedRule, setSelectedRule] = React.useState<
    components['schemas']['RiskRuleParamValueOutputDto'] | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const { data, isLoading } = $riskApi.useQuery('get', '/v1/risk-rule');

  console.log({
    data,
  });

  const handleAddParamValue = (
    rule: components['schemas']['RiskRuleParamValueOutputDto']
  ) => {
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

  if (isLoading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

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
          {data?.data && data.data?.length > 0
            ? data.data?.map((rule) => (
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
                        <Text
                          fontSize="lg"
                          fontWeight="semibold"
                          color="gray.800"
                        >
                          {rule.definition}
                        </Text>
                        <Badge variant="subtle">{rule.ruleType?.code}</Badge>
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

                      {rule.paramValues.length > 0 && (
                        <Box
                          mt={2}
                          pt={2}
                          borderTop="1px solid"
                          borderColor="gray.100"
                          w="full"
                        >
                          <VStack gap={2} align="start">
                            {rule.paramValues.map((param) => (
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
                                  {param.definition.replace(
                                    'XXX',
                                    String(param.value)
                                  )}
                                </Text>
                                <Text color="gray.400">•</Text>
                                <Text color="gray.600">
                                  Effective: {formatDate(param.effectiveDate)}
                                </Text>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleAddParamValue(param)}
                                >
                                  <MdAdd size={16} />
                                  <Text ml={1}>Edit</Text>
                                </Button>
                              </HStack>
                            ))}
                          </VStack>
                        </Box>
                      )}
                    </VStack>
                  </HStack>
                </Box>
              ))
            : null}
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
