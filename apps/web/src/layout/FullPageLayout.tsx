import type { FC, PropsWithChildren } from 'react';

const FullPageLayout: FC<PropsWithChildren> = ({ children }) => {
  return <div className="h-screen w-screen">{children}</div>;
};

export default FullPageLayout;
