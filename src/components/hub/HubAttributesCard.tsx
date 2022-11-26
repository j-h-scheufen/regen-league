import {Box, Card, CardBody, CardHeader, Paragraph, TextArea} from 'grommet'
import {Hub} from "../../utils/types";

type Props = {
    hub: Hub
}

export default function HubAttributesCard({hub}: Props) {

    return (
        <Card pad="small">
            <CardHeader pad="small">Details</CardHeader>
            <CardBody>
                <Box width="100%" pad="xsmall">
                    <Paragraph maxLines={20} fill={true}>{hub.description || ''}</Paragraph>
                </Box>
            </CardBody>
        </Card>
    )
}