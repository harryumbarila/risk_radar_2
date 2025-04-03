import React, { useEffect } from 'react';

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
  // Add body overflow control to prevent scrolling behind the popup
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-[9999]"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
      }}
    >
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-[1100px] max-h-[90vh] overflow-auto"
      >
        {/* Close Button */}
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-xl font-bold"
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
