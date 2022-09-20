import { useSetAtom } from 'jotai'
import { Button, Box, Paragraph } from 'grommet'
import { useCallback, useEffect } from 'react'
import { DIDSession } from 'did-session'
import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking'
import { useRouter } from 'next/router'

import { environmentAtom } from '../state'
import {createEnvironment} from "../environment";

export default function ConnectButton() {
  // const id = useAuthenticatedID()
  const setEnvironment = useSetAtom(environmentAtom)
    const router = useRouter()

    const connect = useCallback(async () => {
        // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        // @ts-ignore
        const ethProvider = window.ethereum;
        const addresses = await ethProvider.enable()
        const authProvider = new EthereumAuthProvider(ethProvider, addresses[0])
        const session = await DIDSession.authorize(authProvider, { resources: [`ceramic://*`]}) //TODO change to minimum required resources (stream IDs)
        createEnvironment(session).then(
            (env) => {
                setEnvironment(env)
            },
            (err) => {
                console.warn('Failed to create environment', err)
            }
        )
    }, [router])

    let button =
        <Button
            primary
            color="black"
            label="Connect"
            onClick={connect}
            style={{ border: 0, color: 'white' }}
        />

    useEffect(() => {
        if (!('ethereum' in window)) {
            button =
                <Box align="center" direction="column" pad="medium">
                    <Paragraph>An injected Ethereum provider such as{' '}
                        <a href="https://metamask.io/">MetaMask</a> is needed to authenticate.</Paragraph>
                </Box>
        }
    }, [button])

    return button
}
