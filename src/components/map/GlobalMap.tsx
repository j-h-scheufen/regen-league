// @ts-ignore
import DeckGL from '@deck.gl/react/typed';
import {GeoJsonLayer, ArcLayer} from '@deck.gl/layers/typed';
import {MapboxOverlay, MapboxOverlayProps} from '@deck.gl/mapbox/typed';
import {Map as MapboxMap, useControl} from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css"
import {useAtom, atom, useAtomValue} from "jotai";
import {waitForAll} from "jotai/utils";
import {geoJsonHubsAtom, geoJsonPeopleAtom, geoJsonPlatformsAtom, geoJsonProjectsAtom} from "../../state/global";
import {booleanLiteral} from "@babel/types";
import {projectToHubCoordinatesAtom} from "../../state/map";

const hubColor = [21, 56, 161]
const projectColor = [50, 168, 96]

export type ActiveLayers = {
    hubs?: boolean
    projects?: boolean
    projects2hubs?: boolean
    platforms?: boolean
    people?: boolean
}

const initialViewState = {
    latitude: 0,
    longitude: 0,
    zoom: 0.5
}

function DeckGLOverlay(props: MapboxOverlayProps & {interleaved?: boolean}) {
    const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props))
    overlay.setProps(props)
    return null
}

const initialLayerVisibility: ActiveLayers = {hubs: true, projects: true}
export const layerToggleAtom = atom<ActiveLayers>(initialLayerVisibility)

export default function GlobalMap() {
    const [hubSource, projectSource, platformSource, peopleSource, projectToHubs] = useAtomValue(
        waitForAll([geoJsonHubsAtom, geoJsonProjectsAtom, geoJsonPlatformsAtom, geoJsonPeopleAtom, projectToHubCoordinatesAtom]))
    const [activeLayers, setActiveLayers] = useAtom(layerToggleAtom)

    const onClick = (info: {object?: any}) => {
        if (info.object) {
            // eslint-disable-next-line
            alert(`${info.object.properties.name} (${info.object.properties.id})`);
        }
    };

    const layers = [
        new GeoJsonLayer({
            id: 'hubs-layer',
            //@ts-ignore
            data: hubSource,
            visible: activeLayers.hubs,
            // Styles
            filled: true,
            pointRadiusMinPixels: 5,
            pointRadiusScale: 200,
            getPointRadius: (f: {properties?: any}) => 11 - f.properties.scalerank,
            getFillColor: [21, 56, 161, 200],
            // Interactive props
            pickable: true,
            autoHighlight: true,
            onClick
        }),
        new GeoJsonLayer({
            id: 'projects-layer',
            //@ts-ignore
            data: projectSource,
            visible: activeLayers.projects,
            // Styles
            filled: true,
            pointRadiusMinPixels: 4,
            pointRadiusScale: 200,
            getPointRadius: (f: {properties?: any}) => 11 - f.properties.scalerank,
            getFillColor: [50, 168, 96, 200],
            // Interactive props
            pickable: true,
            autoHighlight: true,
            onClick
        }),
        new ArcLayer({
            id: 'projects2hubs-layer',
            data: projectToHubs,
            visible: activeLayers.projects2hubs,
            // dataTransform: d => d.features.filter(f => f.properties.scalerank < 4),
            // Styles
            getSourcePosition: f => f.source,
            getTargetPosition: f => f.target,
            getSourceColor: [50, 168, 96],
            getTargetColor: [21, 56, 161],
            getWidth: 5,
            widthMinPixels: 2
        })
    ];

    return (
            <MapboxMap
                initialViewState={initialViewState}
                mapStyle="mapbox://styles/mapbox/satellite-v9"
                projection="naturalEarth"
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                attributionControl={false}
                reuseMaps={true}>
                <DeckGLOverlay
                    layers={layers}/>
            </MapboxMap>
    )
}
