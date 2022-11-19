import {Provider as JotaiProvider, useAtom} from 'jotai'
import {createBrowserSupabaseClient} from '@supabase/auth-helpers-nextjs'
import {SessionContextProvider, Session} from '@supabase/auth-helpers-react'

import '../styles/global.css'
import Layout from '../components/Layout'
import {currentUserProfile, supabaseClient} from "../utils/state";

import type {AppProps} from 'next/app'
import {getUserProfile} from "../utils/supabase";

export default function App({ Component, pageProps }: AppProps<{
    initialSession: Session,
}>) {

    const client = createBrowserSupabaseClient()

    return (
        <JotaiProvider initialValues={[[supabaseClient, client]]}>
            <SessionContextProvider
                supabaseClient={client}
                initialSession={pageProps.initialSession}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </SessionContextProvider>
        </JotaiProvider>
    )
}
