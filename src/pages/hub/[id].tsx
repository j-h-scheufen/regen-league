import {GetServerSidePropsContext} from "next";
import HubForm from "../../components/HubForm";

import {getServerClient, Hub} from "../../hooks/supabase";
import {Session} from "@supabase/auth-helpers-react";
import {User} from "@supabase/auth-helpers-nextjs";

type PageProps = {
  initialSession: Session
  user: User
  hub: Hub
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

  const {data, error} = await client.from('organizations').select('*').eq('id', hubId)

  if (error) console.error('Unable to retrieve data for hub ID '+hubId+'. Error: '+error.message);

  return {
    props: {
      initialSession: session,
      user: session.user,
      hub: data ? data[0] : {},
    },
  }
}


export default function HubDetails({ hub }: PageProps) {

  return (
      <HubForm {...hub}/>
  )

}