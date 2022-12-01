import {Box, Card, CardBody, Form, Button} from 'grommet'
import {useAtomValue, Provider as JotaiProvider, atom, useAtom} from "jotai";
import {waitForAll} from "jotai/utils";
import {useCallback} from "react";
import {useSupabaseClient} from "@supabase/auth-helpers-react";

import {customCatalogAtom, epaCatalogAtom, oneEarthCatalogAtom, regionAssociationsAtom} from "../state/global";
import {RegionInfo, RegionNode} from "../utils/types";
import RegionInfoSelector, {selectionAtom} from "./project/RegionInfoSelector";
import {updateRegionAssociations} from "../utils/supabase";

type Props = {
    ownerId: string
}

const oeSelectionAtom = atom<RegionInfo | null>(null)
const epaSelectionAtom = atom<RegionInfo | null>(null)
const customSelectionAtom = atom<RegionInfo | null>(null)
const dirtyAtom = atom<boolean>(false)
const loadingAtom = atom<boolean>(false)

export default function RegionSelectorPanel({ ownerId }: Props) {
    const [oeCatalog, epaCatalog, customCatalog] = useAtomValue(waitForAll([oneEarthCatalogAtom, epaCatalogAtom, customCatalogAtom]))
    const [associations, setAssociations] = useAtom(regionAssociationsAtom)
    const [oeSelection, setOeSelection] = useAtom(oeSelectionAtom)
    const [epaSelection, setEpaSelection] = useAtom(epaSelectionAtom)
    const [customSelection, setCustomSelection] = useAtom(customSelectionAtom)
    const [isDirty, setDirty] = useAtom(dirtyAtom)
    const [loading, setLoading] = useAtom(loadingAtom)
    const client = useSupabaseClient()

    const updateRegions = useCallback(async () => {
        let oeRegion
        let epaRegion
        let customRegion
        if (oeSelection) {
            if (oeSelection.length > 0) { // the length of the array returned from the RegionInfoSelector reflects how many levels down were configured by the user
                const region = oeSelection[oeSelection.length - 1]
                if (region?.id && region.level)
                    oeRegion = {...region}
            }
            else
                oeRegion = null
        }
        if (epaSelection) {
            if (epaSelection.length > 0) {
                const region = epaSelection[epaSelection.length - 1]
                if (region?.id && region.level)
                    epaRegion = {...region}
            }
            else
                epaRegion = null
        }

        if (customSelection) {
            if (customSelection.length > 0) {
                const region = customSelection[customSelection.length - 1]
                if (region?.id && region.level)
                    customRegion = {...region}
            }
            else
                customRegion = null
        }

        const newRegions = await updateRegionAssociations(client, ownerId!, oeRegion, epaRegion, customRegion)
        setAssociations(newRegions)
    }, [client, oeSelection, epaSelection, customSelection, setAssociations, ownerId])

    return (
        <Card pad="medium">
            {/*<CardHeader pad="small">Region Info</CardHeader>*/}
            <CardBody direction="column">
                <Form
                    onSubmit={() => {
                        updateRegions();
                        setDirty(false)
                    }}>
                    <JotaiProvider initialValues={[[selectionAtom, associations?.oneEarth || null]] as const}>
                        <RegionInfoSelector
                            title="One Earth"
                            regions={[oeCatalog.level1, oeCatalog.level2, oeCatalog.level3]}
                            labels={['Realm', 'Subrealm', 'Bioregion']}
                            onChange={(update) => {
                                setOeSelection(update)
                                setDirty(true)
                            }}
                        />
                    </JotaiProvider>
                    <JotaiProvider initialValues={[[selectionAtom, associations?.epa || null]] as const}>
                        <RegionInfoSelector
                            title="EPA"
                            regions={[epaCatalog.level1, epaCatalog.level2]}
                            labels={['Level 1', 'Level 2']}
                            onChange={(update) => {
                                setEpaSelection(update)
                                setDirty(true)
                            }}
                        />
                    </JotaiProvider>
                    <JotaiProvider initialValues={[[selectionAtom, associations?.custom || null]] as const}>
                        <RegionInfoSelector
                            title="Other"
                            regions={[customCatalog.level1]}
                            labels={[]}
                            onChange={(update) => {
                                setCustomSelection(update)
                                setDirty(true)
                            }}
                        />
                    </JotaiProvider>
                    <Box direction="row" gap="medium" justify="end" margin={{ right: "small", vertical: 'medium' }}>
                        <Button type="submit" primary label={loading ? 'Loading ...' : 'Update'} disabled={loading || !isDirty}/>
                    </Box>
                </Form>
            </CardBody>
        </Card>
    )
}