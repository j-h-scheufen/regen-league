import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import {Box, Button, Heading, Page} from "grommet";
import {Provider as JotaiProvider, useAtom, useAtomValue, useSetAtom} from "jotai";

import {
  getHubData,
  getHubMembersData,
  getLinksData,
  getServerClient,
  isUserHubAdmin,
  getRegionAssociations
} from "../../utils/supabase";
import LinksCard from "../../components/LinksCard";
import HubAttributesCard from "../../components/hub/HubAttributesCard";
import MembersCard from "../../components/MembersCard";
import RegionInfoCard from "../../components/RegionInfoCard";
import {useHydrateAtoms, useUpdateAtom} from "jotai/utils";
import {currentHubAtom, currentHubLinks, currentHubRegionInfo, editAtom, isHubAdminAtom} from "../../state/hub";
import HubForm from "../../components/hub/HubForm";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const hubId = ctx.params?.id as string
  const {client, session} = await getServerClient(ctx)
  const hubData = await getHubData(client, hubId)
  const regionAssociations = await getRegionAssociations(client, hubId)
  const membersData = await getHubMembersData(client, hubId);
  const linksData = await getLinksData(client, hubId)
  const isAdmin = session?.user ? await isUserHubAdmin(client, session.user.id, hubId) : false

  return {
    props: {
      hub: hubData,
      members: membersData,
      links: linksData,
      regions: regionAssociations,
      isHubAdmin: isAdmin,
    }
  }
}

export default function HubDetails({ hub, members, links, regions, isHubAdmin }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!hub)
    throw Error("A hub is required for this component")

  const initialPageState = [
      [currentHubAtom, hub],
      [isHubAdminAtom, isHubAdmin],
      [currentHubLinks, links],
      [currentHubRegionInfo, regions]] as const;
  useHydrateAtoms(initialPageState)

  const [currentHub, setCurrentHub] = useAtom(currentHubAtom)
  setCurrentHub(hub)
  const [currentLinks, setCurrentLinks] = useAtom(currentHubLinks)
  setCurrentLinks(links)
  const [currentRegions, setCurrentRegions] = useAtom(currentHubRegionInfo)
  setCurrentRegions(regions)
  const [isAdmin, setIsAdmin] = useAtom(isHubAdminAtom)
  setIsAdmin(isHubAdmin)
  const [edit, setEdit] = useAtom(editAtom)

  return (
      <Page align="center">
        {edit ? (
            <Box width="large">
              {/*Manage Members*/}
              <HubForm
                  hub={currentHub!}
                  onSubmit={() => setEdit(false)}
                  onCancel={() => setEdit(false)}/>
              {/*Manage Regional Info*/}
              <LinksCard
                  links={currentLinks}
                  linkOwner={hub.id}
                  editMode={edit}
                  onUpdate={(newLinks) => setCurrentLinks(newLinks)}/>
            </Box>
        ) : (
            <Box width="large">
              <Box direction="row" alignSelf="center">
                <Heading size="medium" margin="small" alignSelf="center">{currentHub!.name}</Heading>
              </Box>
              <MembersCard members={members}/>
              <HubAttributesCard hub={currentHub!}/>
              <RegionInfoCard associations={currentRegions}/>
              <LinksCard links={currentLinks}/>
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