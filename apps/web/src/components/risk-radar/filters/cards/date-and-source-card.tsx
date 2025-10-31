import type { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { SystemRadioSelect } from '@/components/risk-radar/filters/system-radio-select';
import { ViewAllExceptionsCheckbox } from '@/components/risk-radar/filters/view-all-exceptions-checkbox';
import type { SelectOption } from '@/shared/common';
import type { RiskRadarFilterState } from '@/shared/response';
import { DateInput } from '@/web/src/components/risk-radar/filters/date-input';

import { RiskRadarCard } from './card';

type DateAndSourceCardProps = {
  systems: SelectOption[];
};

export const DateAndSourceCard: FC<DateAndSourceCardProps> = ({ systems }) => {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<RiskRadarFilterState>();

  const startDate = watch('startDate');
  return (
    <RiskRadarCard>
      <div className="flex flex-row gap-2 w-full max-2xl:flex-col mb-4">
        <DateInput
          {...register('startDate', { required: 'Start date is required' })}
          label="Exception Start Date"
          className="w-1/2 max-2xl:w-full"
          error={errors.startDate?.message}
        />
        <DateInput
          {...register('endDate', {
            required: 'End date is required',
            min: {
              value: startDate,
              message: 'End date must be after start date',
            },
          })}
          label="Exception End Date"
          className="w-1/2 max-2xl:w-full"
          disabled={!startDate}
          min={startDate}
          error={errors.endDate?.message}
        />
      </div>

      <div className="flex flex-row gap-2 w-full xl:flex-col">
        <SystemRadioSelect
          control={control}
          name="processor"
          options={systems}
        />
      </div>

      <div className="mt-4">
        <ViewAllExceptionsCheckbox {...register('viewAllExceptions')} />
      </div>
    </RiskRadarCard>
  );
};
