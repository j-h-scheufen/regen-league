import {GetServerSidePropsContext} from "next";
import {Box, Card, CardHeader, Heading, List} from "grommet";
import {useRouter} from "next/router";

import {getHubsForUser, getProjectsForUser, getServerClient, getUserProfile} from "../../utils/supabase";
import {MembershipItem, Profile} from "../../utils/types";
import MembershipCard from "../../components/profile/MembershipCard";


type PageProps = {
  profile: Profile,
  hubs: Array<MembershipItem>,
  projects: Array<MembershipItem>
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const profileId = ctx.params?.id as string
  const {client} = await getServerClient(ctx)

  const profile = await getUserProfile(client, profileId)
  const hubItems = await getHubsForUser(client, profileId)
  const projectItems = await getProjectsForUser(client, profileId)

  return {
    props: {
      profile: profile,
      hubs: hubItems,
      projects: projectItems
    },
  }
}

export default function ProfilePage({ profile, hubs, projects }: PageProps) {
    const router = useRouter()
  return (
      <Box width="large">
        <Box direction="row" alignSelf="center">
          <Heading size="medium" margin="small" alignSelf="center">{profile.username || profile.id}</Heading>
        </Box>
        <MembershipCard title="Hub Membership" subpage="hub" items={hubs}/>
        <MembershipCard title="Project Membership" subpage="project" items={projects}/>
      </Box>
  )

}