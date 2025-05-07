import type { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { DbaOrSicInput } from '@/components/risk-radar/filters/dba-or-sic-input';
import { MIDInput } from '@/components/risk-radar/filters/mid-input';
import { StatusSelect } from '@/components/risk-radar/filters/status-select';
import { UserSelect } from '@/components/risk-radar/filters/user-select';
import type { SelectOption } from '@/shared/common';
import type { RiskRadarFilterState } from '@/shared/response';

import { RiskRadarCard } from './card';

type Props = {
  statuses: SelectOption[];
  users: SelectOption[];
};

export const StatusAndOtherCard: FC<Props> = ({ statuses, users }) => {
  const { control, register, watch } = useFormContext<RiskRadarFilterState>();

  const status = watch('status');

  return (
    <RiskRadarCard>
      <div className="flex flex-col">
        <div className="space-y-3">
          <StatusSelect control={control} options={statuses} />
          {/* TODO: Use a status enum */}
          {String(status) === '4' && (
            <UserSelect {...register('assignedToUser')} options={users} />
          )}
        </div>

        <div className="relative mb-5">
          <div className="absolute inset-x-0 top-1/2 flex translate-y-1/2 items-center justify-center">
            <div className="absolute inset-x-0 h-px" />
            <span className="relative z-10 bg-white px-2 text-sm font-medium text-black dark:bg-boxdark dark:text-white">
              OR
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <MIDInput {...register('merchantId')} />
          <DbaOrSicInput {...register('dbaNameOrSIC')} />
        </div>
      </div>
    </RiskRadarCard>
  );
};
