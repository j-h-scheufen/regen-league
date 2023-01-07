import {
    Box,
    Button,
    Form,
    FormField, TextArea,
    TextInput,
} from 'grommet'
import {useRouter} from "next/router";
import {atom, useAtom} from "jotai";
import {useSupabaseClient, useUser} from "@supabase/auth-helpers-react";
import {useCallback} from "react";

import {Database} from "../../utils/database.types";
import {EntityType, Project} from "../../utils/types";
import {createEntityForUser} from "../../utils/supabase";
import {useAdminRole} from "../../utils/hooks";

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
    const adminRole = useAdminRole(EntityType.HUMAN, EntityType.PROJECT)

    const [newProject, setProject] = useAtom(newProjectAtom)
    const [loading, setLoading] = useAtom(loadingAtom)

    const createProject = useCallback( async (): Promise<string | undefined> => {
        try {
            setLoading(true)
            if (user) {
                const newEntity = await createEntityForUser(client, newProject, user.id, adminRole)
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
    }, [client, user, adminRole, setLoading, newProject, setProject])

    return (
        <Box width="large" elevation="medium" round pad="large">
            <Form<Project>
                value={newProject}
                onChange={(newValue) => setProject(newValue)}
                onSubmit={() => createProject().then((projectId) => {
                    router.push("/project/"+projectId)
                    setProject(emptyProject)
                })}
            >
                    <FormField width="100%" name="name" htmlFor="nameId" label="Name" required>
                        <TextInput id="nameId" name="name" type="name"/>
                    </FormField>
                    <FormField width="100%" name="description" htmlFor="descriptionId" label="Description">
                        <TextArea id="descriptionId" name="description" rows={10}/>
                    </FormField>
                <Box direction="row" gap="medium" width="50%" margin={{ horizontal: 'auto', top: 'large' }}>
                    <Button type="submit" primary label={loading ? 'Loading ...' : 'Submit'} disabled={loading} />
                </Box>
            </Form>
        </Box>
    )
}