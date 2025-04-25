import classNames from 'classnames';
import React from 'react';

type SubmitButtonProps = {
  isLoading?: boolean;
  isDisabled?: boolean;
};

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isLoading,
  isDisabled,
}) => {
  return (
    <button
      type="submit"
      className={classNames(
        'flex w-full justify-center rounded p-3 font-medium text-gray bg-primary hover:bg-opacity-90',
        {
          'bg-gray-400 cursor-not-allowed opacity-50 pointer-events-none':
            isDisabled || isLoading,
        }
      )}
      disabled={isDisabled}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
      ) : (
        'Generate Link'
      )}
    </button>
  );
};
