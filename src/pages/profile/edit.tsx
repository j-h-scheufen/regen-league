import {Page, Text} from "grommet";
import {GetServerSidePropsContext, InferGetServerSidePropsType} from 'next'
import {useAtom} from "jotai";
import {useHydrateAtoms} from "jotai/utils";

import {
    getHubsForUser,
    getProjectsForUser,
    getServerClient,
    getUserProfile,
} from "../../utils/supabase";
import {currentUserProfile} from "../../utils/state";
import AvatarUpload from "../../components/profile/AvatarUpload";
import ProfileForm from "../../components/profile/ProfileForm";

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

export default function UserProfileEdit({ profile, hubs, projects }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    if(!profile)
        throw Error('This component requires a profile')
    useHydrateAtoms([[currentUserProfile, profile]] as const)
    const [currentProfile, setCurrentProfile] = useAtom(currentUserProfile)

    const refreshAfterAvatarChange = (filename: string, url: string) => {
        if (currentProfile) {
            currentProfile.avatarFilename = filename
            currentProfile.avatarURL = url
            setCurrentProfile(currentProfile)
        }
    }

    return (
        <Page direction="column" align="center">
            <AvatarUpload avatarURL={currentProfile?.avatarURL} onUpload={refreshAfterAvatarChange}/>
            <ProfileForm profile={currentProfile!}/>
        </Page>
    )
}

