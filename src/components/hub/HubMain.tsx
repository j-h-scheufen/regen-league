import {Box, Button, Heading, Page} from "grommet";
import {useAtom, useAtomValue} from "jotai";

import HubAttributesForm from "./HubAttributesForm";
import RegionInfoCard from "../RegionInfoCard";
import LinksCard from "../LinksCard";
import LinksForm from "../LinksForm";
import MembersCard from "../MembersCard";
import HubAttributesCard from "./HubAttributesCard";
import {currentHubAtom, editAtom, isHubAdminAtom} from "../../state/hub";
import RegionSelectorPanel from "../RegionSelectorPanel";
import MembersForm, {Mode} from "../MembersForm";

export default function HubMain() {
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
                    <RegionSelectorPanel ownerId={currentHub.id}/>
                    <LinksForm ownerId={currentHub.id}/>
                    <MembersForm orgId={currentHub.id} mode={Mode.HUB}/>
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