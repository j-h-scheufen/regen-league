import {Box, Button, Card, CardBody, CardHeader, DataTable, Heading, Layer, Page, Paragraph, Text} from 'grommet'
import {Close} from "grommet-icons";
import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import {atom, useAtom, useAtomValue} from "jotai";
import {useHydrateAtoms} from "jotai/utils";

import {EntityType, LocationEntity} from "../utils/types";
import {currentEntityAtom} from "../state/global";
import {entitiesListAtom, entitiesMapAtom, selectedEntityLinksAtom} from "../state/map";
import GlobalMap, {ActiveLayersConfig, layerToggleAtom} from "../components/map/GlobalMap";
import LinksCard from "../components/LinksCard";
import EntityTypeSelector, {filteredListAtom} from "../components/entity/EntityTypeSelector";
import {getEntitiesByType, getServerClient} from "../utils/supabase";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const {client} = await getServerClient(ctx)
    const entities = await getEntitiesByType(client,[EntityType.PROJECT, EntityType.HUB])

    return {
        props: {
            entities: entities,
        },
    }
}

const initialLayerVisibility: ActiveLayersConfig = {hubs: true, projects: true} // see also defaultChecked on EntityTypeSelector
const showEntityAtom = atom<boolean>(false)

export default function MapPage({entities}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    useHydrateAtoms([[entitiesListAtom, entities]])
    const [activeLayers, setActiveLayers] = useAtom(layerToggleAtom)
    const [selectedEntity, setSelectedEntity] = useAtom(currentEntityAtom)
    const selectedEntityLinks = useAtomValue(selectedEntityLinksAtom)
    const entitiesList = useAtomValue(entitiesListAtom)
    const entitiesMap = useAtomValue(entitiesMapAtom)
    const filteredEntities = useAtomValue(filteredListAtom)
    const [showEntity, setShowEntity] = useAtom(showEntityAtom)

    return (
        <Page width="large" align="center">
            <Box height="500px" width="900px">
                <GlobalMap
                    initialLayers={initialLayerVisibility}
                    onSelection={(feature) => {
                        if (feature.properties?.id && feature.properties.id !== selectedEntity?.id) {
                            const newEntity = entitiesMap.get(feature.properties.id)
                            if (newEntity) {
                                setSelectedEntity(newEntity)
                                setShowEntity(true)
                            }
                            else
                                console.error('Data out of sync. Unable to find a corresponding Entity for a Feature selected on the map.')
                        }
                    }}
                />
            </Box>
            <Box margin={{top: 'small'}}>
                <EntityTypeSelector
                    entities={entitiesList}
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
            {selectedEntity && showEntity && (
                // <Suspense fallback="Loading ..."> {/* Required to avoid infinite loop with async atoms that were not preloaded */}
                    <Layer
                    id="selectionFlyOut"
                    position="right"
                    onClickOutside={() => setShowEntity(false)}
                    onEsc={() => setShowEntity(false)}
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
                            <CardHeader elevation="small" justify="center">
                                <Box pad={{left: 'medium'}}>
                                    <Button
                                        onClick={() => setShowEntity(false)}>
                                        <Close/>
                                    </Button>
                                </Box>
                                <Box flex>
                                    <Heading level={3}>{selectedEntity.name}</Heading>
                                </Box>
                            </CardHeader>

                            <CardBody gap="small">
                                <Box overflow="scroll">
                                    <Paragraph
                                        margin={{horizontal: 'medium'}}
                                        style={{whiteSpace: 'pre-wrap'}}
                                        fill={true}
                                    >
                                        {selectedEntity.description}
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
