import {Box, Button, Heading, Page} from 'grommet'
import {Add as AddIcon} from 'grommet-icons'
import {GetServerSidePropsContext} from 'next'
import {Session } from "@supabase/auth-helpers-react"

import {getHubs, getServerClient} from '../utils/supabase'
import Link from "next/link";
import HubsList from "../components/HubsList";
import {Hub} from "../utils/types";

type PageProps = {
    session: Session
    hubs: Array<Hub>
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const {client, session} = await getServerClient(ctx)

    const hubs = await getHubs(client)

    return {
        props: {
            session: session,
            hubs: hubs,
        },
    }
}

export default function Hubs({ session, hubs }: PageProps) {
    return (
        <Page>
            <Box direction="row" justify="between">
                <Heading >Hubs</Heading>
                {session ? <Link href={"/hub/new"} passHref>
                    <Button><AddIcon size="large"/></Button>
                </Link>: <Box/>}
            </Box>
            <HubsList hubs={hubs}/>
        </Page>
    )
}

