import React, { useEffect, useRef, useState } from "react";

export const PopoversLeft: React.FC = () => {
  const [popoversOpen, setPopoversOpen] = useState(false);

  const trigger = useRef<HTMLButtonElement>(null);
  const popovers = useRef<HTMLDivElement>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent): void => {
      if (!popovers.current) return;
      if (
        !popoversOpen ||
        popovers.current.contains(target as Node) ||
        trigger.current?.contains(target as Node)
      ) {
        return;
      }
      setPopoversOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent): void => {
      if (!popoversOpen || keyCode !== 27) return;
      setPopoversOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="w-full px-4 sm:w-1/2 xl:w-1/4">
      <div className="mt-10 text-center sm:mb-60">
        <div className="relative inline-block">
          <button
            type="button"
            ref={trigger}
            onClick={() => setPopoversOpen(!popoversOpen)}
            className="inline-flex rounded-md bg-primary px-5 py-2.5 font-medium text-white"
          >
            Popover on Left
          </button>
          <div
            ref={popovers}
            onFocus={() => setPopoversOpen(true)}
            onBlur={() => setPopoversOpen(false)}
            className={`absolute right-full top-0 z-20 mr-3 w-max max-w-[311px] rounded bg-white drop-shadow-5 dark:bg-meta-4 ${
              popoversOpen === true ? "block" : "hidden"
            }`}
          >
            <span className="absolute -right-1.5 top-4 -z-10 size-4 rotate-45 rounded-sm bg-white dark:bg-meta-4" />
            <div className="border-b border-stroke p-3 dark:border-strokedark">
              <h4 className="text-center text-title-sm font-semibold text-black dark:text-white">
                Popover Title
              </h4>
            </div>
            <div className="px-5 py-4.5 text-center">
              <p className="font-medium">
                Lorem ipsum dolor sit amet, consect adipiscing elit. Mauris
                facilisis congue exclamate justo nec facilisis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
