import {Provider as JotaiProvider, useAtom} from 'jotai'
import {createBrowserSupabaseClient} from '@supabase/auth-helpers-nextjs'
import {SessionContextProvider, Session} from '@supabase/auth-helpers-react'

import '../styles/global.css'
import Layout from '../components/Layout'

import type {AppProps} from 'next/app'
import {useState} from "react";
import {useRouter} from "next/router";

export default function App({ Component, pageProps}: AppProps<{
    initialSession: Session,
}>) {

    const [client] = useState(() => createBrowserSupabaseClient())

    return (
        <JotaiProvider>
            <SessionContextProvider
                supabaseClient={client}
                initialSession={pageProps.initialSession}>
                <Layout>
                    <Component {...pageProps}/>
                </Layout>
            </SessionContextProvider>
        </JotaiProvider>
    )
}
