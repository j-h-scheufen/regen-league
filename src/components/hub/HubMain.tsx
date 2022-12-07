import {Box, Button, Heading, Page} from "grommet";
import {useAtom, useAtomValue} from "jotai";

import HubAttributesForm from "./HubAttributesForm";
import RegionInfoCard from "../RegionInfoCard";
import LinksCard from "../LinksCard";
import LinksForm from "../LinksForm";
import MembersCard from "../MembersCard";
import HubAttributesCard from "./HubAttributesCard";
import {currentHubAtom, editAtom, hubMemberCandidatesAtom, isHubAdminAtom} from "../../state/hub";
import RegionSelectorPanel from "../RegionSelectorPanel";
import MembersForm from "../MembersForm";
import ProjectConnectionsCard from "./ProjectConnectionsCard";
import ProjectConnectionsForm from "./ProjectConnectionsForm";
import {waitForAll} from "jotai/utils";
import {hubRolesAtom} from "../../state/global";
import {addHubMembership, removeHubMembership} from "../../utils/supabase";

export default function HubMain() {
    const [hubRoles, initialHubCandidates] = useAtomValue(waitForAll([hubRolesAtom, hubMemberCandidatesAtom]))
    const currentHub = useAtomValue(currentHubAtom)
    const isAdmin = useAtomValue(isHubAdminAtom)
    const [edit, setEdit] = useAtom(editAtom)

    if (!currentHub)
        throw Error('No hub object detected in app state!')

    return (
        <Page align="center">
            {edit ? (
                <Box width="large">
                    <HubAttributesForm
                        hub={currentHub}
                        onSubmit={() => setEdit(false)}
                        onCancel={() => setEdit(false)}/>
                    <RegionSelectorPanel
                        ownerId={currentHub.id}/>
                    <LinksForm
                        ownerId={currentHub.id}/>
                    <MembersForm
                        orgId={currentHub.id}
                        roles={hubRoles}
                        initialCandidates={initialHubCandidates}
                        performAdd={addHubMembership}
                        performDelete={removeHubMembership}/>
                    <ProjectConnectionsForm
                        hubId={currentHub.id}/>
                    <Button
                        label="Done"
                        style={{textAlign: 'center'}}
                        onClick={() => setEdit(false)}
                        margin={{top: "medium"}}/>
                </Box>
            ) : (
                <Box width="large">
                    <Box direction="row" alignSelf="center">
                        <Heading size="medium" margin="small" alignSelf="center">{currentHub.name}</Heading>
                    </Box>
                    <MembersCard/>
                    <HubAttributesCard/>
                    <RegionInfoCard/>
                    <LinksCard/>
                    <ProjectConnectionsCard/>
                    {isAdmin && <Button
                        label="Edit"
                        style={{textAlign: 'center'}}
                        onClick={() => setEdit(true)}
                        margin={{top: "medium"}}/>}
                </Box>
            )}
        </Page>
    )
}