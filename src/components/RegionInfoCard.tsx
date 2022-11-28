import {Box, Card, CardBody, Heading, Text, Form, Button} from 'grommet'
import Link from "next/link";
import {useAtomValue, Provider as JotaiProvider, atom, useAtom} from "jotai";
import {waitForAll} from "jotai/utils";

import {epaCatalogAtom, oneEarthCatalogAtom} from "../state/global";
import {RegionAssociations, RegionNode} from "../utils/types";
import RegionInfoSelector, {selectionAtom} from "./project/RegionInfoSelector";
import {updateRegionAssociations} from "../utils/supabase";
import {useCallback} from "react";
import {useSupabaseClient} from "@supabase/auth-helpers-react";

type Props = {
    associations: RegionAssociations | null
    editMode?: boolean
    ownerId?: string
    onUpdate?: (update: RegionAssociations) => void
}

const oeSelectionAtom = atom<Array<RegionNode | null> | null>(null)
const epaSelectionAtom = atom<Array<RegionNode | null> | null>(null)
const customSelectionAtom = atom<RegionNode | null>(null)
const dirtyAtom = atom<boolean>(false)
const loadingAtom = atom<boolean>(false)

export default function RegionInfoCard({associations, editMode, ownerId, onUpdate}: Props) {
    if (editMode && !onUpdate && !ownerId)
        throw Error('An ownerId and onUpdate function must be provided when using this component in editMode!')
    const [oeCatalog, epaCatalog] = useAtomValue(waitForAll([oneEarthCatalogAtom, epaCatalogAtom]))
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
        if (onUpdate)
            onUpdate(newRegions)
        console.log("AFTER UPDATE: "+JSON.stringify(newRegions))
    }, [client, oeSelection, epaSelection, onUpdate, ownerId])

    let content;
    if (!editMode && (!associations || (
        (!associations.oneEarth || associations.oneEarth.length === 0) &&
        (!associations.epa || associations.epa.length === 0) &&
        associations.custom.length === 0))) {
            content = (<Text>No region data configured!</Text>)
    }
    else {
        if (editMode) {
            content = (
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
            )
        } else {
            content = (
                <Box>
                    {associations?.oneEarth && associations.oneEarth.length > 0 && (
                        <Box direction="column">
                            <Heading level="4" margin={{vertical: "small"}}>One Earth</Heading>
                            <Box direction="row">
                                <Box basis="1/2">
                                    <Text>Realm: {associations.oneEarth[0] && (<Link
                                        href={associations.oneEarth[0]?.link || ''}>{associations.oneEarth[0]?.name}</Link>)}</Text>
                                </Box>
                                <Box basis="1/2">
                                    <Text>Bioregion: {associations.oneEarth[2] && (<Link
                                        href={associations.oneEarth[2].link || ''}>{associations.oneEarth[2].name}</Link>)}</Text>
                                </Box>
                            </Box>
                        </Box>
                    )}
                    {associations?.epa && associations.epa.length > 0 && (
                        <Box direction="column">
                            <Heading level="4" margin={{vertical: "small"}}>EPA</Heading>
                            <Box direction="row">
                                <Box basis="1/2">
                                    <Text>Level 1: {associations.epa[0] && (<Link
                                        href={associations.epa[0]?.link || ''}>{associations.epa[0]?.name}</Link>)}</Text>
                                </Box>
                                <Box basis="1/2">
                                    <Text>Level 2: {associations.epa[1] && (<Link
                                        href={associations.epa[1]?.link || ''}>{associations.epa[1]?.name}</Link>)}</Text>
                                </Box>
                            </Box>
                        </Box>
                    )}
                    {associations && associations.custom?.length > 0 && (
                        <Box direction="column">
                            <Heading level="4" margin={{vertical: "small"}}>Other</Heading>
                            {associations.custom.map((item) => (<Link key={item.id} href={item.link || ''}>{item.name}</Link>))}
                        </Box>
                    )}
                </Box>
            )
        }
    }

    return (
        <Card pad="medium">
            {/*<CardHeader pad="small">Region Info</CardHeader>*/}
            <CardBody direction="column">
                {content}
            </CardBody>
        </Card>
    )
}