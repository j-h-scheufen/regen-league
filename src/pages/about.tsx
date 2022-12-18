import {useSupabaseClient, useUser} from "@supabase/auth-helpers-react";
import {Anchor, Box, Card, Text} from "grommet";
import {Auth, ThemeSupa} from "@supabase/auth-ui-react";
import {useRouter} from "next/router";
import {Github, Twitter} from "grommet-icons";
import React from "react";

export default function Login() {
  const user = useUser()
  const router = useRouter()

  if (user)
    router.push("/")

  const supabase = useSupabaseClient()

  return (
      <Box direction="row" pad="small" justify="between" gap="medium">
          <Card align="center" pad="medium">
              <Text>Follow along on Twitter</Text>
              <Anchor icon={<Twitter color="black"/>} href="https://twitter.com/regen_league" />
          </Card>
          <Card align="center" pad="medium">
              <Text>Contribute to the Regen League App</Text>
              <Anchor icon={<Github color="black"/>} href="https://github.com/j-h-scheufen/regen-league" />
          </Card>
      </Box>
  )

}