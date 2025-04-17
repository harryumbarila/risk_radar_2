import type { FC, PropsWithChildren } from 'react';

type Props = {
  title?: string;
};

export const RiskRadarCard: FC<PropsWithChildren<Props>> = ({
  children,
  title,
}) => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark h-full">
      {/* Title */}
      <div className="h-full flex flex-col flex-grow">
        {title ? (
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">{title}</h3>
          </div>
        ) : null}

        {/* Content */}
        <div className="p-6.5 pt-7 flex-grow">{children}</div>
      </div>
    </div>
  );
};
