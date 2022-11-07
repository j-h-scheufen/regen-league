import '../styles/global.css'
import { Provider as JotaiProvider } from 'jotai'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import {useState} from "react";

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'

export default function App({ Component, pageProps }: AppProps<{
    initialSession: Session,
}>) {

    const [supabaseClient] = useState(() => createBrowserSupabaseClient())

    return (
        <JotaiProvider>
            <SessionContextProvider
                supabaseClient={supabaseClient}
                initialSession={pageProps.initialSession}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </SessionContextProvider>
        </JotaiProvider>
    )
}
