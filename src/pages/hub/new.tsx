
import {useSession} from "@supabase/auth-helpers-react";
import NewHubStep1 from "../../components/NewHubStep1";
import {Paragraph} from "grommet";

export default function NewHub() {
  const session = useSession()
  if (!session) return <Paragraph>Unauthorized</Paragraph>

  return (
      <NewHubStep1/>
  )

}