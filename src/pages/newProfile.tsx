import CreateProfile from '../components/CreateProfile'
import { useAuthenticatedID } from '../hooks'
import {Box, Paragraph} from "grommet";

export default function NewProfile() {
  const did = useAuthenticatedID()
  if (did)
    return <CreateProfile did={did} />
  else
    return (<Box><Paragraph>Not authenticated</Paragraph></Box>)
}
