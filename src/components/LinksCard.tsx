import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Text,
    Button,
    Layer,
    Heading,
    Form,
    FormField,
    TextInput,
    Select
} from 'grommet'
import {FormTrash} from "grommet-icons";
import Link from "next/link";
import {atom, useAtom, useAtomValue} from "jotai";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {useCallback} from "react";

import {LinkDetails} from "../utils/types";
import {deleteLink, insertNewLink} from "../utils/supabase";
import {linkTypeIconsAtom, linkTypesAtom} from "../state/global";

type Props = {
    links: Array<LinkDetails>
    linkOwner?: string
    editMode?: boolean
    onUpdate?: (link: Array<LinkDetails>) => void
}

type NewLink = {
    url: string
    typeId: number
}

const deleteLinkAtom = atom<number | null>(null)
const emptyNewLink: NewLink = {typeId: 0, url: ''}
const newLinkAtom = atom<NewLink>(emptyNewLink)
const loadingAtom = atom<boolean>(false)

export default function LinksCard({links, linkOwner, editMode = false, onUpdate}: Props) {
    if (editMode && !onUpdate && !linkOwner)
        throw Error('A linkOwner and onUpdate function must be provided when using this component in editMode!')
    const [deleteLinkId, setDeleteLinkId] = useAtom(deleteLinkAtom)
    const [newLink, setNewLink] = useAtom(newLinkAtom)
    const [loading, setLoading] = useAtom(loadingAtom)
    const linkTypes = useAtomValue(linkTypesAtom)
    const iconConfig = useAtomValue(linkTypeIconsAtom)
    const client = useSupabaseClient()

    const LinkRow = (item: LinkDetails) => {
        return (
            <Box direction="row" gap="medium" pad="small" flex>
                {iconConfig[item.typeId]}
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
        try {
            setLoading(true)
            await deleteLink(client, id)
            const newLinks = links.filter(item => item.id !== id)
            if (onUpdate)
                onUpdate(newLinks)
        }
        catch (error) {
            alert('Unable to delete the link. Message: '+JSON.stringify(error))
        }
        finally {
            setLoading(false)
        }
    }, [links, client, onUpdate, setLoading])

    const addNewLink = useCallback( async () => {
        if(newLink) {
            try {
                setLoading(true)
                const linkDetails = await insertNewLink(client, newLink.url, newLink.typeId, linkOwner!)
                links.push(linkDetails)
                if (onUpdate)
                    onUpdate(links)
                setNewLink(emptyNewLink)
            }
            catch (error) {
                alert('Unable to create new link. Message: '+JSON.stringify(error))
            }
            finally {
                setLoading(false)
            }
        }
    }, [links, client, newLink, linkOwner, onUpdate, setNewLink, setLoading])

    return (
        <Card pad="small">
            <CardHeader pad="small">Links</CardHeader>
            <CardBody>
                {editMode && (
                    <Form<NewLink>
                        value={newLink}
                        onChange={(nextValue) => setNewLink(nextValue)}
                        onSubmit={() => addNewLink()}>
                        <Box direction="row">
                            <FormField name="url" htmlFor="url" label="URL" required>
                                <TextInput id="url" name="url" type="url"/>
                            </FormField>
                            <FormField name="typeId" htmlFor="typeSelectId" label="Type" required>
                                <Select
                                    id="typeSelectId"
                                    name="typeId"
                                    valueKey={{ key: 'id', reduce: true }}
                                    labelKey="name"
                                    options={linkTypes}
                                />
                            </FormField>
                            <Button type="submit" primary label={loading ? 'Loading ...' : 'Add'} disabled={loading}/>
                        </Box>
                    </Form>
                )}
                {links.map((item, index) => <LinkRow key={item.id} {...item}/>)}
            </CardBody>
            {deleteLinkId && (
                <Layer
                    id="delete link modal"
                    position="center"
                    onClickOutside={() => setDeleteLinkId(null)}
                    onEsc={() => setDeleteLinkId(null)}
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
                            <Button label="Cancel" onClick={() => setDeleteLinkId(null)} color="dark-3" />
                            <Button
                                label={
                                    <Text color="white">
                                        <strong>Delete</strong>
                                    </Text>
                                }
                                onClick={() => {
                                    handleLinkDelete(deleteLinkId);
                                    setDeleteLinkId(null);
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