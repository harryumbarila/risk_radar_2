import React, { useState } from 'react';

type TooltipProps = {
  text: string;
  children: React.ReactNode;
};

export const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-4 py-1 text-sm text-white bg-gray-800 rounded shadow-lg">
          {text}
        </div>
      )}
    </div>
  );
};
