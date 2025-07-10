import React from 'react';

export type AutoSelectOption = { value: string | number; label: string };

type AutoSelectFieldProps = {
  id: string;
  label: string;
  options: AutoSelectOption[];
  required?: boolean;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
  disabled?: boolean;
  autoSelect?: boolean; // If true, auto-selects when only one option
};

export const AutoSelectField: React.FC<AutoSelectFieldProps> = ({
  id,
  label,
  options,
  required,
  error,
  value,
  onChange,
  loading,
  disabled,
  autoSelect = true,
}) => {
  // Auto-select logic
  React.useEffect(() => {
    if (autoSelect && !loading && options.length === 1) {
      const onlyOption = options[0];
      if (onlyOption && value !== onlyOption.value.toString()) {
        onChange(onlyOption.value.toString());
      }
    }
  }, [autoSelect, loading, options, value, onChange]);

  // Disable if: loading, explicitly disabled, or 0 or 1 options
  const isDisabled =
    disabled ||
    loading ||
    options.length === 0 ||
    (autoSelect && options.length === 1);
  const hasOptions = options.length > 0;

  let selectOptions: React.ReactNode;
  if (loading) {
    selectOptions = (
      <option value="" disabled>
        Loading…
      </option>
    );
  } else if (hasOptions) {
    selectOptions = (
      <>
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </>
    );
  } else {
    selectOptions = (
      <option value="" disabled>
        No options available
      </option>
    );
  }

  return (
    <div className="mb-4.5">
      <label htmlFor={id} className="mb-2.5 block text-black dark:text-white">
        {label}
        {required && <span className="text-meta-1">*</span>}
      </label>
      <div className="relative z-20 bg-transparent dark:bg-form-input">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isDisabled}
          className={`relative z-20 w-full appearance-none rounded border ${
            error ? 'border-danger' : 'border-stroke'
          } bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
            isDisabled ? 'cursor-not-allowed opacity-60' : ''
          }`}
        >
          {selectOptions}
        </select>

        {loading && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2">
            <span className="inline-block size-4 animate-spin rounded-full border-2 border-primary border-t-transparent align-middle" />
          </span>
        )}
        {error && <span className="text-sm text-danger">{error}</span>}
      </div>
    </div>
  );
};
