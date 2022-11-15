import {Box, Card, CardBody, CardHeader, Paragraph, Text, List, Avatar, TextArea} from 'grommet'
import {User as UserIcon} from "grommet-icons/icons";

import {Hub} from "../utils/supabase";

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