import {useRef, useEffect} from "react"
import "mapbox-gl/dist/mapbox-gl.css"
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
// @ts-ignore
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import * as mapboxgl from "mapbox-gl";
import {atom, useAtom} from "jotai";
import {Feature, Position} from "geojson";

type Props = {
    position?: Position
    zoom?: number
}

export type GeoSelection = {
    position?: Position,
    feature?: Feature
}

export const currentSelectionAtom = atom<GeoSelection>({})
export const dirtyAtom = atom<boolean>(false)
const mapAtom = atom<mapboxgl.Map | null>(null)

export default function LocationMap({zoom}: Props) {
    const [map, setMap] = useAtom(mapAtom)
    const [selection , setSelection] = useAtom(currentSelectionAtom)
    const [isDirty, setDirty] = useAtom(dirtyAtom)

    const mapNode = useRef(null)

    useEffect(() => {
        const node = mapNode.current
        // if the window object is not found, that means
        // the component is rendered on the server
        // or the dom node is not initialized, then return early
        if (typeof window === "undefined" || node === null) return

        console.log('Creating a new Map!')

        const mapboxMap = new mapboxgl.Map({
            container: node,
            accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [0, 0],
            zoom: zoom || 4,
        });

        mapboxMap.setCenter(selection.position as [number,number])

        const geocoder = new MapboxGeocoder({
            accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
            types: 'country,region,district,place,locality,neighborhood,address',
            marker: {
                color: 'red'
            },
            enableEventLogging: false,
            mapboxgl: mapboxgl
        });
        geocoder.on('result', (e: {result: Feature & {center: number[]}}) => {
            console.log('Geocoder result: ', e.result)
            setSelection({position: e.result.center, feature: e.result})
            setDirty(true)
        })
        mapboxMap.on('click', (e) => {
            console.log(`A click event has occurred at ${e.lngLat}`);
            setSelection({position: [e.lngLat.lng, e.lngLat.lat]})
            setDirty(true)
        });
        mapboxMap.addControl(geocoder, 'top-left');
        setMap(mapboxMap);

        return () => {
            console.log('Unmounting Map!')
            mapboxMap.remove();
        };
    }, []);

    return <div ref={mapNode} style={{ width: "100%", height: "100%" }} />;
}