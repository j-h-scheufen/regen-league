import {Box, Page, Paragraph} from "grommet";
import { GetServerSidePropsContext } from 'next'
import { User } from '@supabase/auth-helpers-nextjs'
import { Session } from "@supabase/auth-helpers-react";

import {getServerClient, getUserProfile} from "../../utils/supabase";
import Account from '../../components/profile/Account'
import {Profile} from "../../utils/types";

type PageProps = {
    user: User
    profile: Profile
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const {client, session} = await getServerClient(ctx)
    if (!session?.user) {
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
            user: session.user,
            profile: profile,
        }
    }
}

export default function ProfilePage({ profile }: PageProps) {

        return (
            <Page direction="column">

                <Account {...profile}/>
            </Page>
        )
}

