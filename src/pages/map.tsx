import {Box, Page} from 'grommet'
import * as React from "react";
import GlobalMap from "../components/map/GlobalMap";

export default function MapPage() {
    return (
        <Page width="large" align="center">
            <Box height="500px" width="900px">
                <GlobalMap/>
            </Box>
        </Page>
    )
}
