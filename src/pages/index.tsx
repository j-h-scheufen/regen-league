import { Box, Paragraph } from 'grommet'
import { useRouter } from 'next/router'
import Link from "next/link"
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
            <Paragraph>Connected as <Link href={`/${id}`} passHref>
                {id}</Link></Paragraph>
        </Box>
    ) : (
        <Box align="center" direction="column" pad="medium">
            <ConnectButton></ConnectButton>
        </Box>
    )

    return content
}
