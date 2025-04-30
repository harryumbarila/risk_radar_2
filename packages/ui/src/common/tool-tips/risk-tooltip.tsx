import clsx from 'clsx';
import React, { useState } from 'react';

type TooltipProps = {
  text: string;
  tooltipClassName?: string;
  children: React.ReactNode;
};

export const Tooltip: React.FC<TooltipProps> = ({
  text,
  children,
  tooltipClassName,
}) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className={clsx('relative inline-block', tooltipClassName)}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute z-20 left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-4 py-1 text-sm text-white bg-gray-800 rounded shadow-lg">
          {text}
        </div>
      )}
    </div>
  );
};
