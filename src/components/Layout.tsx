import React, { useCallback, useEffect, useRef } from "react";
import { User as UserIcon, HelpOption } from "grommet-icons";
import {
  Anchor,
  Box,
  Button,
  Drop,
  Grommet,
  Header,
  Heading,
  Layer,
  Main,
  List,
  Text,
} from "grommet";
import { useRouter } from "next/router";
import { atom, useAtom } from "jotai";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

import { getUserProfile } from "../utils/supabase";
import { currentUserProfileAtom } from "../state/global";
import { globalTheme } from "./Styles";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";

type LayoutProps = React.PropsWithChildren<{
  title?: string;
}>;

type UserMenuItem = {
  label: string;
  onClick: () => void;
};

const showLoginAtom = atom<boolean>(false);
const loginEnabledAtom = atom<boolean>(false);
const showUserMenuAtom = atom<boolean>(false);

export default function Layout({
  title = "Regen League",
  children,
}: LayoutProps) {
  const router = useRouter();
  const session = useSession();
  const client = useSupabaseClient();
  const [currentProfile, setCurrentProfile] = useAtom(currentUserProfileAtom);
  const [showLogin, setShowLogin] = useAtom(showLoginAtom);
  const [loginEnabled, setLoginEnabled] = useAtom(loginEnabledAtom);
  const userMenuRef = useRef<HTMLAnchorElement | null>(null);

  const populateProfile = useCallback(
    async (userId: string) => {
      const profile = await getUserProfile(client, userId);
      if (profile) {
        setCurrentProfile(profile);
      }
    },
    [client, setCurrentProfile]
  );

  useEffect(() => {
    client.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setCurrentProfile(null);
        router.push("/");
      } else if (event === "SIGNED_IN" && session) {
        populateProfile(session.user.id).then(() => setShowLogin(false));
      }
    });
    setLoginEnabled(true);
  }, [
    client,
    router,
    populateProfile,
    setCurrentProfile,
    setShowLogin,
    setLoginEnabled,
  ]);

  const menuItems: Array<UserMenuItem> = [
    {
      label: "Add a Hub",
      onClick: () => {
        router.push("/hub/new");
      },
    },
    {
      label: "Add a Project",
      onClick: () => {
        router.push("/project/new");
      },
    },
    {
      label: "My Profile",
      onClick: () => {
        router.push("/profile");
      },
    },
    { label: "Logout", onClick: () => client.auth.signOut() },
  ];

  const UserMenu = () => {
    const [showUserMenu, setShowUserMenu] = useAtom(showUserMenuAtom);
    return (
      <Box margin={{ right: "xsmall" }}>
        <Anchor ref={userMenuRef} onClick={() => setShowUserMenu(true)}>
          <UserIcon />
        </Anchor>
        {showUserMenu && userMenuRef.current && (
          <Drop
            target={userMenuRef.current}
            align={{ top: "bottom", right: "right" }}
            onClickOutside={() => setShowUserMenu(false)}
            onMouseLeave={() => setShowUserMenu(false)}
          >
            <List
              data={menuItems}
              primaryKey="label"
              onClickItem={(event: { item?: UserMenuItem }) => {
                setShowUserMenu(false);
                event.item?.onClick();
              }}
            />
          </Drop>
        )}
      </Box>
    );
  };

  return (
    <Grommet theme={globalTheme}>
      <Box direction="column" flex>
        <Header
          justify="center"
          height="xxsmall"
          margin={{ vertical: "small" }}
        >
          <Box direction="row" pad="small" flex>
            <Button
              label="Browse"
              onClick={() => {
                if (router.pathname !== "/map")
                  // don't reload if already on the page
                  router.push("/map");
              }}
            />
          </Box>
          <Box width="50%">
            <Heading level="1" textAlign="center">
              Regen League
            </Heading>
          </Box>
          <Box direction="row-reverse" pad="small" flex>
            {session ? (
              <UserMenu />
            ) : (
              <Button
                disabled={!loginEnabled}
                label={
                  <Text color="white">
                    <strong>Login</strong>
                  </Text>
                }
                onClick={() => setShowLogin(true)}
                primary
                color="brand"
              />
            )}
            <Box margin={{ right: "medium" }} justify="center">
              <Anchor onClick={() => router.push("/about")}>
                <HelpOption />
              </Anchor>
            </Box>
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
  );
}
