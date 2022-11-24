import React, {useCallback, useEffect} from "react";
import {Github, Menu as MenuIcon, Twitter, Login, User as UserIcon} from "grommet-icons";
import {
    Anchor,
    Box,
    Grommet,
    Header,
    Heading,
    Main,
    Menu,
    Nav,
    type ThemeType,
    Text
} from 'grommet'
import {useRouter} from "next/router";
import {useAtom, useAtomValue} from "jotai";
import {useSession, useSupabaseClient, useUser} from "@supabase/auth-helpers-react";

import {getUserProfile} from "../utils/supabase";
import {currentAvatarUrl, currentUserProfile} from "../utils/state";
import ProfileAvatar from "./profile/ProfileAvatar";

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

const UserAvatar = () => {
    const url = useAtomValue(currentAvatarUrl)
    const user = useUser()
    if (!user)
        return <Anchor href="/login"><Login size="medium" color="black"/></Anchor>
    else
        return <ProfileAvatar profileId={user.id} avatarURL={url} linkTo="/profile"/>
}

export default function Layout({ title = 'Regen League', children }: LayoutProps) {
    const router = useRouter()
    const session = useSession()
    const supabase = useSupabaseClient()
    const [currentProfile, setCurrentProfile] = useAtom(currentUserProfile)

    const populateProfile = useCallback(async () => {
        if (session && !currentProfile) {
            const profile = await getUserProfile(supabase, session!.user.id)
            if (profile) {
                setCurrentProfile(profile)
            }
        }
    }, [session, supabase, setCurrentProfile])

    useEffect(() => {
        populateProfile()
    }, [session])

    const menuItems = [
        { label: 'Hubs', onClick: () => {router.push("/hubs")} },
        { label: 'Projects', onClick: () => {router.push("/projects")} }
    ]
    if (session) {
        menuItems.push({ label: 'Logout', onClick: () => {supabase.auth.signOut(); setCurrentProfile(null); router.push("/")} })
    }

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
                        <UserAvatar/>
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
