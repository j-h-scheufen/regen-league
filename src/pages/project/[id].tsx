import {GetServerSidePropsContext} from "next";
import {atom} from "jotai";
import {Box, Heading} from "grommet";

import {getLinksData, getProjectData, getProjectMembersData, getServerClient} from "../../utils/supabase";
import LinksCard from "../../components/LinksCard";
import MembersCard from "../../components/MembersCard";
import ProjectAttributesCard from "../../components/project/ProjectAttributesCard";
import {LinkDetails, MemberDetails, Project} from "../../utils/types";

type PageProps = {
  project: Project
  members: Array<MemberDetails>
  links: Array<LinkDetails>
}

const isAdminAtom = atom<boolean>(false)

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const projectId = ctx.params?.id as string
  const {client} = await getServerClient(ctx)

  const projectData = await getProjectData(client, projectId)
  const membersData = await getProjectMembersData(client, projectId)
  const linksData = await getLinksData(client, projectId)

  return {
    props: {
      project: projectData,
      members: membersData,
      links: linksData
    },
  }
}

export default function HubDetails({ project, members, links }: PageProps) {

  return (
      <Box width="large">
        <Box direction="row" alignSelf="center">
          <Heading size="medium" margin="small" alignSelf="center">{project.name}</Heading>
        </Box>
        <MembersCard/>
        <ProjectAttributesCard project={project}/>
        <LinksCard/>
      </Box>
  )

}