import React, {useCallback, useEffect} from "react";
import {Login, Menu as MenuIcon} from "grommet-icons";
import {Anchor, Box, Button, Grommet, Header, Heading, Layer, Main, Menu, Text} from 'grommet'
import {useRouter} from "next/router";
import {atom, useAtom, useAtomValue} from "jotai";
import {useSession, useSupabaseClient, useUser} from "@supabase/auth-helpers-react";

import {getUserProfile} from "../utils/supabase";
import {currentAvatarUrlAtom, currentUserProfileAtom} from "../state/global";
import ProfileAvatar from "./profile/ProfileAvatar";
import {globalTheme} from "./Styles";
import {Auth, ThemeSupa} from "@supabase/auth-ui-react";

type LayoutProps = React.PropsWithChildren<{
  title?: string
}>

const UserAvatar = () => {
    const url = useAtomValue(currentAvatarUrlAtom)
    const user = useUser()
    if (!user)
        return <Anchor href="/login"><Login size="medium" color="black"/></Anchor>
    else
        return <ProfileAvatar profileId={user.id} avatarURL={url} linkTo="/profile"/>
}

const showLoginAtom = atom<boolean>(false)

export default function Layout({ title = 'Regen League', children }: LayoutProps) {
    const router = useRouter()
    const session = useSession()
    const client = useSupabaseClient()
    const [currentProfile, setCurrentProfile] = useAtom(currentUserProfileAtom)
    const [showLogin, setShowLogin] = useAtom(showLoginAtom)

    const populateProfile = useCallback(async (userId: string) => {
        const profile = await getUserProfile(client, userId)
        if (profile) {
            setCurrentProfile(profile)
        }
    }, [client, setCurrentProfile])

    useEffect(() => {
        client.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                setCurrentProfile(null);
                router.push("/")
            }
            else if (event === 'SIGNED_IN' && session) {
                populateProfile(session.user.id).then(() => setShowLogin(false))
            }
        })
    }, [client, router, populateProfile, setCurrentProfile, setShowLogin])

    const menuItems = [
        { label: 'Hubs', onClick: () => {router.push("/hubs")} },
        { label: 'Projects', onClick: () => {router.push("/projects")} }
    ]
    if (session) {
        menuItems.push({
            label: 'Logout',
            onClick: () => client.auth.signOut()
        })
    }

    return (
        <Grommet theme={globalTheme}>
            <Box direction="column" flex>

                <Header justify="center">
                    <Box pad="medium" flex>
                        <Menu
                          label="Menu"
                          items={menuItems}>
                          <MenuIcon size="large"/>
                        </Menu>
                    </Box>
                    <Box width="50%">
                        <Heading size="medium" textAlign="center">Regen League</Heading>
                    </Box>
                    <Box pad="medium" flex>
                        {session ?
                            (<UserAvatar/>) :
                            (
                                <Button
                                    label={
                                        <Text color="white">
                                            <strong>Login</strong>
                                        </Text>
                                    }
                                    onClick={() => setShowLogin(true)}
                                    primary
                                    color="brand"
                                />
                            )
                        }
                    </Box>
                </Header>

                <Main
                    fill={false}
                    align="center"
                    overflow="auto"
                    justify="center"
                    direction="column"
                >
                  {children}
                </Main>

                {showLogin && !currentProfile && (
                    <Layer
                        id="loginDialogModal"
                        position="center"
                        onClickOutside={() => setShowLogin(false)}
                        onEsc={() => setShowLogin(false)}
                        animation="fadeIn"
                    >
                        <Box pad="medium">
                            <Auth
                                supabaseClient={client}
                                appearance={{ theme: ThemeSupa }}
                                theme="dark"
                            />
                        </Box>
                    </Layer>

                )}
            </Box>
        </Grommet>
  )
}
