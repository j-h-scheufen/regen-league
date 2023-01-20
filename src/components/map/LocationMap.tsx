import { useRef, useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
// @ts-ignore
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import * as mapboxgl from "mapbox-gl";
import { atom, useAtom } from "jotai";
import { Feature, Position } from "geojson";

import { locationMapAtom } from "../../state/global";
import { GeoLocation } from "../../utils/types";
import { AttributionControl, Marker } from "mapbox-gl";

type Props = {
    position?: Position;
    zoom?: number;
};

export const currentSelectionAtom = atom<GeoLocation>({
    position: null,
    geometry: null,
});
export const dirtyAtom = atom<boolean>(false);

export default function LocationMap({ zoom }: Props) {
    const [map, setMap] = useAtom(locationMapAtom);
    const [selection, setSelection] = useAtom(currentSelectionAtom);
    const [isDirty, setDirty] = useAtom(dirtyAtom);

    const mapNode = useRef<HTMLDivElement | null>(null);
    const marker = useRef<Marker | null>(null);

    const createMap = (container: HTMLDivElement): mapboxgl.Map => {
        const map = new mapboxgl.Map({
            container: container,
            accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
            style: "mapbox://styles/mapbox/streets-v11",
            center: (selection.position as [number, number]) || [0, 0],
            zoom: zoom || 4,
        });

        const geocoder = new MapboxGeocoder({
            accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
            types: "country,region,district,place,locality,neighborhood,address",
            // marker: {color: 'red'},
            enableEventLogging: false,
            mapboxgl: mapboxgl,
        });
        geocoder.on(
            "result",
            (e: { result: Feature & { center: number[] } }) => {
                console.log("Geocoder result: ", e.result);
                setSelection({
                    position: e.result.center,
                    geometry: e.result.geometry,
                });
                marker.current?.remove();
                marker.current = new Marker({ color: "red" })
                    .setLngLat(e.result.center as [number, number])
                    .addTo(map);
                setDirty(true);
            }
        );
        map.on("click", (e) => {
            console.log(`A click event has occurred at ${e.lngLat}`);
            setSelection({
                position: [e.lngLat.lng, e.lngLat.lat],
                geometry: {
                    type: "Point",
                    coordinates: [e.lngLat.lng, e.lngLat.lat],
                },
            });
            marker.current?.remove();
            marker.current = new Marker({ color: "red" })
                .setLngLat(e.lngLat)
                .addTo(map);
            setDirty(true);
        });
        map.addControl(geocoder, "top-left");
        map.addControl(new AttributionControl({ compact: true }));
        return map;
    };

    useEffect(() => {
        if (typeof window === "undefined" || mapNode.current === null) return;

        console.log("Creating a new Map!");
        const newMap = createMap(mapNode.current);
        if (selection.position) {
            marker.current = new Marker({ color: "red" })
                .setLngLat(selection.position as [number, number])
                .addTo(newMap);
        }
        setMap(newMap);

        return () => {
            newMap.remove();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div ref={mapNode} style={{ width: "100%", height: "100%" }} />;
}
