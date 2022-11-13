import {GetServerSidePropsContext} from "next";
import HubForm from "../components/HubForm";

import {getServerClient, Hub} from "../utils/supabase";
import {Session, useSession} from "@supabase/auth-helpers-react";
import {User} from "@supabase/auth-helpers-nextjs";
import NewHubStep1 from "../components/NewHubStep1";
import {Paragraph} from "grommet";

export default function NewHub() {
  const session = useSession()
  if (!session) return <Paragraph>Unauthorized</Paragraph>

  return (
      <NewHubStep1/>
  )

}