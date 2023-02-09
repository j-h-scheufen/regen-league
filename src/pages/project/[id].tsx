import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

import {
  getProjectData,
  getLinksForEntity,
  getRegionAssociations,
  getServerClient,
  getUserMembers,
  isUserEntityAdmin,
} from "../../utils/supabase";
import { currentProjectAtom, isProjectAdminAtom } from "../../state/project";
import ProjectMain from "../../components/project/ProjectMain";
import {
  linkDetailsAtom,
  memberDetailsAtom,
  regionAssociationsAtom,
} from "../../state/global";
import SuspenseSpinner from "../../components/utils/SuspenseSpinner";
import { Provider as JotaiProvider } from "jotai";
import { Suspense } from "react";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const projectId = ctx.params?.id as string;
  const { client, session } = await getServerClient(ctx);
  const projectData = await getProjectData(client, projectId);
  const associationsData = await getRegionAssociations(client, projectId);
  const membersData = await getUserMembers(client, projectId);
  const linksData = await getLinksForEntity(client, projectId);
  const isAdmin = session?.user
    ? await isUserEntityAdmin(client, session.user.id, projectId)
    : false;

  return {
    props: {
      key: projectId,
      project: projectData,
      members: membersData,
      links: linksData,
      regionAssociations: associationsData,
      isAdmin: isAdmin,
    },
  };
};

export default function ProjectPage({
  project,
  members,
  links,
  regionAssociations,
  isAdmin,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!project) throw Error("A hub is required for this component");

  const initialPageState = [
    [currentProjectAtom, project],
    [isProjectAdminAtom, isAdmin],
    [linkDetailsAtom, links],
    [regionAssociationsAtom, regionAssociations],
    [memberDetailsAtom, members],
  ] as const;

  return (
    <JotaiProvider initialValues={initialPageState}>
      <Suspense fallback={<SuspenseSpinner />}>
        {" "}
        {/* Required to avoid infinite loop with async atoms that were not preloaded */}
        <ProjectMain />
      </Suspense>
    </JotaiProvider>
  );
}
