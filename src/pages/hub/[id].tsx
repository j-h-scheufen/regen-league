import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import {Box, Heading} from "grommet";
import {useAtom} from "jotai";
import {useCallback, useEffect} from "react";

import {
  getBioregionData, getHubData,
  getHubMembersData,
  getLinksData,
  getServerClient,
  isUserHubAdmin
} from "../../utils/supabase";
import {useSupabaseClient, useUser} from "@supabase/auth-helpers-react";
import {isHubAdminAtom} from "../../utils/state";
import LinksCard from "../../components/LinksCard";
import HubAttributesCard from "../../components/hub/HubAttributesCard";
import MembersCard from "../../components/MembersCard";
import RegionInfoCard from "../../components/RegionInfoCard";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const hubId = ctx.params?.id as string
  const {client, session} = await getServerClient(ctx)

  const hubData = await getHubData(client, hubId)
  const bioregionData = hubData?.bioregionId ? await getBioregionData(client, hubData.bioregionId) : null
  const membersData = await getHubMembersData(client, hubId);
  const linksData = await getLinksData(client, hubId)

  return {
    props: {
      hub: hubData,
      members: membersData,
      links: linksData,
      regionInfo: bioregionData,
    }
  }
}

export default function HubDetails({ hub, members, links, regionInfo }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const user = useUser()
  const client = useSupabaseClient()
  const [isHubAdmin, setIsHubAdmin] = useAtom(isHubAdminAtom)
  const authorizeHubAdmin = useCallback(async () => {
    let isAdmin = false
    if (user) {
      isAdmin = await isUserHubAdmin(client, user.id, hub.id)
    }
    setIsHubAdmin(isAdmin)
  }, [client, user, hub, isUserHubAdmin])

  useEffect(() => {
    authorizeHubAdmin()
  }, [user, hub])

  return (
      <Box width="large">
        <Box direction="row" alignSelf="center">
          <Heading size="medium" margin="small" alignSelf="center">{hub.name}</Heading>
        </Box>
        <MembersCard members={members}/>
        <RegionInfoCard info={regionInfo}/>
        <HubAttributesCard hub={hub}/>
        <LinksCard links={links}/>
      </Box>
  )

}