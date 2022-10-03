import { ComposeClient } from '@composedb/client'
import { DIDSession } from 'did-session'
import { Environment as RelayEnvironment, Network, RecordSource, Store } from 'relay-runtime'
import type { GraphQLResponse } from 'relay-runtime'

import { definition } from './__generated__/definition'

const CERAMIC_URL = process.env.NEXT_PUBLIC_CERAMIC_URL ?? 'http://0.0.0.0:7007'

export type Environment = {
  session: DIDSession
  relay: RelayEnvironment
}

const client = new ComposeClient({ ceramic: CERAMIC_URL, definition })

const network = Network.create(async (request, variables) => {
  const res = (await client.executeQuery(request.text as string, variables)) as GraphQLResponse
  console.log('graphQL response', request, res)
  return res
})

export function createRelayEnvironment(): RelayEnvironment {
  return new RelayEnvironment({ network, store: new Store(new RecordSource()) })
}

export async function createEnvironment(session: DIDSession): Promise<Environment> {
  client.setDID(session.did)
  return { session, relay: createRelayEnvironment() }
}

export const defaultRelayEnvironment: RelayEnvironment = createRelayEnvironment()
