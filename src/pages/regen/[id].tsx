import {GetServerSidePropsContext} from "next";
import {Box, Card, CardHeader, Heading, List} from "grommet";
import {useRouter} from "next/router";

import {
    getHubsForUser,
    getProjectsForUser,
    getServerClient, MembershipItem,
    Profile,
} from "../../utils/supabase";


type PageProps = {
  profile: Profile
  hubs: Array<MembershipItem>
  projects: Array<MembershipItem>
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const profileId = ctx.params?.id as string
  const {client} = await getServerClient(ctx)

  const profilesResult = await client.from('profiles').select('*').eq('id', profileId).single()
  if (profilesResult.error) console.error('Unable to retrieve data for hub ID '+profileId+'. Error: '+profilesResult.error);

  const hubItems = await getHubsForUser(client, profileId)
  const projectItems = await getProjectsForUser(client, profileId)

  return {
    props: {
      profile: profilesResult.data || {},
      hubs: hubItems,
      projects: projectItems
    },
  }
}

export default function HubDetails({ profile, hubs, projects }: PageProps) {
    const router = useRouter()
  return (
      <Box width="large">
        <Box direction="row" alignSelf="center">
          <Heading size="medium" margin="small" alignSelf="center">{profile.username || profile.id}</Heading>
        </Box>
        <Card pad="small">
            <CardHeader pad="small">Hub Membership</CardHeader>
            <List data={hubs}
                  primaryKey="name"
                  secondaryKey="role"
                  onClickItem={(event: {item?: MembershipItem}) => { // @ts-ignore
                      router.push("/hub/"+event.item.id)}}/>
        </Card>
        <Card pad="small">
            <CardHeader pad="small">Project Membership</CardHeader>
            <List data={projects}
                  primaryKey="name"
                  secondaryKey="role"
                  onClickItem={(event: {item?: MembershipItem}) => { // @ts-ignore
                    router.push("/project/"+event.item.id)}}/>
        </Card>
      </Box>
  )

}