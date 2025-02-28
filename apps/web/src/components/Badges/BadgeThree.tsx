import React from "react";

export const BadgeThree: React.FC = () => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke p-4 dark:border-strokedark sm:px-6 xl:px-7.5">
        <h3 className="font-medium text-black dark:text-white">
          Badge Style 3
        </h3>
      </div>

      <div className="p-4 sm:p-6 xl:p-10">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4.5">
          <button
            className="inline-flex rounded-full bg-primary px-3 py-1 text-sm font-medium text-white hover:bg-opacity-90"
            type="button"
          >
            Primary
          </button>
          <button
            className="inline-flex rounded-full bg-[#13C296] px-3 py-1 text-sm font-medium text-white hover:bg-opacity-90"
            type="button"
          >
            Secondary
          </button>
          <button
            className="inline-flex rounded-full bg-[#212B36] px-3 py-1 text-sm font-medium text-white hover:bg-opacity-90"
            type="button"
          >
            Dark
          </button>
          <button
            className="inline-flex rounded-full bg-[#637381] px-3 py-1 text-sm font-medium text-white hover:bg-opacity-90"
            type="button"
          >
            Gray
          </button>
          <button
            className="inline-flex rounded-full bg-[#EFEFEF] px-3 py-1 text-sm font-medium text-[#212B36] hover:bg-opacity-90"
            type="button"
          >
            Light
          </button>
          <button
            className="inline-flex rounded-full bg-[#F9C107] px-3 py-1 text-sm font-medium text-[#212B36] hover:bg-opacity-90"
            type="button"
          >
            Warning
          </button>
          <button
            className="inline-flex rounded-full bg-[#DC3545] px-3 py-1 text-sm font-medium text-white hover:bg-opacity-90"
            type="button"
          >
            Danger
          </button>
          <button
            className="inline-flex rounded-full bg-[#3CA745] px-3 py-1 text-sm font-medium text-white hover:bg-opacity-90"
            type="button"
          >
            Success
          </button>
          <button
            className="inline-flex rounded-full bg-[#3BA2B8] px-3 py-1 text-sm font-medium text-white hover:bg-opacity-90"
            type="button"
          >
            Info
          </button>
        </div>
      </div>
    </div>
  );
};
