import {Box, Button, Heading, Page} from 'grommet'
import {Add as AddIcon} from 'grommet-icons'
import {GetServerSidePropsContext} from 'next'
import {Session, useSession} from "@supabase/auth-helpers-react"
import Link from 'next/link';

import {getProjects, getServerClient} from '../utils/supabase'
import ProjectsList from '../components/project/ProjectsList'
import {Project} from "../utils/types";

type PageProps = {
    session: Session
    projects: Array<Project>
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const {client} = await getServerClient(ctx)

    const projects = await getProjects(client)

    return {
        props: {
            projects: projects,
        },
    }
}

export default function Projects({projects}: PageProps) {
    const session = useSession()

    return (
        <Page align="center">
            <Box direction="row" justify="between" align="center" width="95%">
                <Heading >Projects</Heading>
                {session ? <Link href={"/project/new"} passHref>
                    <Button margin={{left: 'auto'}}><AddIcon size="large"/></Button>
                </Link>: <Box/>}
            </Box>
            <Box margin={{horizontal: 'xsmall'}}>
                <ProjectsList projects={projects}/>
            </Box>
        </Page>
    )
}

