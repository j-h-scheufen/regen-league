import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { Box, Heading, Page } from "grommet";
import { useRouter } from "next/router";

import {
    getHubsForUser,
    getProjectsForUser,
    getServerClient,
    getUserProfile,
} from "../../utils/supabase";
import MembershipCard from "../../components/profile/MembershipCard";
import ProfileAvatar from "../../components/profile/ProfileAvatar";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const profileId = ctx.params?.id as string;
    const { client } = await getServerClient(ctx);

    const profile = await getUserProfile(client, profileId);
    const hubItems = await getHubsForUser(client, profileId);
    const projectItems = await getProjectsForUser(client, profileId);

    return {
        props: {
            profile: profile,
            hubs: hubItems,
            projects: projectItems,
        },
    };
};

export default function ProfilePage({
    profile,
    hubs,
    projects,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    if (!profile) throw new Error("This component requires a profile");
    return (
        <Page direction="column">
            <Box direction="column" alignSelf="center">
                <ProfileAvatar avatarURL={profile.avatarURL} size="large" />
                <Heading size="medium" margin="small" alignSelf="center">
                    {profile.username || profile.id}
                </Heading>
            </Box>
            <MembershipCard title="Hub Membership" subpage="hub" items={hubs} />
            <MembershipCard
                title="Project Membership"
                subpage="project"
                items={projects}
            />
        </Page>
    );
}
