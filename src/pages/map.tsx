import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  DataTable,
  Heading,
  Page,
  Paragraph,
  Text,
} from "grommet";
import { Close } from "grommet-icons";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { atom, useAtom, useAtomValue } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import React, { KeyboardEventHandler } from "react";

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
import { useEventListener } from "../hooks/useEventListener";

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
  projects2hubs: false,
}; // see also defaultChecked on EntityTypeSelector

const showEntityAtom = atom<boolean>(false);
const viewModeAtom = atom<ViewMode>(ViewMode.MAP);

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
  const [showEntity, setShowEntity] = useAtom(showEntityAtom);
  const [viewMode, setViewMode] = useAtom(viewModeAtom);

  const handleKeyUp: KeyboardEventHandler = (event) => {
    if (event.key === "Escape") {
      setShowEntity(false);
    }
  };

  // add an event listener to the page (in this case, we're binding an event listener to the 'keyup' action)
  // by using this, you don't need to worry about binding an event listener to a component, so it's more reliable
  useEventListener("keyup", handleKeyUp);

  const ViewModeToggle = () => {
    switch (viewMode) {
      case ViewMode.MAP:
        return (
          <Button
            size="small"
            label="Search / Filter"
            onClick={() => setViewMode(ViewMode.TABLE)}
          />
        );
      case ViewMode.TABLE:
        return (
          <Button
            size="small"
            label="View on Map"
            onClick={() => setViewMode(ViewMode.MAP)}
          />
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

      {viewMode == ViewMode.MAP && (
        <Box style={{ height: "80vh", width: "100vw", position: "relative" }}>
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
                  setShowEntity(true);
                } else
                  console.error(
                    "Data out of sync. Unable to find a corresponding Entity for a Feature selected on the map."
                  );
              }
            }}
          />
        </Box>
      )}

      {viewMode == ViewMode.TABLE && (
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
              setShowEntity(true);
            }}
          />
        </Box>
      )}

      {/* We can just use a Box with some custom styles here to replicate a sidebar, while also allowing clicks elsewhere on the page */}
      {selectedEntity && showEntity && (
        <Box
          width="50%"
          height="100%"
          background="white"
          alignSelf="end"
          style={{
            position: "absolute",
            right: "0",
            top: "0",
            zIndex: "10",
          }}
        >
          <Card>
            <CardHeader elevation="small" justify="center">
              <Box pad={{ left: "medium" }}>
                <Button onClick={() => setShowEntity(false)}>
                  <Close />
                </Button>
              </Box>
              <Box flex>
                <Heading level={3}>{selectedEntity.name}</Heading>
              </Box>
            </CardHeader>

            <CardBody gap="small">
              <Box overflow="auto">
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
      )}
    </Page>
  );
}
