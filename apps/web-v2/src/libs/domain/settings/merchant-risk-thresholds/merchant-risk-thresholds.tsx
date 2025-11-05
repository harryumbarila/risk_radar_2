'use client';
import React from 'react';

import { Alert, Button, Flex, Heading, HStack } from '@chakra-ui/react';
import { MdAddCircle, MdOutlineRemoveRedEye, MdSearch } from 'react-icons/md';

import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { $riskApi } from '@/libs/shared/api/risk.api';
import { Toaster, toaster } from '@/ui/components/common/atoms';

import { InputField } from '@/ui/components/form';
import {
  merchantRiskThresholdsSearchSchema,
  MerchantRiskThresholdsSearchFormModel,
} from './merchant-risk-thresholds.model';
import { DataTable } from '@/ui/components/common/organisms/data-table';
import { components } from '@/libs/shared/api/schemas/schema';
import {
  formatDate,
  formatCurrency,
  formatNumber,
} from '@/libs/utils/formatter';
import EditThresholdsDrawer from './components/edit-thresholds/edit-thresholds';

const columnHelper =
  createColumnHelper<components['schemas']['MerchanRiskThresholdsEntity']>();

const columns = [
  columnHelper.accessor('mid', {
    header: () => 'MID',
    enableSorting: true,
  }),
  columnHelper.accessor('declinePercentage', {
    header: () => 'Decline %',
    enableSorting: true,
    meta: {
      align: 'center',
    },
  }),
  columnHelper.accessor('highTicket', {
    header: () => 'High Ticket',
    enableSorting: true,
    cell: (info) => formatNumber(info.getValue()),
    meta: {
      align: 'right',
    },
  }),
  columnHelper.accessor('keyedPercentage', {
    header: () => 'Keyed %',
    enableSorting: true,
    meta: {
      align: 'center',
    },
  }),
  columnHelper.accessor('monthlyVolume', {
    header: () => 'Monthly Volume',
    enableSorting: true,
    cell: (info) => formatCurrency(info.getValue()),
    meta: {
      align: 'right',
    },
  }),
  columnHelper.accessor('transactionCount', {
    header: () => 'Transaction Count',
    enableSorting: true,
    cell: (info) => formatNumber(info.getValue()),
    meta: {
      align: 'right',
    },
  }),
  columnHelper.accessor('lastUpdatedBy', {
    header: () => 'Last Updated By',
    enableSorting: true,
  }),
  columnHelper.accessor('lastUpdatedDate', {
    header: () => 'Updated  At',
    enableSorting: true,
    cell: (info) => formatDate(info.getValue()),
  }),
  columnHelper.display({
    id: 'actions',
    header: () => 'Actions',
    cell: (props) => (
      <HStack justify="center" gap={2}>
        <EditThresholdsDrawer threshold={props.row.original}>
          <Button
            size="sm"
            variant="outline"
            colorScheme="gray"
            onClick={(e) => e.stopPropagation()}
          >
            <MdOutlineRemoveRedEye />
            View
          </Button>
        </EditThresholdsDrawer>
      </HStack>
    ),
  }),
] as ColumnDef<components['schemas']['MerchanRiskThresholdsEntity']>[];

export default function SettingsMerchantRiskThresholds(): React.JSX.Element {
  const [submittedTerm, setSubmittedTerm] = React.useState('');

  const queryClient = useQueryClient();

  const methods = useForm<MerchantRiskThresholdsSearchFormModel>({
    mode: 'all',
    defaultValues: {
      value: '',
    },
    resolver: zodResolver(merchantRiskThresholdsSearchSchema),
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const { data, isLoading, isError } = $riskApi.useQuery(
    'get',
    '/v1/risk-rule/merchant-risk-threshold',
    {
      params: {
        query: {
          mid: submittedTerm,
        },
      },
    },
    {
      enabled: Boolean(submittedTerm),
    }
  );

  const { mutateAsync, isPending } = $riskApi.useMutation(
    'post',
    '/v1/risk-rule/merchant-risk-threshold'
  );

  const handleSearch = (data: MerchantRiskThresholdsSearchFormModel) => {
    if (data.value.trim()) {
      setSubmittedTerm(data.value.trim());
    }
  };

  console.log({
    isError,
  });

  const createMCCCode = async () => {
    try {
      await mutateAsync({
        body: {
          mid: submittedTerm,
          declinePercentage: 0,
          monthlyVolume: 0,
          highTicket: 0,
          transactionCount: 0,
          keyedPercentage: 0,
          lastUpdatedBy: 'admin_user',
        },
      });
      await queryClient.invalidateQueries({
        queryKey: ['get', '/v1/risk-rule/merchant-risk-threshold'],
      });
      toaster.success({
        title: 'Created mcc code successfully',
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
    <Flex flexDirection="column" gap={4}>
      <Heading size="lg" color="brand.700">
        Merchant Risk Threshold
      </Heading>
      <Flex gap={4} alignItems="center">
        <FormProvider {...methods}>
          <Flex>
            <InputField name="value" type="number" placeholder="Search MID" />
          </Flex>
          <Button
            size="sm"
            onClick={handleSubmit(handleSearch)}
            loading={isLoading}
            disabled={!isValid}
          >
            <MdSearch />
            Search
          </Button>
        </FormProvider>
        {!data?.length && submittedTerm && !isLoading && (
          <Button
            size="sm"
            onClick={createMCCCode}
            loading={isPending}
            disabled={isPending}
          >
            <MdAddCircle />
            Create
          </Button>
        )}
      </Flex>

      {data && data.length > 0 ? (
        <Flex gap={2} w="full">
          <DataTable
            isLoading={false}
            data={{
              data,
              count: data.length,
              total: data.length,
              page: 1,
              pageCount: data.length,
            }}
            columns={columns}
          />
        </Flex>
      ) : isError ? (
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Error</Alert.Title>
            <Alert.Description>Error found. Try again later.</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      ) : submittedTerm && !isLoading ? (
        <Alert.Root status="info">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>No MID Found</Alert.Title>
            <Alert.Description>
              {`No MID found matching "${submittedTerm}". Please check the MID and try
              again.`}
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      ) : null}
      <Toaster />
    </Flex>
  );
}
