import React from 'react';

type PopupProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export const Popup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-[1100px] relative">
        {/* Close Button */}
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Title */}
        {title && (
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {title}
          </h2>
        )}

        {/* Content */}
        <div className="mt-4">{children}</div>

        {/* Footer Buttons
        <div className="mt-6 flex justify-end space-x-3">
          <button
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-black dark:text-white"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
            onClick={onClose}
          >
            OK
          </button>
        </div> */}
      </div>
    </div>
  );
};
