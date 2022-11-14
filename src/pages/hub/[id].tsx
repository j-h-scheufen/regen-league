import {GetServerSidePropsContext} from "next";
import {Avatar, Box, Heading, Text} from "grommet";
import {User as UserIcon, Cluster as ClusterIcon} from "grommet-icons";

import HubForm from "../../components/HubForm";
import {getServerClient, Hub} from "../../utils/supabase";
import LinksCard, {LinkDetails} from "../../components/LinksCard";
import MembersCard, {MemberDetails} from "../../components/MembersCard";
import HubAttributesCard from "../../components/HubAttributesCard";

type PageProps = {
  hub: Hub
  members: Array<MemberDetails>
  links: Array<LinkDetails>
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const hubId = ctx.params?.id
  const {client, session} = await getServerClient(ctx)
  if (!hubId || !session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const hubsResult = await client.from('hubs').select('*').eq('id', hubId)
  if (hubsResult.error) console.error('Unable to retrieve data for hub ID '+hubId+'. Error: '+hubsResult.error.message);

  const membersResult = await client.rpc('get_hub_members', {hub_id: hubId})
  if (membersResult.error) console.error('Unable to retrieve members for hub '+hubId+'. Error: '+membersResult.error.message);

  const linksResult = await client.from('links').select('*, link_types(name)').eq('owner_id', hubId)
  if (linksResult.error) console.error('Unable to retrieve links for hub '+hubId+'. Error: '+linksResult.error.message);
  console.log('DB RESULT: '+JSON.stringify(linksResult.data))

  // Reformat the DB result for members to add the avatar public URL
  let formattedMembers:Array<MemberDetails> = new Array<MemberDetails>()
  if (membersResult.data) {
    //console.log('DB RESULT: '+JSON.stringify(membersResult.data))
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

  console.log('LINKS: '+JSON.stringify(formattedLinks))

  return {
    props: {
      hub: hubsResult.data ? hubsResult.data[0] : {},
      members: formattedMembers,
      links: formattedLinks
    },
  }
}

export default function HubDetails({ hub, members, links }: PageProps) {

  return (
      <Box width="large">
        <Box direction="row" alignSelf="center">
          <Heading size="medium" margin="small" alignSelf="center">{hub.name}</Heading>
        </Box>
        <MembersCard members={members}/>
        <HubAttributesCard hub={hub}/>
        <LinksCard links={links}/>
      </Box>
  )

}