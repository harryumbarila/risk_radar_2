import type { FC, InputHTMLAttributes } from 'react';
import type { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { RiskRadarFilterState } from '@/shared/response';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> & {
  options: { value: number; label: string }[];
  name: keyof RiskRadarFilterState;
  control: Control<RiskRadarFilterState>;
  rules?: Record<string, unknown>;
  error?: string;
  label?: string;
};

export const SystemRadioSelect: FC<Props> = ({
  options,
  name,
  control,
  rules,
  error,
  label,
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <div>
          <div className="mb-5">
            {label ? (
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="system"
              >
                {label}
              </label>
            ) : null}
            <div className="flex gap-6.5 flex-wrap">
              {options.map((o) => (
                <div key={o.value} className="flex items-center">
                  <input
                    {...field}
                    {...props}
                    type="radio"
                    value={o.value}
                    id={`${name}-${o.value}`}
                    className="size-4 border-gray-300 text-primary focus:ring-primary"
                    checked={field.value === o.value}
                    onChange={() => field.onChange(o.value)}
                  />
                  <label
                    htmlFor={`${name}-${o.value}`}
                    className="ml-2 text-sm text-black dark:text-white"
                  >
                    {o.label}
                  </label>
                </div>
              ))}
            </div>
            {(error || fieldState.error) && (
              <p className="mt-1 text-sm text-red-500">
                {error || fieldState.error?.message}
              </p>
            )}
          </div>
        </div>
      )}
    />
  );
};
