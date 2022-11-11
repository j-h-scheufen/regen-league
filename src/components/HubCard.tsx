import {Card, CardBody, CardHeader, Paragraph, Text} from 'grommet'
import { Hub } from "../hooks/supabase";

export default function HubCard(hub: Hub) {

    return (
        <Card pad="small" gap="medium">
            <CardHeader pad="medium">{hub.name}</CardHeader>
            <CardBody pad="small">{hub.description}</CardBody>
        </Card>
    )

}