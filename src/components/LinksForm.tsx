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
import {linkDetailsAtom, linkTypeIconsAtom, linkTypesAtom} from "../state/global";

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

    const handleLinkDelete = useCallback(async (id: number) => {
        try {
            setLoading(true)
            await deleteLink(client, id)
            const newLinks = links.filter(item => item.id !== id)
            setLinks([...newLinks])
        }
        catch (error) {
            alert('Unable to delete link ID: '+id+'. Message: '+JSON.stringify(error))
        }
        finally {
            setLoading(false)
        }
    }, [links, client, setLinks, setLoading])

    const addNewLink = useCallback( async () => {
        if(newLink) {
            try {
                setLoading(true)
                const linkDetails = await insertNewLink(client, newLink.url, newLink.typeId, ownerId!)
                links.push(linkDetails)
                setNewLink(emptyNewLink)
                setLinks([...links])
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
                <Layer
                    id="deleteLinkModal"
                    position="center"
                    onClickOutside={() => setDeleteLinkId(null)}
                    onEsc={() => setDeleteLinkId(null)}
                    animation="fadeIn"
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