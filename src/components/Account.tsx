import { useState, useEffect } from 'react'
import {Box, Button, Form, FormField, TextInput} from 'grommet';
import { useUser, useSupabaseClient, User } from '@supabase/auth-helpers-react'

import { Database } from '../utils/database.types'
import { Profile } from '../hooks/supabase'

import Avatar from './Avatar'
// type Props = {
//     user: User,
//     profile: Profile
// }

export default function Account(profile: Profile) {
    const supabase = useSupabaseClient<Database>()
    const user = useUser()
    // it's expected a logged-in user is present when this component is used to insert user.id as profile.id
    const emptyProfile = { id: user?.id ?? '', username: '', website: '', avatar_url: '', updated_at: '' }
    const [currentProfile, setProfile] = useState<Profile>(profile)
    const [loading, setLoading] = useState(false)

    async function updateProfile() {
        try {
            setLoading(true)
            if (!user) throw new Error('No user')

            const updates = {
                ...currentProfile,
                updated_at: new Date().toISOString(),
            }

            let { error } = await supabase.from('profiles').upsert(updates)
            if (error) throw error
            alert('Profile updated!')
        } catch (error) {
            alert('Error updating the data!')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box align="center" direction="column" pad="medium">
            <Form<Profile>
                value={currentProfile}
                onChange={nextValue => setProfile(nextValue)}
                onReset={() => setProfile(emptyProfile)}
                onSubmit={() => { updateProfile() } }>
                    {/*<Avatar*/}
                    {/*    uid={user.id}*/}
                    {/*    url={profile.avatar_url}*/}
                    {/*    size={150}*/}
                    {/*    onUpload={(url) => {*/}
                    {/*        setAvatarUrl(url)*/}
                    {/*        updateProfile({ username, website, avatar_url: url })*/}
                    {/*    }}*/}
                    {/*/>*/}
                <FormField name="email" htmlFor="emailId" label="Email" disabled>
                    <TextInput id="emailId" name="email" value={user?.email}/>
                </FormField>
                <FormField name="username" htmlFor="usernameId" label="Username">
                    <TextInput id="usernameId" name="username"/>
                </FormField>
                <FormField name="website" htmlFor="websiteId" label="Website">
                    <TextInput id="websiteId" name="website"/>
                </FormField>
                <Box direction="row" gap="medium">
                    <Button type="submit" primary label={loading ? 'Loading ...' : 'Update'} disabled={loading} />
                </Box>
            </Form>
        </Box>

    )
}