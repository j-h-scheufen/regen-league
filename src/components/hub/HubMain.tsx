import {Box, Button, Heading, Page} from "grommet";
import {useAtom, useAtomValue} from "jotai";

import HubForm from "./HubForm";
import RegionInfoCard from "../RegionInfoCard";
import LinksCard from "../LinksCard";
import LinksForm from "../LinksForm";
import MembersCard from "../MembersCard";
import HubAttributesCard from "./HubAttributesCard";
import {currentHubAtom, editAtom, isHubAdminAtom} from "../../state/hub";
import RegionSelectorPanel from "../RegionSelectorPanel";

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
                    {/*Manage Members*/}
                    <HubForm
                        hub={currentHub}
                        onSubmit={() => setEdit(false)}
                        onCancel={() => setEdit(false)}/>
                    <RegionSelectorPanel ownerId={currentHub.id}/>
                    <LinksForm ownerId={currentHub.id}/>
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