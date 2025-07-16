import { zodResolver } from '@hookform/resolvers/zod';
import classNames from 'classnames';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import z from 'zod';

import type { NetSettlementBaseDto } from '@/shared/response';
import { InputField } from '@/ui/common';

type WriteOffProps = {
  mid: string;
  totalAmounts: {
    totalBalance: number;
    totalAmount: number;
    totalPending: number;
    totalWriteOff: number;
  };
  handleAction: (payload: Partial<NetSettlementBaseDto>) => Promise<void>;
};

const schema = z.object({
  mid: z.string(),
  amount: z.coerce.number().min(1, 'Amount must be at least 1'),
  note: z.string().min(5, 'Note must be at least 5 characters'),
  type: z.string(),
  totalBalance: z.number(),
});
// .refine((data) => data.amount <= Math.abs(data.totalBalance), {
//   message: 'Amount cannot be greater than the net balance',
//   path: ['amount'],
// });

type HandleActionType = z.infer<typeof schema>;

export const WriteOff: React.FC<WriteOffProps> = (props) => {
  const { mid, totalAmounts, handleAction } = props;
  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(schema),
    defaultValues: {
      mid,
      amount: 0,
      note: '',
      type: '',
      totalBalance: totalAmounts.totalBalance,
    },
  });

  const {
    register,
    reset,
    formState: { isValid, isSubmitting },
  } = methods;

  const onSubmit = async (data: HandleActionType): Promise<void> => {
    await handleAction(data);
    reset({
      mid,
      amount: 0,
      note: '',
      type: '',
      totalBalance: totalAmounts.totalBalance,
    });
  };

  const netSettlementActions = [
    { id: 1, name: 'Release', value: 'release' },
    { id: 2, name: 'Withdraw', value: 'withdraw' },
    { id: 3, name: 'Check received', value: 'apply' },
    { id: 4, name: 'Non risk write off', value: 'write off' },
    { id: 5, name: 'Risk write off', value: 'write off' },
    { id: 6, name: 'Check payment', value: 'transfer' },
    { id: 7, name: 'Transfer from check divert', value: 'transfer' },
    { id: 8, name: 'Transfer to another MID', value: 'transfer' },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <FormProvider {...methods}>
        <InputField
          name="amount"
          type="number"
          placeholder="Amount"
          isRequired
        />
        <InputField name="note" type="text" placeholder="Notes" isRequired />
        <select className="px-3 py-1.5 border rounded-md" {...register('type')}>
          <option value="">-- Please choose an action --</option>
          {netSettlementActions.map((action) => (
            <option key={action.id} value={action.id}>
              {action.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={!isValid || isSubmitting}
          className={classNames(
            ' text-white px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700',
            {
              'opacity-50 cursor-not-allowed': !isValid || isSubmitting,
            }
          )}
          onClick={methods.handleSubmit(onSubmit)}
        >
          Save
        </button>
      </FormProvider>
    </div>
  );
};
