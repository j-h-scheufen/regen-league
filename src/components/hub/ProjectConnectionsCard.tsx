import {Box, Card, CardBody, CardHeader, Text} from 'grommet'
import React from "react";
import {useAtomValue} from "jotai";
import Link from "next/link";

import {projectsAtom} from "../../state/global";
import {Project} from "../../utils/types";

export default function ProjectConnectionsCard() {
    const projects = useAtomValue(projectsAtom)

    const ProjectRow = (item: Project) => {
        return (
            <Box direction="row" gap="medium" pad="small" flex>
                <Link href={'/project/'+item.id}>{item.name}</Link>
            </Box>
        )
    }

    return (
        <Card pad="small">
            <CardHeader pad="small" justify="start">Associated Projects</CardHeader>
            <CardBody>
                {projects.length == 0 ? (
                    <Text>There are currently no projects linked to this hub.</Text>
                ) : (
                    <Box>
                        {projects.map((item, index) => <ProjectRow key={index} {...item}/>)}
                    </Box>
                )}
            </CardBody>
        </Card>
    )

}