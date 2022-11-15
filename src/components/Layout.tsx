import React from "react";
import {Github, Menu as MenuIcon, Twitter} from "grommet-icons";
import {Anchor, Box, Button, Grommet, Header, Heading, Main, Menu, Nav, type ThemeType} from 'grommet'
import {useRouter} from "next/router";
import {useSession, useSupabaseClient, useUser} from "@supabase/auth-helpers-react";
import {black} from "colors";

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
        { label: 'Logout', onClick: () => {supabase.auth.signOut(); router.push("/")} },
    ]) : ([
        { label: 'Hubs', onClick: () => {router.push("/hubs")} },
        { label: 'Login', onClick: () => {router.push("/")} },
    ])

    return (
        <Grommet theme={theme}>
            <Box direction="column" flex>
                <Header justify="between">
                    <Box pad="medium">
                        <Menu
                          label="Menu"
                          items={menuItems}>
                          <MenuIcon size="large"/>
                        </Menu>
                    </Box>
                    <Heading size="medium">Regen League</Heading>
                    <Nav direction="row">
                        <Anchor icon={<Github color="black"/>} href="https://github.com/j-h-scheufen/regen-league" />
                        <Anchor icon={<Twitter color="black"/>} href="https://twitter.com/regen_league" />
                    </Nav>
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
