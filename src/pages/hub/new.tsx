import {useSession} from "@supabase/auth-helpers-react";
import {Paragraph} from "grommet";

import NewHubStep1 from "../../components/hub/NewHubStep1";

export default function NewHub() {
  const session = useSession()
  if (!session) return <Paragraph>Unauthorized</Paragraph>

  return (
      <NewHubStep1/>
  )

}