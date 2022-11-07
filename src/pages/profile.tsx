import {Box, Paragraph} from "grommet";
import Account from '../components/Account'
import { User, createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSidePropsContext } from 'next'
import type { Profile } from '../components/Account'
import {Session} from "@supabase/auth-helpers-react";

type Props = {
    initialSession: Session
    user: User
    profile: Profile
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const supabase = createServerSupabaseClient(ctx)
    const {
        data: {session},
    } = await supabase.auth.getSession()

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    // Run queries with RLS on the server
    const {data} = await supabase.from('profiles').select('*')
    console.log('DATA: '+JSON.stringify(data))

    return {
        props: {
            initialSession: session,
            user: session.user,
            profile: data ? data[0] : {},
        },
    }
}

export default function Profile({ profile }: Props) {

        return (<Box><Account {...profile}/></Box>)
}

