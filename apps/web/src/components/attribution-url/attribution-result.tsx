import { showNotification } from '@denali/ui';
import React from 'react';

type AttributionResultProps = {
  generatedLink: string;
};

export const AttributionResult: React.FC<AttributionResultProps> = ({
  generatedLink,
}) => {
  const handleCopyLink = (): void => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink).catch(() => {});
      showNotification({
        title: 'Success',
        message: 'Operation completed successfully',
        type: 'success',
        bgColor: '#4CAF50',
      });
    }
  };

  return (
    <div className="mt-4.5">
      <label
        className="mb-2.5 block text-black dark:text-white"
        htmlFor="generated-link"
      >
        Generated Link:
      </label>
      <div className="flex items-center gap-3">
        <input
          type="text"
          id="generated-link"
          readOnly
          value={generatedLink}
          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        />
        <button
          onClick={handleCopyLink}
          className="flex justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
          type="button"
        >
          Copy
        </button>
      </div>
    </div>
  );
};
