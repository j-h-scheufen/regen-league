import {Box, Button, Form, FormField, TextInput,} from 'grommet'
import {useRouter} from "next/router";
import {atom, useAtomValue, useAtom} from "jotai";
import {useSupabaseClient, useUser} from "@supabase/auth-helpers-react";

import {Database} from "../../utils/database.types";
import {EntityType, Hub} from "../../utils/types";
import {rolesAtom} from "../../state/global";
import {useCallback} from "react";
import {createEntityForUser} from "../../utils/supabase";

const emptyHub: Hub = {
    id: "",
    name: "",
    description: "",
    type: EntityType.HUB
}
const newHubAtom = atom<Hub>(emptyHub)
const loadingAtom = atom<boolean>(false)

export default function NewHubForm() {
    const client = useSupabaseClient<Database>()
    const user = useUser()
    const router = useRouter()

    const [newHub, setHub] = useAtom(newHubAtom)
    const [loading, setLoading] = useAtom(loadingAtom)
    const rolesDictionary = useAtomValue(rolesAtom)
    const roles = rolesDictionary.get(JSON.stringify([EntityType.HUMAN, EntityType.HUB]))

    function getAdminRole(): string {
        const result = roles?.filter((role) => role.name.toUpperCase().startsWith('ADMIN'))
        if (!result || result.length !== 1) {
            console.error('No admin role found for a relationship from human (type: ' + EntityType.HUMAN + ') to hub (type: ' + EntityType.HUB + ')')
            throw Error('Missing data. Unable to proceed')
        }
        return result[0].id
    }

    const createHub = useCallback( async (): Promise<string | undefined> => {
        try {
            setLoading(true)
            if (user) {
                const newEntity = await createEntityForUser(client, newHub, user.id, getAdminRole())
                setHub(newEntity)
                return newEntity.id
            }
            else
                throw Error('No user session found.')
        } catch (error) {
            console.error('Error creating the hub!')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }, [client, user, setLoading, newHub, getAdminRole, setHub])

    return (
        <Box width="large" elevation="medium" round pad="large">
            <Form<Hub>
                value={newHub}
                onChange={(newValue) => setHub(newValue)}
                onSubmit={() => createHub().then((hubId) => router.push("/hub/"+hubId))}
            >
                    <FormField width="100%" name="name" htmlFor="nameId" label="Name" required>
                        <TextInput id="nameId" name="name" type="name"/>
                    </FormField>
                    <FormField width="100%" name="description" htmlFor="descriptionId" label="Description">
                        <TextInput id="descriptionId" name="description" type="text"/>
                    </FormField>
                <Box direction="row" gap="medium" width="50%" margin={{ horizontal: 'auto', top: 'large' }}>
                    <Button type="submit" primary label={loading ? 'Loading ...' : 'Submit'} disabled={loading} />
                </Box>
            </Form>
        </Box>
    )
}