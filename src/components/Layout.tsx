import React, {useCallback, useEffect} from "react";
import {Github, Menu as MenuIcon, Twitter, Login, User as UserIcon} from "grommet-icons";
import {
    Anchor,
    Avatar,
    Box,
    Grommet,
    Header,
    Heading,
    Main,
    Menu,
    Nav,
    type ThemeType,
    Tip
} from 'grommet'
import {useRouter} from "next/router";
import {useAtom} from "jotai";
import {Session, useSession, useSupabaseClient} from "@supabase/auth-helpers-react";

import {getUserProfile} from "../utils/supabase";
import {currentUserProfile} from "../utils/state";

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

const UserAvatar = ({session}: {session: Session | null}) => {
    const [currentProfile] = useAtom(currentUserProfile)
    if (!session)
        return <Tip content="Login / Signup"><Anchor href="/login"><Login size="medium"/></Anchor></Tip>
    if (currentProfile?.avatarURL)
        return <Anchor href="/profile"><Avatar src={currentProfile.avatarURL}/></Anchor>
    else
        return <Anchor href="/profile"><Avatar><UserIcon/></Avatar></Anchor>
}

export default function Layout({ title = 'Regen League', children }: LayoutProps) {
    const router = useRouter()
    const session = useSession()
    const supabase = useSupabaseClient()
    const [currentProfile, setCurrentProfile] = useAtom(currentUserProfile)

    const populateProfile = useCallback(async () => {
        if (session && !currentProfile) {
            const profile = await getUserProfile(supabase, session!.user.id)
            setCurrentProfile(profile)
        }
    }, [session, supabase, setCurrentProfile])

    useEffect(() => {
        populateProfile()
    }, [session])

    const menuItems = session ? ([
        { label: 'My Profile', onClick: () => {router.push("/profile")} },
        { label: 'Hubs', onClick: () => {router.push("/hubs")} },
        { label: 'Projects', onClick: () => {router.push("/projects")} },
        { label: 'Logout', onClick: () => {supabase.auth.signOut(); router.push("/")} },
    ]) : ([
        { label: 'Hubs', onClick: () => {router.push("/hubs")} },
        { label: 'Projects', onClick: () => {router.push("/projects")} },
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
                    <Box pad="medium">
                        <UserAvatar session={session}/>
                    </Box>
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
