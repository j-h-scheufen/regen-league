import {Box, Card, CardBody, CardHeader, Text} from 'grommet'
import Link from "next/link";
import {useAtomValue} from "jotai";

import {oneEarthCatalogAtom} from "../state/global";
import {RegionAssociations} from "../utils/types";

type Props = {
    associations: RegionAssociations | null
    editMode?: boolean
    profileId?: string
    onUpdate?: () => void
}

export default function RegionInfoCard({associations}: Props) {
    const oeCatalog = useAtomValue(oneEarthCatalogAtom)

    let content = (<Text>No region data available!</Text>)
    if (associations) {
        if (associations.oneEarth) {
            content = (
                <Box direction="row">
                    <Box basis="1/2">
                        <Text>Realm: <Link
                            href={associations.oneEarth.realm.link}>{associations.oneEarth.realm.name}</Link></Text>
                    </Box>
                    <Box basis="1/2">
                        <Text>Bioregion: <Link
                            href={associations.oneEarth.bioregion.link}>{associations.oneEarth.bioregion.name}</Link></Text>
                    </Box>
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