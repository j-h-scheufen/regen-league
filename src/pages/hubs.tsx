import {Box, Button, Heading, List, Page, Text} from 'grommet'
import {Add as AddIcon, More} from 'grommet-icons'
import { GetServerSidePropsContext } from 'next'
import { User, createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Session } from "@supabase/auth-helpers-react"

import { getServerClient, Hub } from '../utils/supabase'
import Link from "next/link";
import {useRouter} from "next/router";
import HubsList from "../components/HubsList";

type PageProps = {
    session: Session
    hubs: Array<Hub>
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const {client, session} = await getServerClient(ctx)

    // Run queries with RLS on the server
    const {data, error} = await client.from('hubs').select('*')
    console.log('DATA: '+JSON.stringify(data))
    if (error) alert('Unable to retrieve hubs data. Error: '+error.message);

    return {
        props: {
            session: session,
            hubs: data ?? [],
        },
    }
}

export default function Hubs({ session, hubs }: PageProps) {
    return (
        <Page>
            <Box direction="row" justify="between">
                <Heading >Hubs</Heading>
                {session ? <Link href={"/newHub"} passHref>
                    <Button><AddIcon size="large"/></Button>
                </Link>: <Box/>}
            </Box>
            <HubsList hubs={hubs}/>
        </Page>
    )
}

