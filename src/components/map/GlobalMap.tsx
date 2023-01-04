import "mapbox-gl/dist/mapbox-gl.css"
import {useAtom, atom, useAtomValue} from "jotai";
import * as React from "react";
import * as mapboxgl from "mapbox-gl";
import {AttributionControl} from "mapbox-gl";
import {useEffect, useRef} from "react";
import {waitForAll} from "jotai/utils";

import {
    geoJsonHubsAtom,
    geoJsonPeopleAtom,
    geoJsonPlatformsAtom,
    geoJsonProjectsAtom, globalMapAtom,
} from "../../state/global";

// const initialViewportState = {
//     longitude: 0,
//     latitude: 0,
//     zoom: 0.75,
//     bearing: 0,
//     pitch: 0,
//     padding: {top: 0, bottom: 0, left: 0, right: 0}
// }

// const viewportAtom = atom(initialViewportState)

export default function GlobalMap() {
    const [hubSource, projectSource, platformSource, peopleSource] = useAtomValue(waitForAll([geoJsonHubsAtom, geoJsonProjectsAtom, geoJsonPlatformsAtom, geoJsonPeopleAtom]))
    const [globalMap, setGlobalMap] = useAtom(globalMapAtom)

    const mapNode = useRef<HTMLDivElement | null>(null)

    const createMap = (container: HTMLDivElement): mapboxgl.Map  => {
        const map = new mapboxgl.Map({
            container: container,
            accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
            // style: 'mapbox://styles/mapbox/satellite-v9', // style URL
            // projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
            style: 'mapbox://styles/mapbox/satellite-v9',
            // @ts-ignore
            projection: 'naturalEarth',
            zoom: 0.75,
        })

        map.on('load', (e) => {
            map.addSource('hubs', {
                type: 'geojson',
                data: hubSource
            });
            map.addSource('projects', {
                type: 'geojson',
                data: projectSource
            });

            map.addLayer({
                'id': 'hubs-layer',
                'type': 'circle',
                'source': 'hubs',
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'circle-radius': 4,
                    'circle-stroke-width': 2,
                    'circle-color': 'yellow',
                    'circle-stroke-color': 'white'
                }
            });
            map.addLayer({
                'id': 'projects-layer',
                'type': 'circle',
                'source': 'projects',
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'circle-radius': 3,
                    'circle-stroke-width': 1,
                    'circle-color': 'green',
                    'circle-stroke-color': 'white'
                }
            });
        })
        map.addControl(new AttributionControl({compact: true}))
        return map
    }

    useEffect(() => {

        if (typeof window === "undefined" || mapNode.current === null) return

        console.log('Creating a new Map!')
        const newMap = createMap(mapNode.current)
        setGlobalMap(newMap)

        return () => {
            newMap.remove()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div ref={mapNode} style={{ width: "100%", height: "100%" }} />;
}