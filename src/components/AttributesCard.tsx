import {Box, Card, CardBody, CardHeader, Paragraph, Text} from 'grommet'
import {useAtomValue} from "jotai";
import {currentHubAtom} from "../state/hub";

type Props = {
    description: string
}
export default function AttributesCard({ description }: Props) {

    return (
        <Card pad="small" margin={{vertical: "small"}}>
            <CardHeader justify="center"><Text size="large">Description</Text></CardHeader>
            <CardBody>
                <Box width="100%" pad="small">
                    <Paragraph
                        maxLines={20}
                        fill={true}
                        margin={{vertical: "xsmall"}}>
                            {description || ''}
                    </Paragraph>
                </Box>
            </CardBody>
        </Card>
    )
}