import '@mantine/core/styles.css';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import ThemeProvider from '../theme/ThemeProvider';

type NextPageWithLayout = NextPage & {
  // eslint-disable-next-line no-unused-vars
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

interface MyAppProps extends AppProps {
  Component: NextPageWithLayout;
}

export default function App({ Component, pageProps }: MyAppProps) {
  const getLayout = Component.getLayout ?? ((page): JSX.Element => page);
  return (
    <ThemeProvider>
      <Head>
        <title>Regen Link</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>
      {getLayout(<Component {...pageProps} />)}
    </ThemeProvider>
  );
}
