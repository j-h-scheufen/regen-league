import { useSession } from "@supabase/auth-helpers-react";
import { Paragraph } from "grommet";

import NewProjectForm from "../../components/project/NewProjectForm";

export default function NewProject() {
  const session = useSession();
  if (!session) return <Paragraph>Unauthorized</Paragraph>;

  return <NewProjectForm />;
}
