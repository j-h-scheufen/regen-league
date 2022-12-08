import {Box, Button, Heading, Page} from "grommet";
import {useAtom, useAtomValue} from "jotai";

import ProjectAttributesForm from "./ProjectAttributesForm";
import RegionInfoCard from "../RegionInfoCard";
import LinksCard from "../LinksCard";
import LinksForm from "../LinksForm";
import MembersCard from "../MembersCard";
import ProjectAttributesCard from "../AttributesCard";
import {currentProjectAtom, editAtom, projectMemberCandidatesAtom, isProjectAdminAtom} from "../../state/project";
import RegionSelectorPanel from "../RegionSelectorPanel";
import MembersForm from "../MembersForm";
import {waitForAll} from "jotai/utils";
import {projectRolesAtom} from "../../state/global";
import {addProjectMembership, removeProjectMembership} from "../../utils/supabase";

export default function ProjectMain() {
    const [projectRoles, initialProjectCandidates] = useAtomValue(waitForAll([projectRolesAtom, projectMemberCandidatesAtom]))
    const currentProject = useAtomValue(currentProjectAtom)
    const isAdmin = useAtomValue(isProjectAdminAtom)
    const [edit, setEdit] = useAtom(editAtom)

    if (!currentProject)
        throw Error('No project object detected in app state!')

    return (
        <Page align="center">
            <Box width="large">
                <Box direction="row" alignSelf="center">
                    <Heading size="medium" margin="small" alignSelf="center">{currentProject.name}</Heading>
                </Box>
                {edit ? (
                    <Box>
                        <Button
                            label="Done"
                            style={{textAlign: 'center'}}
                            onClick={() => setEdit(false)}
                            margin={{vertical: "medium"}}/>
                        <ProjectAttributesForm
                            project={currentProject}/>
                        <RegionSelectorPanel
                            ownerId={currentProject.id}/>
                        <LinksForm
                            ownerId={currentProject.id}/>
                        <MembersForm
                            orgId={currentProject.id}
                            roles={projectRoles}
                            initialCandidates={initialProjectCandidates}
                            performAdd={addProjectMembership}
                            performDelete={removeProjectMembership}/>
                    </Box>
                ) : (
                    <Box>
                        {isAdmin && <Button
                            label="Edit"
                            style={{textAlign: 'center'}}
                            onClick={() => setEdit(true)}
                            margin={{vertical: "medium"}}/>}
                            <MembersCard/>
                            <ProjectAttributesCard description={currentProject.description}/>
                            <RegionInfoCard/>
                            <LinksCard/>
                    </Box>
                )}
            </Box>
        </Page>
    )
}