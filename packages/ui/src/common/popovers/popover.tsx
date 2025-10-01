'use client';

import type { FC, PropsWithChildren, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

type PopoverProps = {
  content: ReactNode;
  trigger?: 'click' | 'hover';
  className?: string;
  popoverClassName?: string;
};

export const Popover: FC<PropsWithChildren<PopoverProps>> = ({
  children,
  content,
  trigger = 'click',
  className = '',
  popoverClassName = '',
}) => {
  const [show, setShow] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleMouseOver = (): void => {
    if (trigger === 'hover') {
      setShow(true);
    }
  };

  const handleMouseLeave = (): void => {
    if (trigger === 'hover') {
      setShow(false);
    }
  };

  const handleClick = (): void => {
    if (trigger === 'click') {
      setShow((prev) => !prev);
    }
  };

   
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        wrapperRef.current &&
        event.target instanceof Node &&
        !wrapperRef.current.contains(event.target)
      ) {
        setShow(false);
      }
    };

    if (show && trigger === 'click') {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [show, trigger]);

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      className={`relative w-fit h-fit flex justify-center ${className}`}
    >
      <div aria-hidden="true" onClick={handleClick} className="w-fit h-fit">
        {children}
      </div>
      {show && (
        <div
          className={`min-w-fit w-[200px] h-fit absolute right-[100%] z-50 transition-all ${popoverClassName}`}
        >
          <div className="rounded bg-white p-3 shadow-[10px_30px_150px_rgba(46,38,92,0.25)] mb-[10px]">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};
