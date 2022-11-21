import {Box, Button, Page, Text} from "grommet";
import {GetServerSidePropsContext, InferGetServerSidePropsType} from 'next'
import {useAtom, useAtomValue} from "jotai";
import {useHydrateAtoms} from "jotai/utils";

import {
    getHubsForUser,
    getProjectsForUser,
    getServerClient,
    getUserProfile,
} from "../../utils/supabase";
import MembershipCard from "../../components/profile/MembershipCard";
import ProfileAttributesCard from "../../components/profile/ProfileAttributesCard";
import {currentUserProfile} from "../../utils/state";
import ProfileAvatar from "../../components/profile/ProfileAvatar";

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
    const hubItems = await getHubsForUser(client, session.user.id)
    const projectItems = await getProjectsForUser(client, session.user.id)

    return {
        props: {
            user: session.user,
            profile: profile,
            hubs: hubItems,
            projects: projectItems,
        }
    }
}

export default function CurrentUserProfile({ profile, hubs, projects }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    if(!profile)
        throw Error('This component requires a profile')
    useHydrateAtoms([[currentUserProfile, profile]] as const)
    const currentProfile = useAtomValue(currentUserProfile)

    return (
        <Page direction="column">
            <ProfileAvatar profileId={currentProfile?.id} avatarURL={currentProfile?.avatarURL} size="large"/>
            <Box>
                <ProfileAttributesCard profile={currentProfile!}/>
                <MembershipCard title="My Hubs" subpage="hub" items={hubs}/>
                <MembershipCard title="My Projects" subpage="project" items={projects}/>
                <Button label="Edit" href="/profile/edit" style={{textAlign: 'center'}}/>
            </Box>
        </Page>
    )
}

