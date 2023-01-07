import {Box, Button, Card, CardBody, CardHeader, Heading, Layer, Page, Paragraph, TextArea} from 'grommet'
import * as React from "react";
import {Suspense} from "react";
import {useAtom, useAtomValue} from "jotai";

import GlobalMap, {layerToggleAtom} from "../components/map/GlobalMap";
import {selectedEntityLinksAtom, selectedFeatureAtom} from "../state/map";
import LinksCard from "../components/LinksCard";
import SuspenseSpinner from "../components/utils/SuspenseSpinner";

export default function MapPage() {
    const [activeLayers, setActiveLayers] = useAtom(layerToggleAtom)
    const [selectedFeature, setSelectedFeature] = useAtom(selectedFeatureAtom)
    const selectedEntityLinks = useAtomValue(selectedEntityLinksAtom)

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
            {selectedFeature && (
                <Layer
                    id="selectionModal"
                    position="center"
                    onClickOutside={() => setSelectedFeature(null)}
                    onEsc={() => setSelectedFeature(null)}
                    animation="slide"
                >
                        <Card>
                            <CardHeader elevation="medium" justify="center">
                                <Heading level={3}>{selectedFeature.properties?.name}</Heading>
                            </CardHeader>
                            <CardBody gap="small">
                                <Paragraph
                                    margin={{horizontal: 'medium'}}
                                    style={{whiteSpace: 'pre-wrap'}}
                                    maxLines={25}
                                    fill={true}
                                >
                                    {selectedFeature.properties?.description}
                                </Paragraph>
                                <LinksCard links={selectedEntityLinks}/>
                            </CardBody>
                        </Card>
                </Layer>
            )}
        </Page>
    )
}
