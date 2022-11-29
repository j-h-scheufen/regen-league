import {
    Box,
    Card,
    CardBody,
    CardHeader,
} from 'grommet'
import Link from "next/link";
import {useAtomValue} from "jotai";

import {LinkDetails} from "../utils/types";
import {linkDetailsAtom, linkTypeIconsAtom, linkTypesAtom} from "../state/global";

export default function LinksCard() {
    const links = useAtomValue(linkDetailsAtom)
    const iconConfig = useAtomValue(linkTypeIconsAtom)

    const LinkRow = (item: LinkDetails) => {
        return (
            <Box direction="row" gap="medium" pad="small" flex>
                {iconConfig[item.typeId]}
                <Link href={item.url}>{item.url}</Link>
            </Box>
        )
    }

    return (
        <Card pad="small">
            <CardHeader pad="small">Links</CardHeader>
            <CardBody>
                {links.map((item, index) => <LinkRow key={index} {...item}/>)}
            </CardBody>
        </Card>
    )
}