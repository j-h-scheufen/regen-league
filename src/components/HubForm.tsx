import {
    Box,
    BoxProps,
    Button,
    Form,
    FormField, Heading,
    TextInput,
} from 'grommet'
import {PropsWithChildren, useState} from 'react'
import {useSupabaseClient, useUser} from "@supabase/auth-helpers-react";

import {Database} from "../utils/database.types";
import {Hub} from "../utils/supabase";

const FormSection = ({ children, ...rest }: PropsWithChildren<BoxProps>) => (
    <Box direction="row" gap="medium" justify="center" margin={{ bottom: 'medium' }} {...rest}>
        {children}
    </Box>
)

export default function HubForm(hub: Hub) {
    const supabase = useSupabaseClient<Database>()
    const user = useUser()

    const [currentValue, setValue] = useState<Hub>(hub)
    const [loading, setLoading] = useState(false)

    async function updateHub(freshHub: Hub) {
        try {
            setLoading(true)
            let {error} = await supabase.from('hubs').upsert(freshHub)
            if (error) throw error
            alert('Hub updated!')
        } catch (error) {
            alert('Error updating the hub! Error: '+JSON.stringify(error))
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box width="large" elevation="medium" round pad="large">
            <Form<Hub>
                value={currentValue}
                onChange={(nextValue) => setValue(nextValue)}
                onSubmit={async ({ value }) => {
                    console.log(value)
                    await updateHub(value)
                }}>
                <FormSection>
                    <FormField width="100%" name="name" htmlFor="nameId" label="Name" required>
                        <TextInput id="nameId" name="name" type="name" disabled/>
                    </FormField>
                    <FormField width="100%" name="description" htmlFor="descriptionId" label="Description" required>
                        <TextInput id="descriptionId" name="description" type="text" />
                    </FormField>
                </FormSection>
                <Box direction="row" gap="medium" width="50%" margin={{ horizontal: 'auto', top: 'large' }}>
                    <Button type="submit" primary label={loading ? 'Loading ...' : 'Update'} disabled={loading} />
                </Box>
            </Form>
        </Box>
    )
}