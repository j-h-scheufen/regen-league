import {GetServerSidePropsContext} from "next";
import {Session} from "@supabase/auth-helpers-react";
import {User} from "@supabase/auth-helpers-nextjs";
import {Avatar, Box, Heading, Text} from "grommet";
import {User as UserIcon, Cluster as ClusterIcon} from "grommet-icons";

import HubForm from "../../components/HubForm";
import {getServerClient, Hub} from "../../utils/supabase";
import {bool} from "prop-types";

type Member = {
  userId: string, username: string, avatarImage: string, roleName: string, avatarURL: string,
}

type PageProps = {
  hub: Hub
  members: Array<Member>
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
  if (membersResult.error) console.error('Unable to retrieve data for hub members '+hubId+'. Error: '+membersResult.error.message);

  let newMembers:Array<Member> = new Array<Member>()
  // Reformat the DB result for members to add the avatar public URL
  if (membersResult.data) {
    console.log('DB RESULT: '+JSON.stringify(membersResult.data))
    // BUG: the Supabase function returns duplicates that must be removed (workaround)
    const seen: Map<string, boolean> = new Map<string, boolean>()
    newMembers = membersResult.data.flatMap((dbMember) => {
      if (!seen.get(dbMember.user_id)) {
        const newItem: Member = {
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
  console.log('MEMBERS:'+JSON.stringify(newMembers))

  return {
    props: {
      hub: hubsResult.data ? hubsResult.data[0] : {},
      members: newMembers
    },
  }
}


export default function HubDetails({ hub, members }: PageProps) {

  return (
      <Box>
        <Box direction="row" alignSelf="center">
          <Heading size="medium" margin="small" alignSelf="center">{hub.name}</Heading>
        </Box>
        <Box direction="row" gap="small">
          <Text size="large" margin="medium">Members:</Text>
          {members.map((member) => {
            if (member.avatarURL)
              return (<Avatar key={member.userId} src={member.avatarURL} size="medium" margin="small"/>)
            else
              return (<Avatar ><UserIcon/></Avatar>)
          })}
        </Box>
        <HubForm {...hub}/>
      </Box>
  )

}