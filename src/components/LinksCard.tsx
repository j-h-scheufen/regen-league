import {Box, Card, CardBody, CardHeader, Paragraph, Text, List, Avatar} from 'grommet'
import {Twitter, Instagram, Github, Facebook, Link as Generic, Linkedin, Youtube, Icon} from "grommet-icons";
import {Router, useRouter} from "next/router";
import Link from "next/link";

import {LinkDetails} from "../utils/types";

type IconDictionary = Record<string, JSX.Element>
type Props = {
    links: Array<LinkDetails>
}

const iconConfig: IconDictionary = {
    ['twitter']: <Twitter/>,
    ['facebook']: <Facebook/>,
    ['general']: <Generic/>,
    ['github']: <Github/>,
    ['instagram']: <Instagram/>,
    ['youtube']: <Youtube/>,
    ['linkedin']: <Linkedin/>,
}

const LinkRow = (item: LinkDetails) => {
    return (<Box direction="row" gap="medium" pad="small">
                {iconConfig[item.type]}
                <Link href={item.url}>{item.url}</Link>
            </Box>
    )
}

export default function LinksCard({links}: Props) {
    const router = useRouter()
    const rows = links.map((value, index) => {
        return <LinkRow key={index} {...value}/>}
    )
    return (
        <Card pad="small">
            <CardHeader pad="small">Links</CardHeader>
            <CardBody>
                {links.map((item, index) => <LinkRow key={index} {...item}/>)}
            </CardBody>
        </Card>
    )
}