import Head from "next/head";
import React from "react";
import Link from "next/link";
import {Github, Home, View} from "grommet-icons";
import {Box, Button, Grommet, Header, Heading, Main, type ThemeType} from 'grommet'

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
  return (
    <Grommet theme={theme}>
      <Box direction="column" flex>

        <Box direction="row" elevation="medium" pad="small" justify="center">
          <Heading>Regen League</Heading>
        </Box>
        {/*<Header elevation="medium" background="brand" justify="center" pad="small">*/}
        {/*  <Link href={"/home"}>*/}
        {/*    <Button icon={<Home />} hoverIndicator label="Home" />*/}
        {/*  </Link>*/}
        {/*  <Link href={"/profile"}>*/}
        {/*    <Button icon={<View />} hoverIndicator label="Profile" />*/}
        {/*  </Link>*/}
        {/*  <Button*/}
        {/*      label="Github"*/}
        {/*      target="_blank"*/}
        {/*      hoverIndicator*/}
        {/*      icon={<Github />}*/}
        {/*      href="https://github.com/j-h-scheufen/regen-league"*/}
        {/*  />*/}
        {/*</Header>*/}

        <Main
            // flex
            pad="large"
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
