import { Box, Card, CardBody, CardHeader, Text } from "grommet";
import React from "react";
import { useAtomValue } from "jotai";
import Link from "next/link";

import { hubProjectsAtom } from "../../state/hub";
import { Project } from "../../utils/types";

export default function ProjectConnectionsCard() {
  const projects = useAtomValue(hubProjectsAtom);

  const ProjectRow = (item: Project) => {
    return (
      <Box direction="row" gap="medium" pad="small" flex>
        <Link href={"/project/" + item.id}>{item.name}</Link>
      </Box>
    );
  };

  return (
    <Card pad="small" margin={{ vertical: "small" }}>
      <CardHeader justify="center">
        <Text size="large">Associated Projects</Text>
      </CardHeader>
      <CardBody>
        {projects.length == 0 ? (
          <Text>There are currently no projects associated with this hub.</Text>
        ) : (
          <Box>
            {projects.map((item, index) => (
              <ProjectRow key={index} {...item} />
            ))}
          </Box>
        )}
      </CardBody>
    </Card>
  );
}
