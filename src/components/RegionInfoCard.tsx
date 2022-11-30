import {Box, Card, CardBody, Heading, Text} from 'grommet'
import Link from "next/link";
import {useAtomValue} from "jotai";

import {regionAssociationsAtom} from "../state/global";

export default function RegionInfoCard() {
    const associations = useAtomValue(regionAssociationsAtom)

    return (
        <Card pad="medium">
            {/*<CardHeader pad="small">Region Info</CardHeader>*/}
            <CardBody direction="column">
                {(!associations || (
                    (!associations.oneEarth || associations.oneEarth.length === 0) &&
                    (!associations.epa || associations.epa.length === 0) &&
                    (!associations.custom || associations.custom.length === 0))
                ) ?
                    (<Text>No region data configured!</Text>)
                :
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
                        {associations?.custom && associations.custom.length > 0 && (
                            <Box direction="column">
                                <Heading level="4" margin={{vertical: "small"}}>Other</Heading>
                                <Box basis="1/2">
                                    <Text>{associations.custom[0] && (<Link
                                        href={associations.custom[0]?.link || ''}>{associations.custom[0]?.name}</Link>)}</Text>
                                </Box>
                                <Box basis="1/2">
                                    <Text>{associations.custom[0].description}</Text>
                                </Box>
                            </Box>
                        )}
                    </Box>
                }
            </CardBody>
        </Card>
    )
}