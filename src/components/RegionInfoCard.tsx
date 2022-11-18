import {Box, Card, CardBody, CardHeader, Text} from 'grommet'

import {BioregionInfo} from "../utils/types";
import Link from "next/link";

type Props = {
    info: BioregionInfo
}

export default function RegionInfoCard({info}: Props) {

    return (
        <Card pad="medium">
            {/*<CardHeader pad="small">Region Info</CardHeader>*/}
            <CardBody direction={"row"}>
                <Box basis="1/2" border={true}>
                    <Text>Realm: <Link href={info.realm.link}>{info.realm.name}</Link></Text>
                </Box>
                <Box basis="1/2">
                    <Text>Bioregion: <Link href={info.bioregion.link}>{info.bioregion.name}</Link></Text>
                </Box>
            </CardBody>
        </Card>
    )
}