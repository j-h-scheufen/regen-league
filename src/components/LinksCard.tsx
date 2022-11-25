import {Box, Card, CardBody, CardHeader, Text, Button, Layer, Heading} from 'grommet'
import {Twitter, Instagram, Github, Facebook, Link as Generic, Linkedin, Youtube, FormTrash} from "grommet-icons";
import {useRouter} from "next/router";
import Link from "next/link";

import {LinkDetails} from "../utils/types";
import {atom, useAtom} from "jotai";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {SupabaseClient} from "@supabase/supabase-js";
import {useCallback} from "react";

type IconDictionary = Record<string, JSX.Element>

type Props = {
    links: Array<LinkDetails>
    editMode?: boolean
    onUpdate?: (link: Array<LinkDetails>) => void
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

const deleteLinkAtom = atom<number | undefined>(undefined)

export default function LinksCard({links, editMode = false, onUpdate}: Props) {
    if (editMode && !onUpdate)
        throw Error('A onUpdate function must be provided when using this component in editMode!')
    const [deleteLinkId, setDeleteLinkId] = useAtom(deleteLinkAtom)
    const client = useSupabaseClient()

    const LinkRow = (item: LinkDetails) => {
        return (
            <Box direction="row" gap="medium" pad="small" flex>
                {iconConfig[item.type]}
                <Link href={item.url}>{item.url}</Link>
                {editMode && (
                    <Button
                        margin={{left: 'auto'}}
                        onClick={() => setDeleteLinkId(item.id)}>
                        <FormTrash/>
                    </Button>
                )}
            </Box>
        )
    }

    const handleLinkDelete = useCallback(async (id: number) => {
        const {data, error} = await client.from('links').delete().eq('id', id)
        if (error) {
            console.log('Unable to delete link ID: '+id+'. Error: '+error.message)
            throw error
        }
        links = links.filter(item => item.id !== id)
        if (onUpdate)
            onUpdate(links)
    }, [links, client, onUpdate])

    return (
        <Card pad="small">
            <CardHeader pad="small">Links</CardHeader>
            <CardBody>
                {editMode && (
                    <Text>Add a new link</Text>
                )}
                {links.map((item, index) => <LinkRow key={item.id} {...item}/>)}
            </CardBody>
            {deleteLinkId && (
                <Layer
                    id="delete link modal"
                    position="center"
                    onClickOutside={() => setDeleteLinkId(undefined)}
                    onEsc={() => setDeleteLinkId(undefined)}
                >
                    <Box pad="medium" gap="small" width="medium">
                        <Heading level={3} margin="none">Confirm</Heading>
                        <Text>Are you sure you want to delete this link?</Text>
                        <Box
                            as="footer"
                            gap="small"
                            direction="row"
                            align="center"
                            justify="end"
                            pad={{ top: 'medium', bottom: 'small' }}
                        >
                            <Button label="Cancel" onClick={() => setDeleteLinkId(undefined)} color="dark-3" />
                            <Button
                                label={
                                    <Text color="white">
                                        <strong>Delete</strong>
                                    </Text>
                                }
                                onClick={() => {
                                    handleLinkDelete(deleteLinkId);
                                    setDeleteLinkId(undefined);
                                }}
                                primary
                                color="status-critical"
                            />
                        </Box>
                    </Box>
                </Layer>
            )}
        </Card>
    )
}