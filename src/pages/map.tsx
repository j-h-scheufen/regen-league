import {Box, Button, Page} from 'grommet'
import * as React from "react";
import GlobalMap, {layerToggleAtom} from "../components/map/GlobalMap";
import {useAtom} from "jotai";

export default function MapPage() {
    const [activeLayers, setActiveLayers] = useAtom(layerToggleAtom)
    return (
        <Page width="large" align="center">
            <Box height="500px" width="900px">
                <GlobalMap/>
            </Box>
            <Box direction="row" justify="between">
                <Button label="Toggle Hubs" onClick={() => setActiveLayers({...activeLayers, hubs: !activeLayers.hubs})}/>
                <Button label="Toggle Projects" onClick={() => setActiveLayers({...activeLayers, projects: !activeLayers.projects})}/>
            </Box>
        </Page>
    )
}
