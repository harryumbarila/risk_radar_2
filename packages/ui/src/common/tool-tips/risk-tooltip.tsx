import clsx from 'clsx';
import type { ReactNode } from 'react';
import React from 'react';

type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

type TooltipProps = {
  text: string;
  position?: TooltipPosition;
  tooltipClassName?: string;
  children: ReactNode;
};

const positionClasses: Record<TooltipPosition, string> = {
  top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
  right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
  left: 'right-full mr-2 top-1/2 -translate-y-1/2',
};

export const Tooltip: React.FC<TooltipProps> = ({
  text,
  position = 'left',
  tooltipClassName,
  children,
}) => {
  const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="relative group inline-block" aria-describedby={tooltipId}>
      {children}
      <div
        role="tooltip"
        id={tooltipId}
        className={clsx(
          'absolute z-20 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-4 shadow-lg transition-opacity duration-300 opacity-0 group-hover:opacity-100',
          positionClasses[position],
          tooltipClassName
        )}
      >
        {text}
      </div>
    </div>
  );
};
