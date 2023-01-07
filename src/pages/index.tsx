import {Box, Heading, Page, Paragraph, Text} from 'grommet'
import * as React from "react";

export default function HomePage() {
    return (
        <Page align="center">
            <Box align="center" width="large">
                <Heading size="small">Welcome</Heading>
                <Paragraph style={{whiteSpace: 'pre-wrap'}} fill>
                    Regen League is an App in service af Bioregionalism and the Regenerative Movement.
                </Paragraph>
                <Paragraph fill>
                    Regen League is ...
                </Paragraph>
                <ul>
                    <li style={{paddingTop: '5px'}}>An open data collection of global regen activity, like a geo-spatial &lsquo;Rolodex&rsquo; + LinkTree.</li>
                    <li style={{paddingTop: '5px'}}>A mapping tool for the Regen Community.</li>
                    <li style={{paddingTop: '5px'}}>A showcase for the breadth of regenerative efforts already happening around the globe.</li>
                    <li style={{paddingTop: '5px'}}>A way for people to find each other and connect.</li>
                    <li style={{paddingTop: '5px'}}>A funnel for new projects into the space to find tools, services, and platforms already in use by projects and hubs.</li>
                    <li style={{paddingTop: '5px'}}>Helping to meme into existence the proverbial and literal <i>Army of Regeneratoooors</i> the planet needs.</li>
                </ul>
            </Box>
        </Page>
    )
}
