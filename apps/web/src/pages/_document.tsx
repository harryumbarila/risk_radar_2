import type { NextPage } from 'next';
import { Head, Html, Main, NextScript } from 'next/document';

const AppDocument: NextPage = () => {
  return (
    <Html lang="en">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default AppDocument;
