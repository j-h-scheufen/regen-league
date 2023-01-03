import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Form,
    Text,
} from 'grommet'
import {useCallback} from 'react'
import {atom, useAtom, useAtomValue} from "jotai";
import {useHydrateAtoms} from "jotai/utils";
import {Position} from "geojson";

import {LocationEntity} from "../../utils/types";
import * as React from "react";
import LocationMap, {currentSelectionAtom, dirtyAtom} from "../map/LocationMap";

type Props = {
    entity: LocationEntity
    update: (newPosition: Position) => Promise<void>
}

const loadingAtom = atom<boolean>(false)
const editAtom = atom<boolean>(false)
const editPositionAtom = atom<Position>([0,0])

export default function LocationForm({entity, update}: Props) {
    if(!entity)
        throw Error('This component requires a LocationEntity')

    useHydrateAtoms([[currentSelectionAtom, {position: entity.position}]] as const)
    const [edit, setEdit] = useAtom(editAtom)
    const [loading, setLoading] = useAtom(loadingAtom)
    const isDirty = useAtomValue(dirtyAtom)
    const selection = useAtomValue(currentSelectionAtom)

    const updatePosition = useCallback( async () => {
        try {
            setLoading(true)
            if (selection.position)
                await update(selection.position)
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
                            <Text>Position: {JSON.stringify(selection.position)}</Text>
                            <Text>Geometry: {JSON.stringify(selection.feature?.geometry)}</Text>
                        </Box>
                        {!edit ? (
                            <Button
                                label="Change"
                                style={{textAlign: 'center'}}
                                onClick={() => setEdit(true)}
                                margin={{vertical: "small", left: "auto"}}/>
                        ) : (
                            <Button
                                primary
                                label={loading ? 'Loading ...' : 'Save'}
                                type="submit"
                                style={{textAlign: 'center'}}
                                margin={{vertical: "small", left: "auto"}}
                                onClick={() => setEdit(false)}
                                disabled={!isDirty || loading}/>
                        )}
                    </Box>
                    {edit && (
                        <Box height="400px">
                            <LocationMap/>
                        </Box>
                    )}
                </Box>
            </CardBody>
        </Card>
    )
}