import Map, {Marker, PaddingOptions, type ViewState} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css"
import {useAtom, atom} from "jotai";
import * as React from "react";

const initialViewportState = {
    width: '100vw',
    height: '100vh',
    latitude: 0,
    longitude: 0,
    zoom: 0.5
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
        >
            {/*<Marker longitude={-122.4} latitude={37.8} color="red" />*/}
        </Map>
    )
}