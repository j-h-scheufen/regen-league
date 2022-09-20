import { Anchor, Box, Heading, Paragraph } from 'grommet'
import { useRouter } from 'next/router'
import { useAuthenticatedID } from '../hooks'
import dynamic from "next/dynamic";

const ConnectButton = dynamic(() => import('../components/ConnectButton'), {
    ssr: false,
})

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
