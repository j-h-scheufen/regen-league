import {GetServerSidePropsContext} from "next";
import {Box, Heading} from "grommet";

import {getServerClient, Project} from "../../utils/supabase";
import LinksCard from "../../components/LinksCard";
import MembersCard from "../../components/MembersCard";
import ProjectAttributesCard from "../../components/ProjectAttributesCard";
import {atom} from "jotai";
import {LinkDetails, MemberDetails} from "../../utils/types";

type PageProps = {
  project: Project
  members: Array<MemberDetails>
  links: Array<LinkDetails>
}

const isAdminAtom = atom<boolean>(false)

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const projectId = ctx.params?.id as string
  const {client} = await getServerClient(ctx)

  const projectsResult = await client.from('projects').select('*').eq('id', projectId).single()
  if (projectsResult.error) console.error('Unable to retrieve data for hub ID '+projectId+'. Error: '+projectsResult.error.message);

  const membersResult = await client.rpc('get_project_members', {project_id: projectId})
  if (membersResult.error) console.error('Unable to retrieve members for hub '+projectId+'. Error: '+membersResult.error.message);

  const linksResult = await client.from('links').select('*, link_types(name)').eq('owner_id', projectId)
  if (linksResult.error) console.error('Unable to retrieve links for hub '+projectId+'. Error: '+linksResult.error.message);

  // Reformat the DB result for members to add the avatar public URL
  let formattedMembers:Array<MemberDetails> = new Array<MemberDetails>()
  if (membersResult.data) {
    // console.log('DB RESULT: '+JSON.stringify(membersResult.data))
    // BUG: the Supabase function returns duplicates that must be removed (this is a workaround)
    const seen: Map<string, boolean> = new Map<string, boolean>()
    formattedMembers = membersResult.data.flatMap((dbMember) => {
      if (!seen.get(dbMember.user_id)) {
        const newItem: MemberDetails = {
          userId: dbMember.user_id,
          username: dbMember.username,
          avatarImage: dbMember.avatar_image,
          roleName: dbMember.role_name,
          avatarURL: ''
        }
        if (dbMember.avatar_image) {
          const urlResult = client.storage.from('avatars').getPublicUrl(dbMember.avatar_image)
          newItem.avatarURL = urlResult.data.publicUrl
        }
        seen.set(dbMember.user_id, true)
        return [newItem]
      }
      return []
    })
  }

  let formattedLinks: Array<LinkDetails> = new Array<LinkDetails>()
  if (linksResult.data) {
    formattedLinks = linksResult.data.map((dbLink) => {
      return {url: dbLink.url, type: dbLink.link_types.name}
    })
  }

  // console.log('PROJECTS: '+JSON.stringify(projectsResult.data))

  return {
    props: {
      project: projectsResult.data,
      members: formattedMembers,
      links: formattedLinks
    },
  }
}

export default function HubDetails({ project, members, links }: PageProps) {

  return (
      <Box width="large">
        <Box direction="row" alignSelf="center">
          <Heading size="medium" margin="small" alignSelf="center">{project.name}</Heading>
        </Box>
        <MembersCard members={members}/>
        <ProjectAttributesCard project={project}/>
        <LinksCard links={links}/>
      </Box>
  )

}