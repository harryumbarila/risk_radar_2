import type { AppProps } from 'next/app';
import Head from 'next/head';
import type { FC } from 'react';

import FullPageLayout from '@/layout/FullPageLayout';

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>App</title>
      </Head>
      <FullPageLayout>
        <Component {...pageProps} />
      </FullPageLayout>
    </>
  );
};

export default App;
