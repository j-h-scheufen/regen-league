import { Box, Grommet, Heading, type ThemeType } from 'grommet'
import type { ReactNode } from 'react'

const theme: ThemeType = {
  global: {
    font: {
      family: 'RobotoRegular',
      size: '18px',
      height: '20px',
    },
  },
}

type Props = {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <Grommet theme={theme}>
      <Box direction="column" flex>
        <Box direction="row" elevation="medium" pad="small" justify="center">
          <Heading>Regen League</Heading>
        </Box>
        <Box flex>{children}</Box>
      </Box>
    </Grommet>
  )
}
