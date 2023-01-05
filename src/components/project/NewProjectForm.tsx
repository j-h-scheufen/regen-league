import {
    Box,
    Button,
    Form,
    FormField,
    TextInput,
} from 'grommet'
import {useRouter} from "next/router";
import {atom, useAtomValue, useAtom} from "jotai";
import {useSupabaseClient, useUser} from "@supabase/auth-helpers-react";
import {useCallback} from "react";

import {Database} from "../../utils/database.types";
import {EntityType, Project} from "../../utils/types";
import {rolesAtom} from "../../state/global";
import {createEntityForUser} from "../../utils/supabase";

const emptyProject: Project = {
    id: "",
    name: "",
    description: "",
    type: EntityType.PROJECT
}
const newProjectAtom = atom<Project>(emptyProject)
const loadingAtom = atom<boolean>(false)

export default function NewProjectForm() {
    const client = useSupabaseClient<Database>()
    const user = useUser()
    const router = useRouter()

    const [newProject, setProject] = useAtom(newProjectAtom)
    const [loading, setLoading] = useAtom(loadingAtom)
    const rolesDictionary = useAtomValue(rolesAtom)
    const roles = rolesDictionary.get(JSON.stringify([EntityType.HUMAN, EntityType.PROJECT]))

    function getAdminRole(): string {
        const result = roles?.filter((role) => role.name.toUpperCase().startsWith('ADMIN'))
        if (!result || result.length !== 1) {
            console.error('No admin role found for a relationship from human (type: ' + EntityType.HUMAN + ') to project (type: ' + EntityType.PROJECT + ')')
            throw Error('Missing data. Unable to proceed')
        }
        return result[0].id
    }

    const createProject = useCallback( async (): Promise<string | undefined> => {
        try {
            setLoading(true)
            if (user) {
                const newEntity = await createEntityForUser(client, newProject, user.id, getAdminRole())
                setProject(newEntity)
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
    }, [client, user, setLoading, newProject, getAdminRole, setProject])

    return (
        <Box width="large" elevation="medium" round pad="large">
            <Form<Project>
                value={newProject}
                onChange={(newValue) => setProject(newValue)}
                onSubmit={() => createProject().then((projectId) => router.push("/hub/"+projectId))}
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