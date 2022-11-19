import {Avatar, Box, Page} from "grommet";
import {User as UserIcon} from 'grommet-icons'
import { GetServerSidePropsContext } from 'next'

import {getHubsForUser, getProjectsForUser, getServerClient, getUserProfile} from "../../utils/supabase";
import Account from '../../components/profile/Account'
import {MembershipItem, Profile} from "../../utils/types";
import MembershipCard from "../../components/profile/MembershipCard";
import {User} from "@supabase/auth-helpers-react";
import ProfileAttributesCard from "../../components/profile/ProfileAttributesCard";

type PageProps = {
    user: User,
    profile: Profile,
    hubs: Array<MembershipItem>,
    projects: Array<MembershipItem>
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
    const hubItems = await getHubsForUser(client, session.user.id)
    const projectItems = await getProjectsForUser(client, session.user.id)

    return {
        props: {
            user: session.user,
            profile: profile,
            hubs: hubItems,
            projects: projectItems
        }
    }
}

export default function CurrentUserProfile({ profile, hubs, projects }: PageProps) {

        return (
            <Page direction="column">
                <Box pad="medium" align="center">
                    {profile.avatarURL ?
                        <Avatar size="xlarge" src={profile.avatarURL}></Avatar> :
                        <Avatar size="xlarge"><UserIcon/></Avatar>}
                </Box>
                <ProfileAttributesCard profile={profile}/>
                <MembershipCard title="Hub Membership" subpage="hub" items={hubs}/>
                <MembershipCard title="Project Membership" subpage="project" items={projects}/>
            </Page>
        )
}

