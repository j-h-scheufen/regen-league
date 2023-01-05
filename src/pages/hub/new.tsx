import {useSession} from "@supabase/auth-helpers-react";
import {Paragraph} from "grommet";

import NewHubForm from "../../components/hub/NewHubForm";

export default function NewHub() {
  const session = useSession()
  if (!session) return <Paragraph>Unauthorized</Paragraph>

  return (
      <NewHubForm/>
  )

}