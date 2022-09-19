import { Box, Button, Grommet, Heading, type ThemeType } from 'grommet'
import dynamic from 'next/dynamic'
import type { ReactNode } from 'react'

// const AccountButton = dynamic(() => import('./AccountButton'), {
//   ssr: false,
// })

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
        <Box direction="row" elevation="medium" pad="small">
          <Heading>Regen League</Heading>
        </Box>
        <Box flex>{children}</Box>
      </Box>
    </Grommet>
  )
}
