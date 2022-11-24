import {Box, Button, Heading, Page} from "grommet";
import {GetServerSidePropsContext, InferGetServerSidePropsType} from 'next'
import {atom, useAtom, useAtomValue} from "jotai";
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
import AvatarUpload from "../../components/profile/AvatarUpload";
import ProfileForm from "../../components/profile/ProfileForm";

export const editAtom = atom<boolean>(false)

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const editMode = ctx.query.hasOwnProperty('edit')
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
            editMode: editMode,
        }
    }
}

export default function CurrentUserProfile({ profile, hubs, projects, editMode }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    if(!profile)
        throw Error('This component requires a profile')
    useHydrateAtoms([[currentUserProfile, profile], [editAtom, editMode]] as const)
    const [currentProfile, setCurrentProfile] = useAtom(currentUserProfile)
    const [edit, setEdit] = useAtom(editAtom)

    const refreshAfterAvatarChange = (filename: string, url: string) => {
        if (currentProfile) {
            currentProfile.avatarFilename = filename
            currentProfile.avatarURL = url
            setCurrentProfile(currentProfile)
        }
    }

    return (
        <Page direction="column" align="center">
            {edit ? (
                <Box>
                    <AvatarUpload avatarURL={currentProfile?.avatarURL} onUpload={refreshAfterAvatarChange}/>
                    <ProfileForm
                        profile={currentProfile!}
                        onSubmit={() => setEdit(false)}
                        onCancel={() => setEdit(false)}/>
                </Box>
            ) : (
                <Box>
                    <Box direction="column" alignSelf="center">
                        <ProfileAvatar profileId={currentProfile?.id} avatarURL={currentProfile?.avatarURL} size="large"/>
                        <Heading size="medium" margin="small" alignSelf="center">{profile.username || profile.id}</Heading>
                    </Box>
                    <Box>
                        <ProfileAttributesCard profile={currentProfile!}/>
                        <MembershipCard title="My Hubs" subpage="hub" items={hubs}/>
                        <MembershipCard title="My Projects" subpage="project" items={projects}/>
                        <Button label="Edit" style={{textAlign: 'center'}} onClick={() => setEdit(true)}/>
                    </Box>
                </Box>
            )}
        </Page>
    )
}

