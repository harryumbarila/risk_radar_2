import React from 'react';

type SubmitButtonProps = {
  canWrite: boolean;
  hasErrors: boolean;
};

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  canWrite,
  hasErrors,
}) => {
  const isDisabled = !canWrite || hasErrors;

  const buttonClassName = `flex w-full justify-center rounded p-3 font-medium text-gray ${
    !isDisabled
      ? 'bg-primary hover:bg-opacity-90'
      : 'bg-gray-400 cursor-not-allowed'
  }`;

  return (
    <button type="submit" className={buttonClassName} disabled={isDisabled}>
      Generate Link
    </button>
  );
};
