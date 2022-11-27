import {Box, Form, FormField, Select} from 'grommet'
import {atom, useAtom} from "jotai";

import {RegionNode} from "../../utils/types";

type Props = {
    regions: Array<Array<RegionNode>>
    categories: Array<string>
    selection: Array<RegionNode>
}

const selectionAtom = atom<Array<RegionNode | null>>([])

export default function RegionInfoSelector({regions, categories, selection}: Props) {

    const [currentSelection, setSelection] = useAtom(selectionAtom)
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
        <Form>
            <Box direction="row">
                {regions.map((nodes, idx) => {
                    return (
                        <FormField key={idx} htmlFor={'select_'+idx} label={categories[idx]}>
                            <Select
                                id={'select_'+idx}
                                name={'name_'+idx}
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

        </Form>
    )
}