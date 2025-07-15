import { zodResolver } from '@hookform/resolvers/zod';
import classNames from 'classnames';
import React from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

import type { NetSettlementBaseDto } from '@/shared/response';

type WriteOffProps = {
  mid: string;
  handleAction: (payload: Partial<NetSettlementBaseDto>) => Promise<void>;
};

const schema = z.object({
  mid: z.string(),
  amount: z.coerce.number().min(1),
  note: z.string(),
  type: z.string(),
});
export const WriteOff: React.FC<WriteOffProps> = (props) => {
  const { mid, handleAction } = props;
  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(schema),
    defaultValues: {
      mid,
      amount: 0,
      note: '',
      type: '',
    },
  });

  const {
    register,
    formState: { isValid },
  } = methods;

  const netSettlementActions = [
    { id: 1, name: 'Release', value: 'release' },
    { id: 2, name: 'Withdraw', value: 'withdraw' },
    { id: 3, name: 'Check received', value: 'received' },
    { id: 4, name: 'Non risk write off', value: 'write off' },
    { id: 5, name: 'Risk write off', value: 'write off' },
    { id: 6, name: 'Check payment', value: 'transfer' },
    { id: 7, name: 'Transfer from check divert', value: 'transfer' },
    { id: 8, name: 'Transfer to another MID', value: 'transfer' },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <input
        type="number"
        placeholder="Amount"
        className="border px-3 py-2 rounded-md"
        {...register('amount')}
      />
      <input
        type="text"
        placeholder="Notes"
        className="border px-3 py-2 rounded-md"
        {...register('note')}
      />
      <select className="px-3 py-1.5 border rounded-md" {...register('type')}>
        <option value="">-- Please choose an action --</option>
        {netSettlementActions.map((action) => (
          <option key={action.id} value={action.value}>
            {action.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        className={classNames(
          ' text-white px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700',
          {
            'opacity-50 cursor-not-allowed': !isValid,
          }
        )}
        onClick={methods.handleSubmit(handleAction)}
      >
        Save
      </button>
    </div>
  );
};
