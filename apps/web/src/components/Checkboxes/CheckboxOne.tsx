import type { FC } from 'react';
import { useState } from 'react';

export const CheckboxOne: FC = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  return (
    <div>
      <label
        htmlFor="checkboxLabelOne"
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            type="checkbox"
            id="checkboxLabelOne"
            className="sr-only"
            onChange={() => {
              setIsChecked(!isChecked);
            }}
          />
          <div
            className={`mr-4 flex size-5 items-center justify-center rounded border ${
              isChecked && 'border-primary bg-gray dark:bg-transparent'
            }`}
          >
            <span
              className={`size-2.5 rounded-sm ${isChecked && 'bg-primary'}`}
            />
          </div>
        </div>
        Checkbox Text
      </label>
    </div>
  );
};
