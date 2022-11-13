import {Box, Heading, Paragraph} from 'grommet'
import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'

export default function HomePage() {
    const session = useSession()
    const supabase = useSupabaseClient()

    const content = session ? (
        <Box align="center" direction="column" pad="medium">
            <Heading size="small">Welcome</Heading>
            <Paragraph>Regen League is the registration app to get an overview of the global Regen movement. Its main target audience are the DOers, the ones who go out and connect with projects on the ground or lead communities.</Paragraph>
        </Box>
    ) : (
        <Box align="center" direction="column" pad="medium">
            <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} theme="dark" />
        </Box>
    )

    return content
}
