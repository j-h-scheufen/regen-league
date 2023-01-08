import {atom, useAtom} from "jotai";

import {EntityType, LocationEntity} from "../../utils/types";
import {CheckBoxGroup} from "grommet";
import {useHydrateAtoms} from "jotai/utils";
import {useEffect} from "react";

export const filteredListAtom = atom<Array<LocationEntity>>(new Array<LocationEntity>)

type Props = {
    entities: Array<LocationEntity>
    types: Array<EntityType>
    initialChecked?: Array<EntityType>
    onChange: (selection: Array<EntityType>) => void
}

type LabelDictionary = Record<EntityType, string>
const labels: LabelDictionary = {
    [EntityType.PROJECT]: 'Projects',
    [EntityType.HUB]: 'Hubs',
    [EntityType.PLATFORM]: 'Platforms',
    [EntityType.HUMAN]: 'People',
}

const selectionAtom = atom<Array<number>>([])

export default function EntityTypeSelector({entities, types, initialChecked, onChange}: Props) {
    useHydrateAtoms([[selectionAtom, initialChecked]] as const)
    const [selection, setSelection] = useAtom(selectionAtom)
    const [ , setFilteredList] = useAtom(filteredListAtom)

    const options = types.map((type) => {
        return {label: labels[type], value: type}
    })

    useEffect(() => {
        if (initialChecked)
            setFilteredList(entities.filter((e) => initialChecked.includes(e.type)))
    }, [entities, initialChecked, setFilteredList])

    return (
        <CheckBoxGroup
            direction="row"
            options={options}
            value={selection}
            labelKey="label"
            valueKey="value"
            onChange={(event) => {
                if (Array.isArray(event?.value)) {
                    const newValues = event?.value as EntityType[]
                    setSelection(newValues)
                    setFilteredList(entities.filter((e) => newValues.includes(e.type)))
                    onChange(newValues)
                }
            }}/>
    )
}