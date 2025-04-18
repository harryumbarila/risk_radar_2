import type { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { ExceptionTypesSelect } from '@/components/risk-radar/filters/exception-types';
import type { SelectOption } from '@/shared/common';
import type { RiskRadarFilterState } from '@/shared/response';

import { RiskRadarCard } from './card';

type Props = {
  exceptionTypes: SelectOption[];
};

export const ExceptionTypeCard: FC<Props> = ({ exceptionTypes }) => {
  const { control } = useFormContext<RiskRadarFilterState>();

  return (
    <RiskRadarCard>
      <ExceptionTypesSelect
        control={control}
        name="categories"
        options={exceptionTypes}
      />
    </RiskRadarCard>
  );
};
