import { Box, Paragraph } from "grommet";
import { GetServerSidePropsContext } from 'next'
import { User } from '@supabase/auth-helpers-nextjs'
import { Session } from "@supabase/auth-helpers-react";

import { getServerClient, Profile } from "../utils/supabase";
import Account from '../components/Account'

type PageProps = {
    initialSession: Session
    user: User
    profile: Profile
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

    const {data, error} = await client.from('profiles').select('*').single() // uses policy
    if (error)
        console.error('Unable to retrieve profile data for user ID '+session.user?.id+'. Error: '+error.message);

    return {
        props: {
            initialSession: session,
            user: session.user,
            profile: data || {},
        },
    }
}

export default function ProfileDetails({ profile }: PageProps) {

        return (<Box><Account {...profile}/></Box>)
}

