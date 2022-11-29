import {Provider as JotaiProvider, useAtom, useAtomValue} from 'jotai'
import {createBrowserSupabaseClient} from '@supabase/auth-helpers-nextjs'
import {SessionContextProvider, Session} from '@supabase/auth-helpers-react'

import '../styles/global.css'
import Layout from '../components/Layout'

import type {AppProps} from 'next/app'
import {Suspense, useState} from "react";
import {epaCatalogAtom, linkTypesAtom, oneEarthCatalogAtom} from "../state/global";

export default function App({ Component, pageProps}: AppProps<{
    initialSession: Session,
}>) {

    const [client] = useState(() => createBrowserSupabaseClient())

    const GlobalStatePreloader = () => {
        // place async atoms here that you want to load early
        useAtomValue(linkTypesAtom)
        useAtomValue(oneEarthCatalogAtom)
        useAtomValue(epaCatalogAtom)
        return null
    }

    return (
        <JotaiProvider>
            <Suspense fallback={"Loading ..."}> {/* Needed to avoid infinite loop with async atoms that were not preloaded */}
                <GlobalStatePreloader/>
                <SessionContextProvider
                    supabaseClient={client}
                    initialSession={pageProps.initialSession}>
                    <Layout>
                        <Component {...pageProps}/>
                    </Layout>
                </SessionContextProvider>
            </Suspense>
        </JotaiProvider>
    )
}
