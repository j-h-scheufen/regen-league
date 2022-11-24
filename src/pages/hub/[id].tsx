import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import {Box, Button, Heading, Page} from "grommet";
import {atom, useAtom, useAtomValue} from "jotai";
import {useCallback, useEffect} from "react";

import {
  getBioregionData, getHubData,
  getHubMembersData,
  getLinksData,
  getServerClient,
  isUserHubAdmin
} from "../../utils/supabase";
import {useSupabaseClient, useUser} from "@supabase/auth-helpers-react";
import LinksCard from "../../components/LinksCard";
import HubAttributesCard from "../../components/hub/HubAttributesCard";
import MembersCard from "../../components/MembersCard";
import RegionInfoCard from "../../components/RegionInfoCard";
import {useHydrateAtoms} from "jotai/utils";
import {currentHubAtom, editAtom, isHubAdminAtom} from "../../state/hub";
import HubForm from "../../components/hub/HubForm";


export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const hubId = ctx.params?.id as string
  const {client, session} = await getServerClient(ctx)
  const hubData = await getHubData(client, hubId)
  const bioregionData = hubData?.bioregionId ? await getBioregionData(client, hubData.bioregionId) : null
  const membersData = await getHubMembersData(client, hubId);
  const linksData = await getLinksData(client, hubId)
  const isAdmin = session?.user ? await isUserHubAdmin(client, session.user.id, hubId) : false

  return {
    props: {
      hub: hubData,
      members: membersData,
      links: linksData,
      regionInfo: bioregionData,
      isHubAdmin: isAdmin,
    }
  }
}

export default function HubDetails({ hub, members, links, regionInfo, isHubAdmin }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!hub)
    throw Error("A hub is required for this component")
  useHydrateAtoms([[currentHubAtom, hub], [isHubAdminAtom, isHubAdmin]] as const)
  const [currentHub, setCurrentHub] = useAtom(currentHubAtom)
  const isAdmin = useAtomValue(isHubAdminAtom)
  const [edit, setEdit] = useAtom(editAtom)

  return (
      <Page align="center">
        {edit ? (
            <Box width="large">
              {/*Manage Members*/}
              {/*Manage Regional Info*/}
              <HubForm
                  hub={hub}
                  onSubmit={() => setEdit(false)}
                  onCancel={() => setEdit(false)}/>
              {/*Add Links*/}
            </Box>
        ) : (
            <Box width="large">
              <Box direction="row" alignSelf="center">
                <Heading size="medium" margin="small" alignSelf="center">{currentHub!.name}</Heading>
              </Box>
              <MembersCard members={members}/>
              {regionInfo && <RegionInfoCard info={regionInfo}/>}
              <HubAttributesCard hub={currentHub!}/>
              <LinksCard links={links}/>
              {isAdmin && <Button
                            label="Edit"
                            style={{textAlign: 'center'}}
                            onClick={() => setEdit(true)}
                            margin={{top: "medium"}}/>}
            </Box>

        )}
      </Page>
  )

}