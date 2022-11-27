import {Box, Form, FormField, Heading, Select} from 'grommet'
import {atom, useAtom} from "jotai";

import {RegionNode} from "../../utils/types";

type Props = {
    title: string
    regions: Array<Array<RegionNode>>
    labels: Array<string>
    selection: Array<RegionNode>
}

const selectionAtom = atom<Array<RegionNode | null>>([])
const dirtyAtom = atom<boolean>(false)

export default function RegionInfoSelector({title, regions, labels, selection}: Props) {
    const [currentSelection, setSelection] = useAtom(selectionAtom)
    const [dirty, setDirty] = useAtom(dirtyAtom)
    setSelection(selection)

    const updateSelection = (idx: number, node: RegionNode | null) => {
        currentSelection[idx] = node
        if (idx < currentSelection.length-1) {
            for (let step = idx+1; step < currentSelection.length; step++) {
                currentSelection[step] = null
            }
        }
        setSelection({...currentSelection})
    }

    function filterNodes(idx: number, nodes: Array<RegionNode>): Array<RegionNode> {
        if (idx <= 0)
            return nodes
        const parentRegion = currentSelection[idx-1]
        return nodes.filter((node) => node.parent === parentRegion?.id)
    }

    return (
        <Box direction="column">
            <Heading level={4} margin={{vertical: "xsmall"}}>{title}</Heading>
            <Box direction="row">
                {regions.map((nodes, idx) => {
                    const selectId = title+'_'+labels[idx]+'_selectId_'+idx
                    const selectName = title+'_'+labels[idx]+'_selectName_'+idx
                    return (
                        <FormField key={idx} htmlFor={selectId} label={labels[idx]}>
                            <Select
                                id={selectId}
                                name={selectName}
                                valueKey="id"
                                labelKey="name"
                                options={filterNodes(idx, nodes)}
                                value={currentSelection[idx] || undefined}
                                onChange={(event) => updateSelection(idx, event.value)}
                            />
                        </FormField>
                    )
                })}
            </Box>
        </Box>
    )
}