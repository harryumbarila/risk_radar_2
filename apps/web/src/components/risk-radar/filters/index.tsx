import type { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import type { RiskRadarFilterState } from '@/shared/response';
import { useRiskRadarFilterStore } from '@/stores/risk-radar-filter';
import { useExceptionData } from '@/web/src/hooks/risk-radar/use-exception-data';

import { DateAndSourceCard } from './cards/date-and-source-card';
import { ExceptionTypeCard } from './cards/exception-type-card';
import { StatusAndOtherCard } from './cards/status-and-other-card';

export const RiskRadarFilters: FC<{
  onSubmit?: (data: RiskRadarFilterState) => void;
}> = ({ onSubmit }) => {
  const { data: exceptionData } = useExceptionData();
  const { filters } = useRiskRadarFilterStore();

  const exceptionTypes = exceptionData?.exception_type.map((type) => ({
    value: type.pk,
    label: type.sDesc,
  }));

  const riskUsers = exceptionData?.risk_user.map((user) => ({
    value: user.pkRiskRadarUser,
    label: user.sName,
  }));

  const statuses = exceptionData?.status.map((status) => ({
    value: status.pkRiskRadarExceptionStatus,
    label: status.sExceptionStatusDesc,
  }));

  const systems = exceptionData?.source_type.map((system) => ({
    value: system.pk,
    label: system.sName,
  }));

  const methods = useForm<RiskRadarFilterState>({
    defaultValues: filters,
    mode: 'onChange',
  });

  const handleSubmit = methods.handleSubmit((data) => {
    const modifiedData = { ...data };
    onSubmit?.(modifiedData);
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DateAndSourceCard systems={systems ?? []} />
          <ExceptionTypeCard exceptionTypes={exceptionTypes ?? []} />
          <StatusAndOtherCard
            users={riskUsers ?? []}
            statuses={statuses ?? []}
          />
        </div>
        <div className="mt-4 flex justify-center">
          <button
            className="inline-flex items-center justify-center rounded-lg border border-primary bg-primary px-4 py-2 text-white hover:bg-opacity-90"
            type="submit"
          >
            Search
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
