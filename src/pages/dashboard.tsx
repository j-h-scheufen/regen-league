import {Box, Heading, Paragraph} from 'grommet'
import * as React from "react";
import dynamic from "next/dynamic";
import SuspenseSpinner from "../components/utils/SuspenseSpinner";

const DynamicMap = dynamic(() => import("../components/map/GlobalMap"), {
    loading: () => <Box align="center" margin={{vertical: "100px"}}><SuspenseSpinner/></Box>,
});


export default function DashboardPage() {
    return (
        <Box align="center" direction="column">
            <DynamicMap/>
        </Box>
    )
}
