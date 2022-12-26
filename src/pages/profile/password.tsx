import {Page} from "grommet";
import {GetServerSidePropsContext, InferGetServerSidePropsType} from 'next'

import {getServerClient, getUserProfile,} from "../../utils/supabase";
import PasswordForm, {Mode} from "../../components/profile/PasswordForm";
import {useRouter} from "next/router";

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
            userId: session.user.id,
            profile: profile,
        }
    }
}

export default function PasswordPage({userId, profile}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter()

    return (
        <Page align="center">
            <PasswordForm
                mode={Mode.CHANGE_PASSWORD}
                onCancel={() => {}}
                onSuccess={() => {}}/>
        </Page>
    )
}

