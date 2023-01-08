import {Box, Card, CardBody, CardHeader, Heading, Layer, Page, Paragraph} from 'grommet'
import * as React from "react";
import {useAtom, useAtomValue} from "jotai";

import GlobalMap, {ActiveLayersConfig, layerToggleAtom} from "../components/map/GlobalMap";
import {entitiesListAtom, selectedEntityLinksAtom, selectedFeatureAtom} from "../state/map";
import LinksCard from "../components/LinksCard";
import EntityTypeSelector, {filteredListAtom} from "../components/entity/EntityTypeSelector";
import {EntityType} from "../utils/types";
import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import {getEntitiesByType, getHubs, getServerClient} from "../utils/supabase";
import {useHydrateAtoms} from "jotai/utils";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const {client} = await getServerClient(ctx)
    const entities = await getEntitiesByType(client,[EntityType.PROJECT, EntityType.HUB])
    console.log("ENTITIES: ", entities)

    return {
        props: {
            entities: entities,
        },
    }
}

const initialLayerVisibility: ActiveLayersConfig = {hubs: true, projects: true} // see also defaultChecked on EntityTypeSelector

export default function MapPage({entities}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    useHydrateAtoms([[entitiesListAtom, entities]])
    const [activeLayers, setActiveLayers] = useAtom(layerToggleAtom)
    const [selectedFeature, setSelectedFeature] = useAtom(selectedFeatureAtom)
    const selectedEntityLinks = useAtomValue(selectedEntityLinksAtom)
    const availableEntities = useAtomValue(entitiesListAtom)
    const selectedEntities = useAtomValue(filteredListAtom)

    return (
        <Page width="large" align="center">
            <Box height="500px" width="900px">
                <GlobalMap initialLayers={initialLayerVisibility}/>
            </Box>
            <EntityTypeSelector
                entities={availableEntities}
                types={[EntityType.PROJECT, EntityType.HUB]}
                initialChecked={[EntityType.PROJECT, EntityType.HUB]}
                onChange={(selection) => {
                    setActiveLayers({...activeLayers,
                        hubs: selection.includes(EntityType.HUB),
                        projects: selection.includes(EntityType.PROJECT)
                    })
                }}/>
            <Paragraph>
                Available: {availableEntities?.length}
                Selected: {selectedEntities?.length}
            </Paragraph>
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
