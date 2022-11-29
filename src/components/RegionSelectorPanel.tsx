import {Box, Card, CardBody, Form, Button} from 'grommet'
import {useAtomValue, Provider as JotaiProvider, atom, useAtom} from "jotai";
import {waitForAll} from "jotai/utils";
import {useCallback} from "react";
import {useSupabaseClient} from "@supabase/auth-helpers-react";

import {epaCatalogAtom, oneEarthCatalogAtom, regionAssociationsAtom} from "../state/global";
import {RegionNode} from "../utils/types";
import RegionInfoSelector, {selectionAtom} from "./project/RegionInfoSelector";
import {updateRegionAssociations} from "../utils/supabase";

type Props = {
    ownerId: string
}

const oeSelectionAtom = atom<Array<RegionNode | null> | null>(null)
const epaSelectionAtom = atom<Array<RegionNode | null> | null>(null)
const customSelectionAtom = atom<RegionNode | null>(null)
const dirtyAtom = atom<boolean>(false)
const loadingAtom = atom<boolean>(false)

export default function RegionSelectorPanel({ ownerId }: Props) {
    const [oeCatalog, epaCatalog] = useAtomValue(waitForAll([oneEarthCatalogAtom, epaCatalogAtom]))
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
        if (oeSelection) {
            if (oeSelection.length > 0) {
                const region = oeSelection[oeSelection.length - 1]
                if (region?.id && region.level)
                    oeRegion = {id: region.id, level: region.level}
            }
            else
                oeRegion = null
        }
        if (epaSelection) {
            if (epaSelection.length > 0) {
                const region = epaSelection[epaSelection.length - 1]
                if (region?.id && region.level)
                    epaRegion = {id: region.id, level: region.level}
            }
            else
                epaRegion = null
        }

        const newRegions = await updateRegionAssociations(client, ownerId!, oeRegion, epaRegion,undefined)
        setAssociations(newRegions)
        console.log("AFTER UPDATE: "+JSON.stringify(newRegions))
    }, [client, oeSelection, epaSelection, setAssociations, ownerId])

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
                    {isDirty && (
                        <Box direction="row" gap="medium" justify="end" margin={{ right: "small", vertical: 'medium' }}>
                            <Button type="reset" label={loading ? 'Loading ...' : 'Reset'} disabled={loading} onClick={() => {}}/>
                            <Button type="submit" primary label={loading ? 'Loading ...' : 'Update'} disabled={loading}/>
                        </Box>
                    )}
                </Form>
            </CardBody>
        </Card>
    )
}