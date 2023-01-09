import {Box, Card, CardBody, CardHeader, DataTable, Heading, Layer, Page, Paragraph, Text} from 'grommet'
import {Suspense} from "react";
import {useAtom, useAtomValue} from "jotai";

import GlobalMap, {ActiveLayersConfig, layerToggleAtom} from "../components/map/GlobalMap";
import {entitiesListAtom, selectedEntityLinksAtom, selectedFeatureAtom} from "../state/map";
import LinksCard from "../components/LinksCard";
import EntityTypeSelector, {filteredListAtom} from "../components/entity/EntityTypeSelector";
import {EntityType} from "../utils/types";
import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import {getEntitiesByType, getHubs, getServerClient} from "../utils/supabase";
import {useHydrateAtoms} from "jotai/utils";
import SuspenseSpinner from "../components/utils/SuspenseSpinner";

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
    const filteredEntities = useAtomValue(filteredListAtom)

    return (
        <Page width="large" align="center">
            <Box height="500px" width="900px">
                <GlobalMap initialLayers={initialLayerVisibility}/>
            </Box>
            <Box margin={{top: 'small'}}>
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
            </Box>
            <Box margin={{top: 'small'}}>
                <DataTable
                    data={filteredEntities}
                    columns={[
                        {
                            property: 'name',
                            header: <Text>Name</Text>,
                            primary: true,
                            search: true
                        },
                        {
                            property: 'description',
                            header: 'Description',
                            render: e => (<Box width="600px"><Text truncate>{e.description}</Text></Box>),
                        },
                    ]}>
                </DataTable>
            </Box>
            {selectedFeature && (
                // <Suspense fallback="Loading ..."> {/* Required to avoid infinite loop with async atoms that were not preloaded */}
                    <Layer
                    id="selectionFlyOut"
                    position="right"
                    onClickOutside={() => setSelectedFeature(null)}
                    onEsc={() => setSelectedFeature(null)}
                    animation="slide"
                    modal={false}
                    plain={true}
                    full="vertical"
                >
                    <Box
                        width="50%"
                        height="100%"
                        background="white"
                        alignSelf="end"
                    >
                        <Card>
                            <CardHeader elevation="medium" justify="center">
                                <Heading level={3}>{selectedFeature.properties?.name}</Heading>
                            </CardHeader>

                            <CardBody gap="small">
                                <Box overflow="scroll">
                                    <Paragraph
                                        margin={{horizontal: 'medium'}}
                                        style={{whiteSpace: 'pre-wrap'}}
                                        fill={true}
                                    >
                                        {selectedFeature.properties?.description}
                                    </Paragraph>
                                </Box>
                                <LinksCard links={selectedEntityLinks}/>
                            </CardBody>
                        </Card>
                    </Box>
                </Layer>
                // </Suspense>
            )}
        </Page>
    )
}
