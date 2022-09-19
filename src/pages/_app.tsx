import '../styles/global.css'
import { Provider as JotaiProvider } from 'jotai'
import type { AppProps } from 'next/app'

import Layout from '../components/Layout'
import RelayProvider from '../components/RelayProvider'

export default function App({ Component, pageProps }: AppProps) {

  return (
    <JotaiProvider>
      <RelayProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RelayProvider>
    </JotaiProvider>
  )
}
