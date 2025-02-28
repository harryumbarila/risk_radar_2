import React, { useEffect, useRef, useState } from 'react';

export const PopoversTwo: React.FC = () => {
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
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent): void => {
      if (!popoversOpen || keyCode !== 27) return;
      setPopoversOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke p-4 dark:border-strokedark sm:px-6 xl:px-7.5">
        <h3 className="font-medium text-black dark:text-white">
          Popover With Button
        </h3>
      </div>

      <div className="p-4 sm:p-5 xl:p-7.5">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 sm:w-1/2 xl:w-1/4">
            <div className="mb-60 mt-10">
              <div className="relative inline-block">
                <button
                  type="button"
                  ref={trigger}
                  onClick={() => setPopoversOpen(!popoversOpen)}
                  className="inline-flex rounded-md bg-primary px-5 py-2.5 font-medium text-white"
                >
                  Popover Text
                </button>
                <div
                  ref={popovers}
                  onFocus={() => setPopoversOpen(true)}
                  onBlur={() => setPopoversOpen(false)}
                  className={`absolute left-full top-0 z-20 ml-3 w-max max-w-[533px] rounded-md bg-white p-4 font-medium drop-shadow-5 dark:bg-meta-4 sm:p-5 xl:p-7.5 ${
                    popoversOpen === true ? 'block' : 'hidden'
                  }`}
                >
                  <span className="absolute -left-1 top-4 -z-10 size-2 rotate-45 rounded-r-sm bg-white dark:bg-meta-4" />
                  <h4 className="mb-4 text-title-md font-bold text-black dark:text-white">
                    Do you want to add this?
                  </h4>
                  <p className="font-medium">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Mauris facilisis congue justo nec facilisis. Quisque quis
                    augue ipsum. Aliquam suscipit dui ac dui commodo.
                  </p>
                  <p className="mt-4 font-medium">
                    Quisque quis augue ipsum. Aliquam suscipit dui ac dui.
                  </p>
                  <div className="mt-6 flex items-center gap-4">
                    <button
                      className="inline-block rounded bg-primary px-7.5 py-1 font-medium text-white hover:bg-opacity-90"
                      type="button"
                    >
                      Yes
                    </button>
                    <button
                      className="inline-block rounded bg-body px-7.5 py-1 font-medium text-white hover:bg-opacity-90"
                      type="button"
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
