import {Box, Card, CardBody, Heading, Text, Form, FormField, Select} from 'grommet'
import Link from "next/link";
import {useAtomValue} from "jotai";

import {oneEarthCatalogAtom} from "../state/global";
import {RegionAssociations} from "../utils/types";
import RegionInfoSelector from "./project/RegionInfoSelector";

type Props = {
    associations: RegionAssociations | null
    editMode?: boolean
    ownerId?: string
    onUpdate?: (update: RegionAssociations) => void
}

export default function RegionInfoCard({associations, editMode, ownerId, onUpdate}: Props) {
    const oeCatalog = useAtomValue(oneEarthCatalogAtom)

    let content;
    if (!associations || (!associations.oneEarth && !associations.epa && associations.custom.length === 0))
        content = (<Text>No region data configured!</Text>)
    else {
        if (editMode) {
            content = (
                <Box>
                    {associations.oneEarth && (
                        <RegionInfoSelector
                            regions={[oeCatalog.realms, oeCatalog.subrealms, oeCatalog.bioregions]}
                            categories={['Realm', 'Subrealm', 'Bioregion']}
                            selection={[associations.oneEarth.realm, associations.oneEarth.subrealm, associations.oneEarth.bioregion]}/>
                    )}
                </Box>
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