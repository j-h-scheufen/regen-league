import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Text,
    Button,
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
import {linkDetailsAtom, linkTypeIconsAtom, linkTypesAtom} from "../state/global";
import ConfirmDialog from "./ConfirmDialog";

type Props = {
    ownerId: string
}

type NewLink = {
    url: string
    typeId: number
}

const emptyNewLink: NewLink = {typeId: 0, url: ''}
const deleteLinkAtom = atom<number | null>(null)
const newLinkAtom = atom<NewLink>({...emptyNewLink})
const loadingAtom = atom<boolean>(false)

export default function LinksForm({ ownerId }: Props) {
    const linkTypes = useAtomValue(linkTypesAtom)
    const iconConfig = useAtomValue(linkTypeIconsAtom)
    const client = useSupabaseClient()
    const [links, setLinks] = useAtom(linkDetailsAtom)
    const [deleteLinkId, setDeleteLinkId] = useAtom(deleteLinkAtom)
    const [newLink, setNewLink] = useAtom(newLinkAtom)
    const [loading, setLoading] = useAtom(loadingAtom)

    const LinkRow = (item: LinkDetails) => {
        return (
            <Box direction="row" gap="medium" pad="small" flex>
                {iconConfig[item.typeId]}
                <Link href={item.url}>{item.url}</Link>
                <Button
                    margin={{left: 'auto'}}
                    onClick={() => setDeleteLinkId(item.id)}>
                    <FormTrash/>
                </Button>
            </Box>
        )
    }

    const handleLinkDelete = useCallback(async () => {
        if (deleteLinkId) {
            try {
                setLoading(true)
                await deleteLink(client, deleteLinkId)
                const newLinks = links.filter(item => item.id !== deleteLinkId)
                setLinks([...newLinks])
                setDeleteLinkId(null)
            } catch (error) {
                console.error('Unable to delete link ID: ' + deleteLinkId + '. Message: ', error)
            } finally {
                setLoading(false)
            }
        }
    }, [links, client, deleteLinkId, setLinks, setDeleteLinkId, setLoading])

    const addNewLink = useCallback( async () => {
        if(newLink) {
            try {
                setLoading(true)
                const linkDetails = await insertNewLink(client, newLink.url, newLink.typeId, ownerId!)
                links.push(linkDetails)
                setLinks([...links])
                setNewLink(emptyNewLink)
            }
            catch (error) {
                alert('Unable to create new link. Message: '+JSON.stringify(error))
            }
            finally {
                setLoading(false)
            }
        }
    }, [links, client, newLink, ownerId, setLinks, setNewLink, setLoading])

    return (
        <Card pad="small">
            <CardHeader justify="center"><Text size="large">Links</Text></CardHeader>
            <CardBody>
                    <Box pad="small" margin={{bottom: "small"}}>
                        <Form<NewLink>
                            value={newLink}
                            onChange={(nextValue) => setNewLink(nextValue)}
                            onSubmit={() => addNewLink()}>
                            <Box direction="row">
                                <FormField name="url" htmlFor="url" label="URL" required width="100%">
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
                                <Button
                                    primary
                                    type="submit"
                                    label={loading ? 'Loading ...' : 'Add'}
                                    disabled={loading}
                                    alignSelf="center"
                                    margin={{left: "small"}}/>
                            </Box>
                        </Form>
                    </Box>
                {links.map((item, index) => <LinkRow key={index} {...item}/>)}
            </CardBody>
            {deleteLinkId && (
                <ConfirmDialog
                    id="deleteLinkModel"
                    heading="Confirm"
                    text="Are you sure you want to delete this link?"
                    onCancel={() => setDeleteLinkId(null)}
                    onSubmit={handleLinkDelete}
                />
            )}
        </Card>
    )
}