import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { graphql, useMutation } from 'react-relay'

import type { CreateProfileMutation } from '../__generated__/relay/CreateProfileMutation.graphql'

 import ProfileForm from './ProfileForm'
 import type { Profile } from './ProfileForm'

type Props = {
  did: string
}

export default function CreateProfile({ did }: Props) {
  const router = useRouter()

  const [commit, isInFlight] = useMutation<CreateProfileMutation>(graphql`
    mutation CreateProfileMutation($input: CreateProfileInput!) {
      createProfile(input: $input) {
        document {
          id
        }
      }
    }
  `)

  const onSave = useCallback(
    (profile: Profile) => {
      console.log('onSave profile', profile)
      commit({
        variables: { input: { content: profile } },
        onError: (err) => {
          console.log('mutation failed', err)
        },
        onCompleted: (res) => {
          console.log('mutation completed')
          // @ts-ignore
            const id = res.createProfile.node?.id
          router.push(id ? `/${id}` : `/${did}`)
        },
      })
    },
    [commit]
  )

  return <ProfileForm disabled={isInFlight} onSave={onSave} />
}
