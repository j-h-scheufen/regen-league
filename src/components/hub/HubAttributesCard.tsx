import {Box, Card, CardBody, CardHeader, Paragraph, Text, TextArea} from 'grommet'
import {Hub} from "../../utils/types";
import {useAtom, useAtomValue} from "jotai";
import {currentHubAtom} from "../../state/hub";

export default function HubAttributesCard() {
    const hub = useAtomValue(currentHubAtom)

    return (
        <Card pad="small">
            <CardHeader justify="center"><Text size="large">Description</Text></CardHeader>
            <CardBody>
                <Box width="100%" pad="small">
                    <Paragraph
                        maxLines={20}
                        fill={true}
                        margin={{vertical: "xsmall"}}>
                            {hub?.description || ''}
                    </Paragraph>
                </Box>
            </CardBody>
        </Card>
    )
}