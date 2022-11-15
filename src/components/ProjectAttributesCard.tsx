import {Box, Card, CardBody, CardHeader, TextArea} from 'grommet'

import {Project} from "../utils/supabase";

type Props = {
    project: Project
}

export default function ProjectAttributesCard({project}: Props) {

    return (
        <Card pad="small">
            <CardHeader pad="small">Details</CardHeader>
            <CardBody>
                <Box>
                    <TextArea value={project.description || ''} rows={5} disabled/>
                </Box>
            </CardBody>
        </Card>
    )
}