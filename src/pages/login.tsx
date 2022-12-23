import {useSupabaseClient, useUser} from "@supabase/auth-helpers-react";
import {Box} from "grommet";
import {Auth, ThemeSupa, ThemeMinimal} from "@supabase/auth-ui-react";
import {useRouter} from "next/router";

export default function Login() {
  const user = useUser()
  const router = useRouter()

  if (user)
    router.push("/")

  const supabase = useSupabaseClient()

  return (
      <Box align="center" direction="column" pad="medium">
          <Auth supabaseClient={supabase} appearance={{ theme: ThemeMinimal }} theme="dark"/>
      </Box>
  )

}