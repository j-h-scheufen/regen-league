import { Anchor, Box, Heading, Paragraph } from 'grommet'
import { useRouter } from 'next/router'
import { useAuthenticatedID } from '../hooks'
import { useEffect } from 'react'
import Link from "next/link";

import ConnectButton from '../components/ConnectButton'

export default function HomePage() {
    const id = useAuthenticatedID()
    const router = useRouter()

    const content = id ? (
        <Box align="center" direction="column" pad="medium">
            <Paragraph>Connected as {id}</Paragraph>
        </Box>
    ) : (
        <Box align="center" direction="column" pad="medium">
            <ConnectButton></ConnectButton>
        </Box>
    )

    return content
}
