import {Box, Card, CardBody, Heading, Text, Form, FormField, Select} from 'grommet'
import Link from "next/link";
import {useAtomValue, Provider as JotaiProvider} from "jotai";

import {epaCatalogAtom, oneEarthCatalogAtom} from "../state/global";
import {RegionAssociations, RegionNode} from "../utils/types";
import RegionInfoSelector from "./project/RegionInfoSelector";
import {waitForAll} from "jotai/utils";

type Props = {
    associations: RegionAssociations | null
    editMode?: boolean
    ownerId?: string
    onUpdate?: (update: RegionAssociations) => void
}

export default function RegionInfoCard({associations, editMode, ownerId, onUpdate}: Props) {
    const [oeCatalog, epaCatalog] = useAtomValue(waitForAll([oneEarthCatalogAtom, epaCatalogAtom]))

    let content;
    if (!associations || (!associations.oneEarth && !associations.epa && associations.custom.length === 0))
        content = (<Text>No region data configured!</Text>)
    else {
        if (editMode) {
            const oeSelection: Array<RegionNode> = associations.oneEarth ?
                [associations.oneEarth.realm, associations.oneEarth.subrealm, associations.oneEarth.bioregion] : new Array<RegionNode>()
            const epaSelection: Array<RegionNode> = associations.epa ?
                [associations.epa.level1, associations.epa.level2] : new Array<RegionNode>()

            content = (
                <Form>
                    <JotaiProvider>
                        <RegionInfoSelector
                            title="One Earth"
                            regions={[oeCatalog.realms, oeCatalog.subrealms, oeCatalog.bioregions]}
                            labels={['Realm', 'Subrealm', 'Bioregion']}
                            selection={oeSelection}/>
                    </JotaiProvider>
                    <JotaiProvider>
                        <RegionInfoSelector
                            title="EPA"
                            regions={[epaCatalog.level1, epaCatalog.level2]}
                            labels={['Level 1', 'Level 2']}
                            selection={oeSelection}/>
                    </JotaiProvider>
                </Form>
            )
        } else {
            content = (
                <Box>
                    {associations.oneEarth && (
                        <Box direction="column">
                            <Heading level="4" margin={{vertical: "small"}}>One Earth</Heading>
                            <Box direction="row">
                                <Box basis="1/2">
                                    <Text>Realm: <Link
                                        href={associations.oneEarth.realm.link || ''}>{associations.oneEarth.realm.name}</Link></Text>
                                </Box>
                                <Box basis="1/2">
                                    <Text>Bioregion: <Link
                                        href={associations.oneEarth.bioregion.link || ''}>{associations.oneEarth.bioregion.name}</Link></Text>
                                </Box>
                            </Box>
                        </Box>
                    )}
                    {associations.epa && (
                        <Box direction="column">
                            <Heading level="4" margin={{vertical: "small"}}>EPA</Heading>
                            <Box direction="row">
                                <Box basis="1/2">
                                    <Text>Level 1: <Link
                                        href={associations.epa.level1.link || ''}>{associations.epa.level1.name}</Link></Text>
                                </Box>
                                <Box basis="1/2">
                                    <Text>Level 2: <Link
                                        href={associations.epa.level2.link || ''}>{associations.epa.level2.name}</Link></Text>
                                </Box>
                            </Box>
                        </Box>
                    )}
                    {associations.custom.length > 0 && (
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