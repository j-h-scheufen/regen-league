import {Box, Card, CardBody, CardHeader, Heading, Text} from 'grommet'
import Link from "next/link";
import {useAtomValue} from "jotai";

import {regionAssociationsAtom} from "../state/global";
import {RegionNode} from "../utils/types";

const oneEarthLabels = ['Realm','Subrealm','Bioregion','Ecoregion']
const epaLabels = ['Level I','Level II','Level III','Level IV']

const RegionCard = ({region, title}: {region: RegionNode, title: string}) => {
    return (
        <Card pad="small">
            <CardHeader>{title}</CardHeader>
            <CardBody margin={{top: "xxsmall"}}>
                {region && (
                    <Text>
                        <LinkWrapper condition={region.link} url={region.link}>{region.name}</LinkWrapper>
                    </Text>
                )}
            </CardBody>
        </Card>
    )
}

const LinkWrapper = ({ condition, url, children }: {condition: any, url: string | undefined, children: any}) =>
    (condition && url) ? <Link href={url} target="_blank">{children}</Link> : children;

export default function RegionInfoCard() {
    const associations = useAtomValue(regionAssociationsAtom)

    return (
        <Card pad="small" margin={{vertical: "small"}}>
            <CardHeader justify="center"><Text size="large">Region Settings</Text></CardHeader>
            <CardBody>
                <Box pad="small">
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
                                    <Box direction="row" width="100%" gap="small">
                                        {oneEarthLabels.map(
                                            (label: string, index) => {
                                                if (associations?.oneEarth && associations.oneEarth[index])
                                                    return <RegionCard key={index} region={associations.oneEarth[index]} title={label}/>
                                            }
                                        )}
                                    </Box>
                                </Box>
                            )}
                            {associations?.epa && associations.epa.length > 0 && (
                                <Box direction="column">
                                    <Heading level="4" margin={{vertical: "small"}}>EPA</Heading>
                                    <Box direction="row">
                                        <Box direction="row" width="100%" gap="small">
                                            {epaLabels.map(
                                                (label: string, index) => {
                                                    if (associations?.epa && associations.epa[index])
                                                        return <RegionCard key={index} region={associations.epa[index]} title={label}/>
                                                }
                                            )}
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
                </Box>
            </CardBody>
        </Card>
    )
}