import {useCallback} from 'react'
import {Box, Button, Form, FormField, TextInput} from 'grommet';
import {useSupabaseClient} from '@supabase/auth-helpers-react'
import {atom, useAtom} from "jotai";
import {useHydrateAtoms} from "jotai/utils";

import { Database } from '../../utils/database.types'
import { Profile } from '../../utils/types'
import {currentUserProfile} from "../../state/global";

type Props = {
    profile: Profile
    onSubmit: () => void
    onCancel: () => void
}

const emptyProfile: Profile = {avatarFilename: "", avatarURL: "", id: "", username: ""}
const editProfileAtom = atom<Profile>(emptyProfile)
const loadingAtom = atom<boolean>(false)

export default function ProfileForm({profile, onSubmit, onCancel}: Props) {
    if(!profile)
        throw Error('This component requires a profile')
    useHydrateAtoms([[currentUserProfile, profile], [editProfileAtom, {...profile}]] as const)
    const supabase = useSupabaseClient<Database>()
    const [currentProfile , setCurrentProfile] = useAtom(currentUserProfile)
    const [editProfile, setEditProfile] = useAtom(editProfileAtom)
    const [loading, setLoading] = useAtom(loadingAtom)

    const updateProfile = useCallback( async () => {
        try {
            setLoading(true)
            const updates = {
                username: editProfile!.username
            }
            const {error} = await supabase.from('profiles').update(updates).eq('id', profile.id)
            if (error) {
                console.log('Error updating profile for user ID '+profile.id)
                throw error
            }
            if (currentProfile) {
                setCurrentProfile({...currentProfile, username: editProfile.username})
            }
        } catch (error) {
            console.error(error)
            throw error
        } finally {
            setLoading(false)
        }
    }, [editProfile, setCurrentProfile, supabase, profile])

    return (
            <Form<Profile>
                value={editProfile!}
                onChange={nextValue => setEditProfile(nextValue)}
                onSubmit={() => {
                    updateProfile().then(() => {
                        onSubmit()
                    })
                }}>
                <FormField name="username" htmlFor="usernameId" label="Username">
                    <TextInput id="usernameId" name="username" placeholder="Username (optional)"/>
                </FormField>
                <Box direction="row" gap="medium" margin={{top: "medium"}}>
                    <Button secondary label={loading ? 'Loading ...' : 'Cancel'} disabled={loading} onClick={() => onCancel()}/>
                    <Button type="submit" primary label={loading ? 'Loading ...' : 'Update'} disabled={loading}/>
                </Box>
            </Form>

    )
}