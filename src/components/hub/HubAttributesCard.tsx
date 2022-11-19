import {Box, Card, CardBody, CardHeader, TextArea} from 'grommet'
import {Hub} from "../../utils/types";

type Props = {
    hub: Hub
}

export default function HubAttributesCard({hub}: Props) {

    return (
        <Card pad="small">
            <CardHeader pad="small">Details</CardHeader>
            <CardBody>
                <Box>
                    <TextArea value={hub.description || ''} rows={5} disabled/>
                </Box>
            </CardBody>
        </Card>
    )
}