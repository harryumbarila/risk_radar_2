'use client';
import { JSX } from 'react';

import {
  Button,
  Input,
  VStack,
  HStack,
  Text,
  Portal,
  Dialog,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { $riskApi } from '@/libs/shared/api/risk.api';
import {
  AddParamValueDialogProps,
  ParameterValueFormModel,
  validateSchema,
} from './add-risk-rule.model';

const AddParamValueDialog = ({
  isOpen,
  onClose,
  rule,
}: AddParamValueDialogProps): JSX.Element | null => {
  const queryClient = useQueryClient();
  const methods = useForm<ParameterValueFormModel>({
    mode: 'all',
    defaultValues: {
      value: '',
      effectiveDate: '',
    },
    resolver: zodResolver(validateSchema),
  });

  const {
    register,
    formState: { isValid, isSubmitting },
    handleSubmit,
  } = methods;

  const { mutateAsync } = $riskApi.useMutation('post', '/v1/risk-rule');

  const onSubmit = async (data: ParameterValueFormModel) => {
    try {
      await mutateAsync({
        body: {
          effectiveDate: data.effectiveDate,
          value: Number(data.value),
          createdBy: 'user',
          ruleParamId: Number(rule?.id),
        },
      });
      await queryClient.invalidateQueries({
        queryKey: ['get', '/v1/risk-rule'],
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  if (!rule) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Add Parameter Value</Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>

            <Dialog.Body>
              <FormProvider {...methods}>
                <VStack gap={4} align="stretch">
                  <VStack align="start" gap={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">
                      Risk Rule
                    </Text>
                    <Text fontSize="md" color="gray.600">
                      {rule.definition}
                    </Text>
                  </VStack>

                  <VStack align="start" gap={2}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">
                      Value
                    </Text>
                    <Input
                      placeholder="Enter parameter value"
                      {...register('value')}
                      type="number"
                    />
                  </VStack>

                  <VStack align="start" gap={2}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">
                      Effective Date
                    </Text>
                    <Input
                      type="datetime-local"
                      {...register('effectiveDate')}
                    />
                  </VStack>
                </VStack>
              </FormProvider>
            </Dialog.Body>

            <Dialog.Footer>
              <HStack gap={2}>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="purple"
                  onClick={handleSubmit(onSubmit)}
                  disabled={!isValid}
                  loading={isSubmitting}
                >
                  Edit
                </Button>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default AddParamValueDialog;
