import {Box, Heading, Paragraph} from 'grommet'
import GlobalMap from "../components/map/GlobalMap";
import * as React from "react";
import dynamic from "next/dynamic";
import SuspenseSpinner from "../components/utils/SuspenseSpinner";

const DynamicMap = dynamic(() => import("../components/map/GlobalMap"), {
    loading: () => <Box align="center" margin={{vertical: "100px"}}><SuspenseSpinner/></Box>,
});


export default function HomePage() {
    return (
        <Box align="center" direction="column">
            <DynamicMap/>
            <Heading size="small">Welcome</Heading>
            <Paragraph>Regen League is the registration app to get an overview of the global Regen movement.
                Its main target audience are the DOers, the ones who go out and connect with projects on the ground or lead communities.</Paragraph>
        </Box>
    )
}
