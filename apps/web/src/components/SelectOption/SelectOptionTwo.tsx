'use client';

import React, { useState } from 'react';

type Option = {
  id: string;
  label: string;
};

const options: Option[] = [
  { id: 'Yes', label: 'Yes' },
  { id: 'No', label: 'No' },
  { id: 'Maybe', label: 'Maybe' },
];

export const SelectOptionTwo: React.FC = () => {
  const [isChecked, setIsChecked] = useState<string>('');

  const handleRadioChange = (value: string): void => {
    setIsChecked(value);
  };

  return (
    <div className="mb-5.5">
      <label
        htmlFor="recommend"
        className="mb-4.5 block text-sm font-medium text-black dark:text-white"
      >
        Would you recommend our site to a friend?
      </label>

      <div className="flex flex-col gap-2.5">
        {options.map((option) => (
          <div key={option.id}>
            <label className="relative flex cursor-pointer select-none items-center gap-2 text-sm font-medium text-black dark:text-white">
              <input
                className="sr-only"
                type="radio"
                name="recommend"
                id={option.id}
                onChange={() => handleRadioChange(option.id)}
              />
              <span
                className={`flex size-5 items-center justify-center rounded-full border ${
                  isChecked === option.id ? 'border-primary' : 'border-body'
                }`}
              >
                <span
                  className={`size-2.5 rounded-full bg-primary ${
                    isChecked === option.id ? 'flex' : 'hidden'
                  }`}
                />
              </span>
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
