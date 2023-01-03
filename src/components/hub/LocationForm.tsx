import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Text,
} from 'grommet'
import {useCallback} from 'react'
import {atom, useAtom, useAtomValue} from "jotai";
import {useHydrateAtoms} from "jotai/utils";
import {Position} from "geojson";

import {GeoLocation, LocationEntity} from "../../utils/types";
import * as React from "react";
import LocationMap, {currentSelectionAtom, dirtyAtom} from "../map/LocationMap";
import dynamic from "next/dynamic";
import SuspenseSpinner from "../utils/SuspenseSpinner";

const DynamicMap = dynamic(() => import("../map/LocationMap"), {
    loading: () => <Box align="center" margin={{vertical: "100px"}}><SuspenseSpinner/></Box>,
    ssr: false
});

type Props = {
    entity: LocationEntity
    update: (location: GeoLocation) => Promise<void>
}

const loadingAtom = atom<boolean>(false)
const editAtom = atom<boolean>(false)
const editPositionAtom = atom<Position>([0,0])

export default function LocationForm({entity, update}: Props) {
    if(!entity)
        throw Error('This component requires a LocationEntity')

    useHydrateAtoms([[currentSelectionAtom, {position: entity.position, geometry: entity.geometry}]] as const)
    const [edit, setEdit] = useAtom(editAtom)
    const [loading, setLoading] = useAtom(loadingAtom)
    const [selection, setSelection] = useAtom(currentSelectionAtom)
    const isDirty = useAtomValue(dirtyAtom)

    const saveLocation = useCallback( async () => {
        try {
            setLoading(true)
            if (selection)
                await update(selection)
        } catch (error) {
            console.error(error)
            throw error
        } finally {
            setLoading(false)
        }
    }, [selection, setLoading, update])

    return (
        <Card pad="small" margin={{vertical: "small"}}>
            <CardHeader justify="center"><Text size="large">Location</Text></CardHeader>
            <CardBody>
                <Box pad="small">
                    <Box direction="row">
                        <Box>
                            <Text>Lng: {selection.position?.at(0)}</Text>
                            <Text>Lat: {selection.position?.at(1)}</Text>
                        </Box>
                        {!edit && (
                            <Button
                                label="Change"
                                style={{textAlign: 'center'}}
                                onClick={() => setEdit(true)}
                                margin={{vertical: "small", left: "auto"}}/>
                        )}
                    </Box>
                    {edit && (
                        <Box height="400px">
                            <LocationMap/>
                            <Box direction="row">
                                <Button
                                    label="Cancel"
                                    style={{textAlign: 'center'}}
                                    onClick={() => {
                                        setSelection({position: entity.position, geometry: entity.geometry})
                                        setEdit(false)
                                    }}
                                    margin={{vertical: "small", left: "auto"}}/>
                                <Button
                                    primary
                                    label={loading ? 'Loading ...' : 'Save'}
                                    type="submit"
                                    style={{textAlign: 'center'}}
                                    margin={{vertical: "small", left: "small"}}
                                    onClick={() => saveLocation().then(() => setEdit(false))}
                                    disabled={!isDirty || loading}/>
                            </Box>
                        </Box>
                    )}
                </Box>
            </CardBody>
        </Card>
    )
}