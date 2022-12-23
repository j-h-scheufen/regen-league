import {
    Box,
    Button,
    Form,
    FormField, Paragraph,
    TextInput,
} from 'grommet'
import { useState } from 'react'
import {Session, useSession, useSupabaseClient, useUser} from "@supabase/auth-helpers-react";

import { Database } from "../../utils/database.types";
import {EntityType, Project} from "../../utils/types";
import {useRouter} from "next/router";

export default function NewProjectStep1() {
    const supabase = useSupabaseClient<Database>()
    const session = useSession()
    const router = useRouter()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)

    if (!session) return (<Paragraph>Unauthorized</Paragraph>)

    async function createProject(session: Session) {
        try {
            setLoading(true)

            const { data, error } = await supabase.rpc('new_entity_with_user_relation', { name: name, description: description, entity_type_id: EntityType.PROJECT, role_id: "TODO", user_id: session.user.id })

            if (error)
                throw error

            return data
        } catch (error) {
            console.error('Error creating the project! Message: '+JSON.stringify(error))
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box width="large" elevation="medium" round pad="large">
            <Form<Project>
                onSubmit={async () => {
                    const projectId = await createProject(session)
                    router.push("/project/"+projectId)
                }}>
                    <FormField width="100%" name="name" htmlFor="nameId" label="Name" required>
                        <TextInput id="nameId" name="name" type="name" value={name} onChange={event => setName(event.target.value)}/>
                    </FormField>
                    <FormField width="100%" name="description" htmlFor="descriptionId" label="Description">
                        <TextInput id="descriptionId" name="description" type="text" value={description} onChange={event => setDescription(event.target.value)}/>
                    </FormField>
                <Box direction="row" gap="medium" width="50%" margin={{ horizontal: 'auto', top: 'large' }}>
                    <Button type="submit" primary label={loading ? 'Loading ...' : 'Submit'} disabled={loading} />
                </Box>
            </Form>
        </Box>
    )
}