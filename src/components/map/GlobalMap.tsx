import Map, {Marker, type ViewState} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css"
import {useAtom, atom} from "jotai";
import * as React from "react";

const initialViewportState: ViewState = {
    longitude: 0,
    latitude: 0,
    zoom: 0.5,
    bearing: 0,
    pitch: 0,
    padding: {top: 0, bottom: 0, left: 0, right: 0}
}

const viewportAtom = atom(initialViewportState)

export default function GlobalMap() {

    return (
        <Map
            initialViewState={{
                latitude: 0,
                longitude: 0,
                zoom: 0.75,
            }}
            style={{width: 900, height: 400}}
            // minZoom={0.75}
            mapStyle="mapbox://styles/mapbox/satellite-v9"
            projection="naturalEarth"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            attributionControl={false}
            reuseMaps={true} // keeps the Map in memory and avoids "billable" events for constructing a new MapBox map
        />
    )
}