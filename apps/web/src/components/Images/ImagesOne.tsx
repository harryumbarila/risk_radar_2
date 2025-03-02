import Image from 'next/image';
import React, { useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import ImageResize from '@/js/image-resize';

export const ImagesOne: React.FC = () => {
  useEffect(() => {
    ImageResize();
  });
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke p-4 dark:border-strokedark sm:px-6 xl:px-7.5">
        <h3 className="font-medium text-black dark:text-white">
          Responsive image
        </h3>
      </div>

      <div className="p-4 sm:p-6 xl:p-10">
        <div className="relative">
          <div id="pane" className="overflow-hidden">
            <Image
              src="/images/cover/cover-02.jpg"
              width={1374}
              height={520}
              alt="Cover"
            />
          </div>
          <div
            id="ghostpane"
            className="absolute left-0 top-0 duration-300 ease-in-out"
          />
        </div>
      </div>
    </div>
  );
};
