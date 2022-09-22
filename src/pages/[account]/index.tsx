import {Box, Paragraph} from 'grommet'
import type { GetServerSideProps } from 'next'
import { Suspense, useEffect } from 'react'
import { type PreloadedQuery, graphql, useQueryLoader, usePreloadedQuery } from 'react-relay'

import { AccountProfileQuery } from '../../__generated__/relay/AccountProfileQuery.graphql'

const query = graphql`
  query AccountProfileQuery($did: ID!) {
    account: node(id: $did) {
      ... on CeramicAccount {
        profile {
          name
          entityType
        }
      }
    }
  }
`

type ListProps = {
  queryRef: PreloadedQuery<AccountProfileQuery>
}

function AccountContent({ queryRef }: ListProps) {
  const data = usePreloadedQuery<AccountProfileQuery>(query, queryRef)
  return data.account ? <Box><Paragraph>{data.account.profile?.name}</Paragraph></Box> : null
}

type Props = {
  did: string
}

export const getServerSideProps: GetServerSideProps<Props, { account: string }> = (ctx) => {
  const did = ctx.params?.account ?? null
  const res =
    did === null ? { redirect: { destination: '/', permanent: true } } : { props: { did } }
  return Promise.resolve(res)
}

export default function AccountPage({ did }: Props) {
  const [queryRef, loadQuery] = useQueryLoader<AccountProfileQuery>(query)

  useEffect(() => {
    if (queryRef == null) {
      loadQuery({ did })
    }
  }, [queryRef])

  // const loading = <Box sx={{ padding: 2 }}>Loading...</Box>

  return queryRef == null ? (
    <Paragraph>Loading ...</Paragraph>
  ) : (
      <Box>
        <AccountContent queryRef={queryRef} />
      </Box>
  )
}
