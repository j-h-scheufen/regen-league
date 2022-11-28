import {Box, Card, CardBody, Heading, Text, Form} from 'grommet'
import Link from "next/link";
import {useAtomValue, Provider as JotaiProvider} from "jotai";
import {waitForAll} from "jotai/utils";

import {epaCatalogAtom, oneEarthCatalogAtom} from "../state/global";
import {RegionAssociations, RegionNode} from "../utils/types";
import RegionInfoSelector, {selectionAtom} from "./project/RegionInfoSelector";

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
            content = (
                <Form>
                    <JotaiProvider initialValues={[[selectionAtom, associations.oneEarth]] as const}>
                        <RegionInfoSelector
                            title="One Earth"
                            regions={[oeCatalog.level1, oeCatalog.level2, oeCatalog.level3]}
                            labels={['Realm', 'Subrealm', 'Bioregion']}
                        />
                    </JotaiProvider>
                    <JotaiProvider initialValues={[[selectionAtom, associations.epa]] as const}>
                        <RegionInfoSelector
                            title="EPA"
                            regions={[epaCatalog.level1, epaCatalog.level2]}
                            labels={['Level 1', 'Level 2']}
                        />
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
                                        href={associations.oneEarth[0].link || ''}>{associations.oneEarth[0].name}</Link></Text>
                                </Box>
                                <Box basis="1/2">
                                    <Text>Bioregion: <Link
                                        href={associations.oneEarth[2].link || ''}>{associations.oneEarth[2].name}</Link></Text>
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
                                        href={associations.epa[0].link || ''}>{associations.epa[0].name}</Link></Text>
                                </Box>
                                <Box basis="1/2">
                                    <Text>Level 2: <Link
                                        href={associations.epa[1].link || ''}>{associations.epa[1].name}</Link></Text>
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