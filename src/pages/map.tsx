import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  DataTable,
  Heading,
  Layer,
  Page,
  Paragraph,
  Text,
} from "grommet";
import { Close } from "grommet-icons";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { atom, useAtom, useAtomValue } from "jotai";
import { useHydrateAtoms } from "jotai/utils";

import { EntityType, LocationEntity } from "../utils/types";
import { currentEntityAtom } from "../state/global";
import {
  entitiesListAtom,
  entitiesMapAtom,
  selectedEntityLinksAtom,
} from "../state/map";
import GlobalMap, {
  ActiveLayersConfig,
  layerToggleAtom,
} from "../components/map/GlobalMap";
import LinksCard from "../components/LinksCard";
import EntityTypeSelector, {
  filteredListAtom,
} from "../components/entity/EntityTypeSelector";
import { getEntitiesByType, getServerClient } from "../utils/supabase";
import React from "react";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { client } = await getServerClient(ctx);
  const entities = await getEntitiesByType(client, [
    EntityType.PROJECT,
    EntityType.HUB,
  ]);

  return {
    props: {
      entities: entities,
    },
  };
};

export enum ViewMode {
  TABLE = "Search",
  MAP = "Map",
}

type PageState = {
  showEntity: boolean;
  viewMode: ViewMode;
};

const initialLayerVisibility: ActiveLayersConfig = {
  hubs: true,
  projects: true,
}; // see also defaultChecked on EntityTypeSelector
const pageStateAtom = atom<PageState>({
  showEntity: false,
  viewMode: ViewMode.MAP,
});

export default function MapPage({
  entities,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  useHydrateAtoms([[entitiesListAtom, entities]]);
  const [activeLayers, setActiveLayers] = useAtom(layerToggleAtom);
  const [selectedEntity, setSelectedEntity] = useAtom(currentEntityAtom);
  const selectedEntityLinks = useAtomValue(selectedEntityLinksAtom);
  const entitiesList = useAtomValue(entitiesListAtom);
  const entitiesMap = useAtomValue(entitiesMapAtom);
  const filteredEntities = useAtomValue(filteredListAtom);
  const [pageState, setPageState] = useAtom(pageStateAtom);

  const ViewModeToggle = () => {
    switch (pageState.viewMode) {
      case ViewMode.MAP:
        return (
          <Button
            size="small"
            label="Search / Filter"
            onClick={() =>
              setPageState({ ...pageState, viewMode: ViewMode.TABLE })
            }
          />
        );
      case ViewMode.TABLE:
        return (
          <Button
            size="small"
            label="View on Map"
            onClick={() =>
              setPageState({ ...pageState, viewMode: ViewMode.MAP })
            }
          />
        );
    }
  };

  const MainContent = () => {
    switch (pageState.viewMode) {
      case ViewMode.MAP:
        return (
          <Box height="80vh" width="100vw">
            <GlobalMap
              initialLayers={initialLayerVisibility}
              onSelection={(feature) => {
                if (
                  feature.properties?.id &&
                  feature.properties.id !== selectedEntity?.id
                ) {
                  const newEntity = entitiesMap.get(feature.properties.id);
                  if (newEntity) {
                    setSelectedEntity(newEntity);
                    setPageState({ ...pageState, showEntity: true });
                  } else
                    console.error(
                      "Data out of sync. Unable to find a corresponding Entity for a Feature selected on the map."
                    );
                }
              }}
            />
          </Box>
        );
      case ViewMode.TABLE:
        return (
          <Box>
            <DataTable
              step={10}
              data={filteredEntities}
              style={{ width: "100vw" }}
              columns={[
                {
                  property: "name",
                  header: <Text>Name</Text>,
                  primary: true,
                  search: true,
                },
                {
                  property: "description",
                  header: "Description",
                  render: (e) => (
                    <Box width="600px">
                      <Text truncate>{e.description}</Text>
                    </Box>
                  ),
                },
              ]}
              onClickRow={(event) => {
                setSelectedEntity(event.datum as LocationEntity);
                setPageState({ ...pageState, showEntity: true });
              }}
            />
          </Box>
        );
    }
  };

  return (
    <Page width="large" align="center">
      <Box direction="row" margin={{ vertical: "small" }} gap="large">
        <Text alignSelf="center">Found {filteredEntities.length} Entities</Text>
        <EntityTypeSelector
          entities={entitiesList}
          types={[EntityType.PROJECT, EntityType.HUB]}
          initialChecked={[EntityType.PROJECT, EntityType.HUB]}
          onChange={(selection) => {
            setActiveLayers({
              ...activeLayers,
              hubs: selection.includes(EntityType.HUB),
              projects: selection.includes(EntityType.PROJECT),
            });
          }}
        />
        <ViewModeToggle />
      </Box>

      <MainContent />

      {selectedEntity && pageState.showEntity && (
        <Layer
          id="selectionFlyOut"
          position="right"
          onClickOutside={() =>
            setPageState({ ...pageState, showEntity: false })
          }
          onEsc={() => setPageState({ ...pageState, showEntity: false })}
          animation="slide"
          modal={false}
          plain={true}
          full="vertical"
        >
          <Box width="50%" height="100%" background="white" alignSelf="end">
            <Card>
              <CardHeader elevation="small" justify="center">
                <Box pad={{ left: "medium" }}>
                  <Button
                    onClick={() =>
                      setPageState({ ...pageState, showEntity: false })
                    }
                  >
                    <Close />
                  </Button>
                </Box>
                <Box flex>
                  <Heading level={3}>{selectedEntity.name}</Heading>
                </Box>
              </CardHeader>

              <CardBody gap="small">
                <Box overflow="scroll">
                  <Paragraph
                    margin={{ horizontal: "medium" }}
                    style={{ whiteSpace: "pre-wrap" }}
                    fill={true}
                  >
                    {selectedEntity.description}
                  </Paragraph>
                </Box>
                <LinksCard links={selectedEntityLinks} />
              </CardBody>
            </Card>
          </Box>
        </Layer>
      )}
    </Page>
  );
}
