import {Box, Button, Heading, Page} from "grommet";
import {useAtom, useAtomValue} from "jotai";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {waitForAll} from "jotai/utils";

import {hubRolesAtom} from "../../state/global";
import {currentHubAtom, editAtom, hubMemberCandidatesAtom, isHubAdminAtom} from "../../state/hub";
import HubAttributesForm from "./HubAttributesForm";
import RegionInfoCard from "../RegionInfoCard";
import LinksCard from "../LinksCard";
import LinksForm from "../LinksForm";
import MembersCard from "../MembersCard";
import AttributesCard from "../AttributesCard";
import RegionSelectorPanel from "../RegionSelectorPanel";
import MembersForm from "../MembersForm";
import ProjectConnectionsCard from "./ProjectConnectionsCard";
import ProjectConnectionsForm from "./ProjectConnectionsForm";
import {addRelationship, getUserMember, removeRelationship, updateEntity} from "../../utils/supabase";
import LocationForm from "./LocationForm";
import {GeoLocation} from "../../utils/types";

export default function HubMain() {
    const [hubRoles, initialHubCandidates] = useAtomValue(waitForAll([hubRolesAtom, hubMemberCandidatesAtom]))
    const [currentHub, setCurrentHub] = useAtom(currentHubAtom)
    const isAdmin = useAtomValue(isHubAdminAtom)
    const [edit, setEdit] = useAtom(editAtom)
    const client = useSupabaseClient()

    if (!currentHub)
        throw Error('No hub object detected in app state!')

    const addMember = async (userId: string, roleId: string) => {
        await addRelationship(client, userId, currentHub.id, roleId)
        return getUserMember(client, userId, currentHub.id)
    }

    const deleteMember = async (userId: string) => {
        return removeRelationship(client, userId, currentHub.id)
    }

    const updateLocation = async (location: GeoLocation) => {
        const updatedHub = {...currentHub, ...location}
        await updateEntity(client, updatedHub)
        setCurrentHub(updatedHub)
    }

    return (
        <Page align="center">
            <Box width="large">
                <Box direction="row" alignSelf="center">
                    <Heading size="medium" margin="small" alignSelf="center">{currentHub.name}</Heading>
                </Box>
                {edit ? (
                    <Box>
                        <Button
                            label="Done"
                            style={{textAlign: 'center'}}
                            onClick={() => setEdit(false)}
                            margin={{vertical: "medium"}}/>
                        <HubAttributesForm
                            hub={currentHub}/>
                        <LocationForm
                            entity={currentHub}
                            update={updateLocation}/>
                        <RegionSelectorPanel
                            ownerId={currentHub.id}/>
                        <LinksForm
                            ownerId={currentHub.id}/>
                        <MembersForm
                            orgId={currentHub.id}
                            roles={hubRoles}
                            initialCandidates={initialHubCandidates}
                            performAdd={addMember}
                            performDelete={deleteMember}/>
                        <ProjectConnectionsForm
                            hubId={currentHub.id}/>
                    </Box>
                ) : (
                    <Box>
                        {isAdmin && <Button
                            label="Edit"
                            style={{textAlign: 'center'}}
                            onClick={() => setEdit(true)}
                            margin={{vertical: "medium"}}/>}
                        <MembersCard/>
                        <AttributesCard entity={currentHub}/>
                        <RegionInfoCard/>
                        <LinksCard/>
                        <ProjectConnectionsCard/>
                    </Box>
                )}
            </Box>
        </Page>
    )
}