import {Box, Heading, List, Text} from 'grommet'
import { More } from 'grommet-icons'
import { GetServerSidePropsContext } from 'next'
import { User, createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Session } from "@supabase/auth-helpers-react"

import { getServerClient, Hub } from '../hooks/supabase'
import Link from "next/link";
import {useRouter} from "next/router";
import HubsList from "../components/HubsList";

type PageProps = {
    initialSession: Session
    user: User
    hubs: Array<Hub>
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const {client, session} = await getServerClient(ctx)
    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    // Run queries with RLS on the server
    const {data, error} = await client.from('organizations').select('*')
    console.log('DATA: '+JSON.stringify(data))
    if (error) alert('Unable to retrieve organizations data. Error: '+error.message);

    return {
        props: {
            initialSession: session,
            user: session.user,
            hubs: data ?? [],
        },
    }
}

export default function Hubs({ user, hubs }: PageProps) {
        const router = useRouter()

        return (
            <Box>
                <Heading>Organizations</Heading>
                <HubsList hubs={hubs}/>
            </Box>)
}

