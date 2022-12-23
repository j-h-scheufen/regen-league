import {Provider as JotaiProvider, useAtom, useAtomValue} from 'jotai'
import {createBrowserSupabaseClient} from '@supabase/auth-helpers-nextjs'
import {SessionContextProvider, Session, useSupabaseClient} from '@supabase/auth-helpers-react'
import type {AppProps} from 'next/app'
import {Suspense, useCallback, useState} from "react";
import "mapbox-gl/dist/mapbox-gl.css"

import '../styles/global.css'
import Layout from '../components/Layout'
import {
    currentUserProfileAtom,
    customCatalogAtom,
    epaCatalogAtom,
    linkTypesAtom,
    oneEarthCatalogAtom,
    rolesAtom
} from "../state/global";
import SuspenseSpinner from "../components/utils/SuspenseSpinner";
import {getUserProfile} from "../utils/supabase";

export default function App({ Component, pageProps}: AppProps<{
    initialSession: Session,
}>) {

    const [client] = useState(() => createBrowserSupabaseClient())

    const GlobalStatePreloader = () => {
        // place async atoms here that you want to load early
        useAtomValue(linkTypesAtom)
        useAtomValue(rolesAtom)
        useAtomValue(oneEarthCatalogAtom)
        useAtomValue(epaCatalogAtom)
        useAtomValue(customCatalogAtom)
        return null
    }

    return (
        <JotaiProvider>
            <Suspense fallback={<SuspenseSpinner/>}> {/* Required to avoid infinite loop with async atoms that were not preloaded */}
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
