'use client';
import React from 'react';
import {
  Box,
  Button,
  CloseButton,
  Drawer,
  Field,
  Fieldset,
  Flex,
  For,
  Input,
  NativeSelect,
  Portal,
  Stack,
} from '@chakra-ui/react';
import { MdCheck, MdOutlineArrowBack } from 'react-icons/md';

import {
  EditThresholdsDrawerProps,
  merchantRiskThresholdsSchema,
  MerchantRiskThresholdsFormModel,
} from './edit-thresholds.model';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputField } from '@/ui/components/form';
import { $riskApi } from '@/libs/shared/api/risk.api';
import { toaster } from '@/ui/components/common/atoms';
import { useQueryClient } from '@tanstack/react-query';

export default function EditThresholdsDrawer(
  props: React.PropsWithChildren<EditThresholdsDrawerProps>
) {
  const { threshold } = props;

  const queryClient = useQueryClient();

  const user = 'admin_user';

  const methods = useForm<MerchantRiskThresholdsFormModel>({
    mode: 'all',
    resolver: zodResolver(merchantRiskThresholdsSchema),
    defaultValues: {
      declinePercentage: threshold.declinePercentage?.toString() || '',
      monthlyVolume: threshold.monthlyVolume?.toString() || '',
      highTicket: threshold.highTicket?.toString() || '',
      transactionCount: threshold.transactionCount?.toString() || '',
      keyedPercentage: threshold.keyedPercentage?.toString() || '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const { mutateAsync } = $riskApi.useMutation(
    'post',
    '/v1/risk-rule/merchant-risk-threshold'
  );

  const onSubmit = async (data: MerchantRiskThresholdsFormModel) => {
    try {
      console.log({ data });
      await mutateAsync({
        body: {
          ...Object.entries(data).reduce((acc, [key, value]) => ({
            ...acc,
            [key]: Number(value),
          })),
          mid: threshold.mid,
          lastUpdatedBy: user,
        },
      });

      await queryClient.invalidateQueries({
        queryKey: ['get', '/v1/risk-rule/merchant-risk-threshold'],
      });
      toaster.success({
        title: 'Threshold updated successfully',
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
    <Drawer.Root
      placement={{ mdDown: 'bottom', md: 'end' }}
      size={{
        mdDown: 'sm',
        md: 'lg',
      }}
    >
      <Drawer.Trigger asChild>{props.children}</Drawer.Trigger>
      <Portal>
        <FormProvider {...methods}>
          <Drawer.Backdrop />
          <Drawer.Positioner padding="4" onClick={(e) => e.stopPropagation()}>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Threshold Details</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Flex gap={4} direction="column" justifyContent="center">
                  <Fieldset.Root size="lg" justifyContent="center">
                    <Stack>
                      <Fieldset.Legend>Edit details</Fieldset.Legend>
                      <Fieldset.HelperText>
                        Please fill threshold details below.
                      </Fieldset.HelperText>
                    </Stack>

                    <Fieldset.Content>
                      <InputField
                        type="number"
                        name="monthlyVolume"
                        label="Monthly Volume"
                      />
                      <InputField
                        type="number"
                        name="declinePercentage"
                        label="Decline %"
                      />
                      <InputField
                        type="number"
                        name="highTicket"
                        label="High Ticket"
                      />
                      <InputField
                        type="number"
                        name="transactionCount"
                        label="Transaction Count"
                      />
                      <InputField
                        type="number"
                        name="keyedPercentage"
                        label="Keyed %"
                      />
                    </Fieldset.Content>
                  </Fieldset.Root>
                </Flex>
              </Drawer.Body>
              <Drawer.Footer>
                <Box display="flex" flexDirection="column" w="100%" gap={4}>
                  <Button
                    flexGrow={1}
                    loading={isSubmitting}
                    disabled={!isValid || isSubmitting}
                    onClick={handleSubmit(onSubmit)}
                  >
                    <MdCheck size={14} />
                    Update
                  </Button>
                  <Drawer.ActionTrigger asChild>
                    <Button
                      variant="outline"
                      flexGrow={1}
                      disabled={isSubmitting}
                    >
                      <MdOutlineArrowBack />
                      Back
                    </Button>
                  </Drawer.ActionTrigger>
                </Box>
              </Drawer.Footer>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </FormProvider>
      </Portal>
    </Drawer.Root>
  );
}
