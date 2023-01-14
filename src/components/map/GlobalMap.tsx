// @ts-ignore
import DeckGL, {PickingInfo, HoverInfo} from '@deck.gl/react/typed';
import {GeoJsonLayer, ArcLayer} from '@deck.gl/layers/typed';
import {MapboxOverlay, MapboxOverlayProps} from '@deck.gl/mapbox/typed';
import {Map as MapboxMap, Popup, useControl, ViewState} from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css"
import {Feature, Point} from "geojson";
import {Cluster} from 'grommet-icons'
import {useAtom, atom, useAtomValue} from "jotai";
import {useHydrateAtoms, waitForAll} from "jotai/utils";

import {geoJsonHubsAtom, geoJsonPeopleAtom, geoJsonPlatformsAtom, geoJsonProjectsAtom} from "../../state/global";
import {projectToHubCoordinatesAtom, selectedFeatureAtom} from "../../state/map";

type Props = {
    initialLayers?: ActiveLayersConfig
    onSelection: (feature: Feature) => void
}

const hubColor = [21, 56, 161]
const projectColor = [50, 168, 96]

export type ActiveLayersConfig = {
    hubs?: boolean
    projects?: boolean
    projects2hubs?: boolean
    platforms?: boolean
    people?: boolean
}

const initialViewState = {
    latitude: 0,
    longitude: 0,
    zoom: 0.75
}

const viewStateAtom = atom<ViewState | null>(null)

function DeckGLOverlay(props: MapboxOverlayProps & {interleaved?: boolean}) {
    const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props))
    overlay.setProps(props)
    return null
}

export const layerToggleAtom = atom<ActiveLayersConfig>({})
export const hoverFeatureAtom = atom<Feature | null>(null)

export default function GlobalMap({initialLayers, onSelection}: Props) {
    const [hubSource, projectSource, platformSource, peopleSource, projectToHubs] = useAtomValue(
        waitForAll([geoJsonHubsAtom, geoJsonProjectsAtom, geoJsonPlatformsAtom, geoJsonPeopleAtom, projectToHubCoordinatesAtom]))
    useHydrateAtoms([[layerToggleAtom, initialLayers || {}]])
    const [viewState, setViewState] = useAtom(viewStateAtom)
    const [activeLayers, setActiveLayers] = useAtom(layerToggleAtom)
    const [selectedFeature, setSelectedFeature] = useAtom(selectedFeatureAtom)
    const [hoverFeature, setHoverFeature] = useAtom(hoverFeatureAtom)

    const onClick = (source: PickingInfo) => {
        if (source.object) {
            setSelectedFeature(source.object)
            onSelection(source.object)
        }
    };

    const layers = [
        new GeoJsonLayer({
            id: 'hubs-layer',
            //@ts-ignore
            data: hubSource,
            visible: activeLayers.hubs,
            pointType:'circle',
            filled: true,
            pointRadiusMinPixels: 5,
            pointRadiusScale: 200,
            getPointRadius: (f: {properties?: any}) => 11 - f.properties.scalerank,
            getLineColor: [232, 12, 12],
            getLineWidth: 2,
            lineWidthUnits: 'pixels',
            lineWidthMinPixels: 1,
            lineWidthMaxPixels: 3,
            getFillColor: [21, 56, 161, 200],
            pickable: true,
            autoHighlight: true,
        }),
        new GeoJsonLayer({
            id: 'projects-layer',
            //@ts-ignore
            data: projectSource,
            visible: activeLayers.projects,
            filled: true,
            pointRadiusMinPixels: 4,
            pointRadiusScale: 200,
            getPointRadius: (f: {properties?: any}) => 11 - f.properties.scalerank,
            getLineColor: [232, 12, 12],
            getLineWidth: 2,
            lineWidthUnits: 'pixels',
            lineWidthMinPixels: 1,
            lineWidthMaxPixels: 3,
            getFillColor: [50, 168, 96, 200],
            pickable: true,
            autoHighlight: true,
        }),
        new ArcLayer({
            id: 'projects2hubs-layer',
            data: projectToHubs,
            visible: activeLayers.projects2hubs,
            // dataTransform: d => d.features.filter(f => f.properties.scalerank < 4),
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
                // projection="naturalEarth"
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                attributionControl={false}
                reuseMaps={true}>
                <DeckGLOverlay
                    layers={layers}
                    pickingRadius={3}
                    getTooltip={(info: HoverInfo) => {
                        if (info.object) {
                            return info.object.properties.name || 'No Name'
                        }
                    }}
                    onClick={onClick}
                    // onViewStateChange={(state) => setViewState(state)}
                />
                {hoverFeature && (
                    <Popup
                        longitude={(hoverFeature.geometry as Point).coordinates[0]}
                        latitude={(hoverFeature.geometry as Point).coordinates[1]}
                        closeButton={false}
                        anchor="bottom"
                        style={{zIndex: 100}}
                    >
                        {hoverFeature.properties?.name}
                    </Popup>)}
            </MapboxMap>
    )
}
