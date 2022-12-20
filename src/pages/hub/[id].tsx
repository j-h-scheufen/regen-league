import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import {Provider as JotaiProvider} from "jotai";
import {Suspense} from "react";

import {
    getHubData,
    getLinksData,
    getServerClient,
    getRegionAssociations,
    getProjectsForHub,
    getUserMembers,
    isUserEntityAdmin
} from "../../utils/supabase";
import {currentHubAtom, hubProjectsAtom, isHubAdminAtom} from "../../state/hub";
import HubMain from "../../components/hub/HubMain";
import {linkDetailsAtom, memberDetailsAtom, regionAssociationsAtom} from "../../state/global";
import SuspenseSpinner from "../../components/utils/SuspenseSpinner";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const hubId = ctx.params?.id as string
    const {client, session} = await getServerClient(ctx)
    const hubData = await getHubData(client, hubId)
    const associationsData = await getRegionAssociations(client, hubId)
    const membersData = await getUserMembers(client, hubId);
    const linksData = await getLinksData(client, hubId)
    const projects = await getProjectsForHub(client, hubId)
    const isAdmin = session?.user ? await isUserEntityAdmin(client, session.user.id, hubId) : false

    console.log('ADMIN: ', isAdmin)

    return {
        props: {
            key: hubId,
            hub: hubData,
            members: membersData,
            links: linksData,
            regionAssociations: associationsData,
            projects: projects,
            isAdmin: isAdmin,
        }
    }
}

export default function HubPage({ hub, members, links, regionAssociations, projects, isAdmin }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!hub)
    throw Error("A hub is required for this component")

  const initialPageState = [
      [currentHubAtom, hub],
      [isHubAdminAtom, isAdmin],
      [linkDetailsAtom, links],
      [regionAssociationsAtom, regionAssociations],
      [hubProjectsAtom, projects],
      [memberDetailsAtom, members]] as const;

  return (
      <JotaiProvider initialValues={initialPageState}>
          <Suspense fallback={<SuspenseSpinner/>}> {/* Required to avoid infinite loop with async atoms that were not preloaded */}
              <HubMain/>
          </Suspense>
      </JotaiProvider>
  )
}