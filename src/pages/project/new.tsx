import {useSession} from "@supabase/auth-helpers-react";
import {Paragraph} from "grommet";
import NewProjectStep1 from "../../components/project/NewProjectStep1";

export default function NewProject() {
  const session = useSession()
  if (!session) return <Paragraph>Unauthorized</Paragraph>

  return (
      <NewProjectStep1/>
  )

}