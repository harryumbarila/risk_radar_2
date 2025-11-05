'use client';
import React from 'react';

import { Alert, Button, Flex, Heading } from '@chakra-ui/react';
import { MdAddCircle, MdSearch } from 'react-icons/md';

import { useQueryClient } from '@tanstack/react-query';

import { z } from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { $riskApi } from '@/libs/shared/api/risk.api';
import { Toaster, toaster } from '@/ui/components/common/atoms';
import MCCCodeTable from './components/mcc-code-table';

import { InputField } from '@/ui/components/form';

const mccConfigSearchSchema = z.object({
  value: z
    .string()
    .min(1, 'Search term cannot be empty')
    .max(4, 'MCC code must be at most 4 digits'),
});

export type MCCConfigSearchFormModel = z.infer<typeof mccConfigSearchSchema>;

export default function SettingsMCCConfig(): React.JSX.Element {
  const [submittedTerm, setSubmittedTerm] = React.useState('');

  const queryClient = useQueryClient();

  const methods = useForm<MCCConfigSearchFormModel>({
    mode: 'all',
    defaultValues: {
      value: '',
    },
    resolver: zodResolver(mccConfigSearchSchema),
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const { data, isLoading } = $riskApi.useQuery(
    'get',
    '/v1/risk-rule/white-list-mcc',
    {
      params: {
        query: {
          mcc: submittedTerm,
        },
      },
    },
    {
      enabled: Boolean(submittedTerm),
    }
  );

  const { mutateAsync, isPending, isError } = $riskApi.useMutation(
    'post',
    '/v1/risk-rule/white-list-mcc'
  );

  const handleSearch = (data: MCCConfigSearchFormModel) => {
    if (data.value.trim()) {
      setSubmittedTerm(data.value.trim());
    }
  };

  const createMCCCode = async () => {
    try {
      await mutateAsync({
        body: {
          MCC: submittedTerm,
        },
      });
      await queryClient.invalidateQueries({
        queryKey: ['get', '/v1/risk-rule/white-list-mcc'],
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
        MCC Configuration
      </Heading>
      <Flex gap={4}>
        <FormProvider {...methods}>
          <Flex>
            <InputField name="value" type="number" placeholder="Search MCC" />
          </Flex>
          <Button
            size="sm"
            bg="black"
            color="white"
            _hover={{ bg: 'gray.800' }}
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
            bg="black"
            color="white"
            _hover={{ bg: 'gray.800' }}
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
        <Flex gap={2}>
          {data.map((mcc) => (
            <MCCCodeTable key={mcc.id} mcc={mcc} />
          ))}
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
            <Alert.Title>No MCC Found</Alert.Title>
            <Alert.Description>
              {`No MCC found matching "${submittedTerm}". Please check the MCC and try
              again.`}
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      ) : null}
      <Toaster />
    </Flex>
  );
}
