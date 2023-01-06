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
import {addRelationship, getUserMember, removeRelationship, updateEntity} from "../../utils/supabase";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {GeoLocation} from "../../utils/types";
import LocationForm from "../LocationForm";

export default function ProjectMain() {
    const [projectRoles, initialProjectCandidates] = useAtomValue(waitForAll([projectRolesAtom, projectMemberCandidatesAtom]))
    const [currentProject, setCurrentProject] = useAtom(currentProjectAtom)
    const isAdmin = useAtomValue(isProjectAdminAtom)
    const [edit, setEdit] = useAtom(editAtom)
    const client = useSupabaseClient()

    if (!currentProject)
        throw Error('No project object detected in app state!')

    const performAdd = async (userId: string, roleId: string) => {
        await addRelationship(client, userId, currentProject.id, roleId)
        return getUserMember(client, userId, currentProject.id)
    }

    const performDelete = async (userId: string) => {
        return removeRelationship(client, userId, currentProject.id)
    }

    const updateLocation = async (location: GeoLocation) => {
        const updatedProject = {...currentProject, ...location}
        await updateEntity(client, updatedProject)
        setCurrentProject(updatedProject)
    }


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
                        <LocationForm
                            entity={currentProject}
                            update={updateLocation}/>
                        <RegionSelectorPanel
                            ownerId={currentProject.id}/>
                        <LinksForm
                            ownerId={currentProject.id}/>
                        <MembersForm
                            orgId={currentProject.id}
                            roles={projectRoles}
                            initialCandidates={initialProjectCandidates}
                            performAdd={performAdd}
                            performDelete={performDelete}/>
                    </Box>
                ) : (
                    <Box>
                        {isAdmin && <Button
                            label="Edit"
                            style={{textAlign: 'center'}}
                            onClick={() => setEdit(true)}
                            margin={{vertical: "medium"}}/>}
                            <MembersCard/>
                            <ProjectAttributesCard entity={currentProject}/>
                            <RegionInfoCard/>
                            <LinksCard/>
                    </Box>
                )}
            </Box>
        </Page>
    )
}