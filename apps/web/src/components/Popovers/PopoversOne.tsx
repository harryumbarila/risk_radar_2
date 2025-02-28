import React from "react";

import { PopoversBottom } from "./PopoversBottom";
import { PopoversLeft } from "./PopoversLeft";
import { PopoversRight } from "./PopoversRight";
import { PopoversTop } from "./PopoversTop";

export const PopoversOne: React.FC = () => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke p-4 dark:border-strokedark sm:px-6 xl:px-7.5">
        <h3 className="font-medium text-black dark:text-white">
          Popover in Four directions
        </h3>
      </div>

      <div className="p-4 sm:p-5 xl:p-7.5">
        <div className="-mx-4 flex flex-wrap justify-center">
          <PopoversBottom />
          <PopoversRight />
          <PopoversTop />
          <PopoversLeft />
        </div>
      </div>
    </div>
  );
};
