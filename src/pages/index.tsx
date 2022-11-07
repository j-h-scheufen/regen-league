import { Box } from 'grommet'
import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import Link from 'next/link';

export default function HomePage() {
    const session = useSession()
    const supabase = useSupabaseClient()

    const content = session ? (
        <Box align="center" direction="column" pad="medium">
            <Link href={'/profile'}>My Profile</Link>
        </Box>
    ) : (
        <Box align="center" direction="column" pad="medium">
            <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} theme="dark" />
        </Box>
    )

    return content
}
