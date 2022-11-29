import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import {Box, Button, Heading, Page} from "grommet";
import {useAtom, Provider as JotaiProvider} from "jotai";
import {useHydrateAtoms} from "jotai/utils";

import {
  getHubData,
  getHubMembersData,
  getLinksData,
  getServerClient,
  isUserHubAdmin,
  getRegionAssociations
} from "../../utils/supabase";
import {currentHubAtom, isHubAdminAtom} from "../../state/hub";
import HubMain from "../../components/hub/HubMain";
import {linkDetailsAtom, membersAtom, regionAssociationsAtom} from "../../state/global";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const hubId = ctx.params?.id as string
  const {client, session} = await getServerClient(ctx)
  const hubData = await getHubData(client, hubId)
  const associationsData = await getRegionAssociations(client, hubId)
  const membersData = await getHubMembersData(client, hubId);
  const linksData = await getLinksData(client, hubId)
  const isAdmin = session?.user ? await isUserHubAdmin(client, session.user.id, hubId) : false

  return {
    props: {
      hub: hubData,
      members: membersData,
      links: linksData,
      regionAssociations: associationsData,
      isHubAdmin: isAdmin,
    }
  }
}

export default function HubPage({ hub, members, links, regionAssociations, isHubAdmin }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!hub)
    throw Error("A hub is required for this component")

  const initialPageState = [
      [currentHubAtom, hub],
      [isHubAdminAtom, isHubAdmin],
      [linkDetailsAtom, links],
      [regionAssociationsAtom, regionAssociations],
      [membersAtom, members]] as const;

  return (
      <JotaiProvider initialValues={initialPageState}>
        <HubMain/>
      </JotaiProvider>
  )
}