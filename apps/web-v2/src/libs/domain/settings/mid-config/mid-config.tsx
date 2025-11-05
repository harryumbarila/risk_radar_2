'use client';
import React from 'react';

import { Alert, Button, Flex, Heading } from '@chakra-ui/react';
import { MdPlusOne, MdSearch } from 'react-icons/md';

import { useQueryClient } from '@tanstack/react-query';

import { z } from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { $riskApi } from '@/libs/shared/api/risk.api';
import { Toaster, toaster } from '@/ui/components/common/atoms';

import { InputField } from '@/ui/components/form';
import MidCodeTable from './components/mid-code-table';

const midConfigSearchSchema = z.object({
  value: z
    .string()
    .min(1, 'Search term cannot be empty')
    .max(16, 'Mid code must be at most 16 digits'),
});

export type MidConfigSearchFormModel = z.infer<typeof midConfigSearchSchema>;

export default function SettingsMidConfig(): React.JSX.Element {
  const [submittedTerm, setSubmittedTerm] = React.useState('');

  const queryClient = useQueryClient();

  const methods = useForm<MidConfigSearchFormModel>({
    mode: 'all',
    defaultValues: {
      value: '',
    },
    resolver: zodResolver(midConfigSearchSchema),
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const { data, isLoading, isError } = $riskApi.useQuery(
    'get',
    '/v1/risk-rule/white-list-mid',
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
    '/v1/risk-rule/white-list-mid'
  );

  const handleSearch = (data: MidConfigSearchFormModel) => {
    if (data.value.trim()) {
      setSubmittedTerm(data.value.trim());
    }
  };

  const createMidCode = async () => {
    try {
      await mutateAsync({
        body: {
          MId: submittedTerm,
        },
      });
      await queryClient.invalidateQueries({
        queryKey: ['get', '/v1/risk-rule/white-list-mid'],
      });
      toaster.success({
        title: 'Created mid  successfully',
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
        MID Configuration
      </Heading>
      <Flex gap={4}>
        <FormProvider {...methods}>
          <Flex>
            <InputField name="value" type="number" placeholder="Search MID" />
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
            onClick={createMidCode}
            loading={isPending}
            disabled={isPending}
          >
            <MdPlusOne />
            Create
          </Button>
        )}
      </Flex>

      {data && data.length > 0 ? (
        <Flex gap={2}>
          {data.map((mid) => (
            <MidCodeTable key={mid.id} mid={mid} />
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
