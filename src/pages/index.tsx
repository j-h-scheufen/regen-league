import {Box, Heading, Paragraph} from 'grommet'
import * as React from "react";

export default function HomePage() {
    return (
        <Box align="center" direction="column">
            <Heading size="small">Welcome</Heading>
            <Paragraph fill>Regen League is the registration app to get an overview of the global Regen movement.
                Its main target audience are the DOers, the ones who go out and connect with projects on the ground or lead communities.</Paragraph>
        </Box>
    )
}
