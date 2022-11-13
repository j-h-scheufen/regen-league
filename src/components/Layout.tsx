import React from "react";
import {Menu as MenuIcon} from "grommet-icons";
import {Box, Button, Grommet, Header, Heading, Main, Menu, type ThemeType} from 'grommet'
import {useRouter} from "next/router";
import {useSession, useSupabaseClient, useUser} from "@supabase/auth-helpers-react";

const theme: ThemeType = {
  global: {
    font: {
      family: 'RobotoRegular',
      size: '18px',
      height: '20px',
    },
  },
}

type LayoutProps = React.PropsWithChildren<{
  title?: string
}>

export default function Layout({ title = 'Regen League', children }: LayoutProps) {
    const router = useRouter()
    const session = useSession()
    const supabase = useSupabaseClient()



    const menuItems = session ? ([
        { label: 'My Profile', onClick: () => {router.push("/profile")} },
        { label: 'Hubs', onClick: () => {router.push("/hubs")} },
        { label: 'Logout', onClick: () => {supabase.auth.signOut()} },
    ]) : ([
        { label: 'Hubs', onClick: () => {router.push("/hubs")} },
    ])

    return (
        <Grommet theme={theme}>
            <Box direction="column" flex>
                <Header justify="stretch">
                    <Box pad="medium">
                        <Menu
                          label="Menu"
                          items={menuItems}>
                          <MenuIcon size="large"/>
                        </Menu>
                    </Box>
                    <Heading size="medium">Regen League</Heading>
                </Header>

                <Main
                    // flex
                    pad="medium"
                    fill={false}
                    align="center"
                    overflow="auto"
                    justify="center"
                    direction="column">
                  {children}
                </Main>
            </Box>
        </Grommet>
  )
}
