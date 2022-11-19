import { Box, Paragraph } from "grommet";
import { GetServerSidePropsContext } from 'next'
import { User } from '@supabase/auth-helpers-nextjs'
import { Session } from "@supabase/auth-helpers-react";

import {getServerClient, getUserProfile} from "../utils/supabase";
import Account from '../components/Account'
import {Profile} from "../utils/types";

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

    const profile = await getUserProfile(client, session.user.id)

    return {
        props: {
            initialSession: session,
            user: session.user,
            profile: profile,
        },
    }
}

export default function ProfileDetails({ profile }: PageProps) {

        return (<Box><Account {...profile}/></Box>)
}

