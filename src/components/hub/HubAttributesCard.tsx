import {Box, Card, CardBody, CardHeader, Paragraph, TextArea} from 'grommet'
import {Hub} from "../../utils/types";
import {useAtom, useAtomValue} from "jotai";
import {currentHubAtom} from "../../state/hub";

export default function HubAttributesCard() {
    const hub = useAtomValue(currentHubAtom)

    return (
        <Card pad="small">
            <CardHeader pad="small">Details</CardHeader>
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