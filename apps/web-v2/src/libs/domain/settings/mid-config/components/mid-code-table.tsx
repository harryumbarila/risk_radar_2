'use client';
import React from 'react';

import { useQueryClient } from '@tanstack/react-query';
import {
  Flex,
  Box,
  Heading,
  Button,
  Table,
  Switch,
  Text,
} from '@chakra-ui/react';

import { useForm, Controller } from 'react-hook-form';

import { components } from '@/libs/shared/api/schemas/schema';
import { $riskApi } from '@/libs/shared/api/risk.api';

import { toaster } from '@/ui/components/common/atoms';
import CheckStatusBadge from './check-status-badge';

type AHCode =
  | 'AH01'
  | 'AH02'
  | 'AH03'
  | 'AH04'
  | 'AH05'
  | 'AH06'
  | 'AH07'
  | 'AH08'
  | 'AH09'
  | 'AH10'
  | 'AH11'
  | 'AH12'
  | 'AH13'
  | 'AH14'
  | 'AH15'
  | 'AH16';

interface MidCodeTableProps {
  mid: components['schemas']['RiskRuleWhiteListMidEntity'];
}

export default function MidCodeTable(
  props: MidCodeTableProps
): React.JSX.Element {
  const { mid } = props;

  const queryClient = useQueryClient();
  const {
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: mid,
  });

  const user = 'system_user';

  // eslint-disable-next-line react-hooks/incompatible-library
  const values = watch();

  const { mutateAsync } = $riskApi.useMutation(
    'post',
    '/v1/risk-rule/white-list-mid'
  );

  const getAHCodes = (): AHCode[] => [
    'AH01',
    'AH02',
    'AH03',
    'AH04',
    'AH05',
    'AH06',
    'AH07',
    'AH08',
    'AH09',
    'AH10',
    'AH11',
    'AH12',
    'AH13',
    'AH14',
    'AH15',
    'AH16',
  ];

  const handleFormSubmit = async (
    values: components['schemas']['RiskRuleWhiteListMidEntity']
  ) => {
    try {
      await mutateAsync({
        body: {
          ...values,
          lastUpdatedBy: user,
        },
      });
      await queryClient.invalidateQueries({
        queryKey: ['get', '/v1/risk-rule/white-list-mid'],
      });
      toaster.success({
        title: 'Updated mid successfully',
      });
    } catch (error) {
      if (error instanceof Error) {
        toaster.error({
          title: 'Something went wrong',
          description: error.message,
        });
      }
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      key={mid.id}
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      w="full"
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Box>
          <Heading as="h3" size="md" fontWeight="semibold">
            MID: {mid.MId}
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Last updated: {new Date(mid.lastUpdatedDate).toLocaleString()} by{' '}
            <Text as="span" fontWeight="bold">
              {mid.lastUpdatedBy || 'Unknown'}
            </Text>
          </Text>
        </Box>

        <Button
          type="submit"
          colorScheme="blue"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Save Changes
        </Button>
      </Flex>

      {/* AH Codes Table */}
      <Table.Root size="sm" striped>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Code</Table.ColumnHeader>
            <Table.ColumnHeader>Status</Table.ColumnHeader>
            <Table.ColumnHeader>Action</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {getAHCodes().map((ahCode) => {
            const isChecked = values[ahCode];
            return (
              <Table.Row key={ahCode}>
                <Table.Cell fontWeight="medium">{ahCode}</Table.Cell>
                <Table.Cell>
                  <CheckStatusBadge value={isChecked} />
                </Table.Cell>
                <Table.Cell>
                  <Controller
                    name={ahCode}
                    control={control}
                    render={({ field }) => (
                      <Switch.Root
                        checked={!!field.value}
                        onCheckedChange={(e) => field.onChange(e.checked)}
                      >
                        <Switch.HiddenInput />
                        <Switch.Control />
                      </Switch.Root>
                    )}
                  />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
