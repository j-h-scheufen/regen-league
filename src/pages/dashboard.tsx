import {Box, Page} from 'grommet'
import * as React from "react";
import dynamic from "next/dynamic";
import SuspenseSpinner from "../components/utils/SuspenseSpinner";
import {Suspense} from "react";
import GlobalMap from "../components/map/GlobalMap";

export default function DashboardPage() {
    return (
        <Page width="large" align="center">
            <Box height="500px" width="900px">
                <GlobalMap/>
            </Box>
        </Page>
    )
}
