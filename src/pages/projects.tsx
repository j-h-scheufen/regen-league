import {Box, Button, Heading, Page} from 'grommet'
import {Add as AddIcon} from 'grommet-icons'
import {GetServerSidePropsContext} from 'next'
import {Session} from "@supabase/auth-helpers-react"

import {getServerClient, Project} from '../utils/supabase'
import ProjectsList from '../components/ProjectsList'
import Link from 'next/link';

type PageProps = {
    session: Session
    projects: Array<Project>
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const {client, session} = await getServerClient(ctx)

    const {data, error} = await client.from('projects').select('*')
    console.log('DATA: '+JSON.stringify(data))
    if (error) alert('Unable to retrieve hubs data. Error: '+error.message);

    return {
        props: {
            session: session,
            projects: data ?? [],
        },
    }
}

export default function Hubs({ session, projects }: PageProps) {
    return (
        <Page>
            <Box direction="row" justify="between">
                <Heading >Projects</Heading>
                {session ? <Link href={"/newProject"} passHref>
                    <Button><AddIcon size="large"/></Button>
                </Link>: <Box/>}
            </Box>
            <ProjectsList projects={projects}/>
        </Page>
    )
}

