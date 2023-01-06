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
            <Box direction="row" justify="between" gap="medium" margin={{top: 'small'}}>
                <Button label="Hubs" onClick={() => setActiveLayers({hubs: true})}/>
                <Button label="Projects" onClick={() => setActiveLayers({projects: true})}/>
                <Button label="Both" onClick={() => setActiveLayers({hubs: true, projects: true, projects2hubs: true})}/>
            </Box>
        </Page>
    )
}
