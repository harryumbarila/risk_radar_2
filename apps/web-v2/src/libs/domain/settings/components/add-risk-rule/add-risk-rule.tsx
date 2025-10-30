'use client';
import { useState } from 'react';
import { Button, Input, VStack, HStack, Text, Portal } from '@chakra-ui/react';
import { Dialog } from '@chakra-ui/react';

interface RiskRule {
  id: string;
  definition: string;
  source: { definition: string };
  ruleType: { definition: string; code: string };
}

interface AddParamValueDialogProps {
  isOpen: boolean;
  onClose: () => void;
  rule: RiskRule | null;
}

const AddParamValueDialog = ({
  isOpen,
  onClose,
  rule,
}: AddParamValueDialogProps) => {
  const [value, setValue] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');

  const handleSubmit = () => {
    // TODO: Implement API call to save param value
    console.log('Saving param value:', {
      ruleId: rule?.id,
      value,
      effectiveDate,
    });

    // Reset form and close
    setValue('');
    setEffectiveDate('');
    onClose();
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
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    type="number"
                  />
                </VStack>

                <VStack align="start" gap={2}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    Effective Date
                  </Text>
                  <Input
                    type="date"
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                  />
                </VStack>
              </VStack>
            </Dialog.Body>

            <Dialog.Footer>
              <HStack gap={2}>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="purple"
                  onClick={handleSubmit}
                  disabled={!value || !effectiveDate}
                >
                  Save
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
