import {Box, Button, Heading, Page} from 'grommet'
import {Add as AddIcon} from 'grommet-icons'
import {GetServerSidePropsContext} from 'next'
import {Session} from "@supabase/auth-helpers-react"
import Link from 'next/link';

import {getProjects, getServerClient} from '../utils/supabase'
import ProjectsList from '../components/ProjectsList'
import {Project} from "../utils/types";

type PageProps = {
    session: Session
    projects: Array<Project>
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const {client, session} = await getServerClient(ctx)

    const projects = await getProjects(client)
    return {
        props: {
            session: session,
            projects: projects,
        },
    }
}

export default function Projects({ session, projects }: PageProps) {
    return (
        <Page>
            <Box direction="row" justify="between">
                <Heading >Projects</Heading>
                {session ? <Link href={"/project/new"} passHref>
                    <Button><AddIcon size="large"/></Button>
                </Link>: <Box/>}
            </Box>
            <ProjectsList projects={projects}/>
        </Page>
    )
}

