import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Form,
    FormField,
    Heading,
    Layer,
    Select,
    Text,
} from 'grommet'
import React, {useCallback} from "react";
import {FormTrash} from "grommet-icons";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {atom, useAtom, useAtomValue} from "jotai";
import {waitForAll} from "jotai/utils";

import {hubRolesAtom, memberDetailsAtom, projectRolesAtom} from "../state/global";
import {MemberDetails, Profile, Role} from "../utils/types";
import {
    addHubMembership,
    addProjectMembership,
    removeHubMembership,
    removeProjectMembership
} from "../utils/supabase";
import {hubMemberCandidates} from "../state/hub";
import {projectMemberCandidates} from "../state/project";

type Props = {
    orgId: string
    mode: string
}

type NewMember = {
    userId: string
    roleId: number
}

export const enum Mode {
    HUB = 'hub',
    PROJECT = 'project'
}

const emptyNewMember = {roleId: 0, userId: ''}
const deleteMemberAtom = atom<MemberDetails | null>(null)
const newMemberAtom = atom<NewMember>({...emptyNewMember})
const loadingAtom = atom<boolean>(false)
const memberCandidatesAtom = atom<Array<Profile> | null>(null)
const availableRolesAtom = atom<Array<Role> | null>(null)

export default function MembersForm({orgId, mode}: Props) {
    const [hubRoles, projectRoles] = useAtomValue(waitForAll([hubRolesAtom, projectRolesAtom]))
    const [memberCandidates, setMemberCandidates] = useAtom(memberCandidatesAtom)
    const [availableRoles, setAvailableRoles] = useAtom(availableRolesAtom)
    const initialHubMembers = useAtomValue(hubMemberCandidates)
    const initialProjectMembers = useAtomValue(projectMemberCandidates)
    const [members, setMembers] = useAtom(memberDetailsAtom)
    const [deleteMember, setDeleteMember] = useAtom(deleteMemberAtom)
    const [newMember, setNewMember] = useAtom(newMemberAtom)
    const [loading, setLoading] = useAtom(loadingAtom)
    const client = useSupabaseClient()

    if (mode == Mode.HUB) {
        if (!memberCandidates)
            setMemberCandidates(initialHubMembers)
        if (!availableRoles)
            setAvailableRoles(hubRoles)
    }
    else if (mode == Mode.PROJECT) {
        if (!memberCandidates)
            setMemberCandidates(initialProjectMembers)
        if (!availableRoles)
            setAvailableRoles(projectRoles)
    }

    const MemberRow = (member: MemberDetails) => {
        return (
            <Box direction="row" gap="medium" pad="small" flex>
                <Text>{member.username || member.userId}</Text>
                <Text>[{member.roleName.toUpperCase()}]</Text>
                <Button
                    margin={{left: 'auto'}}
                    onClick={() => setDeleteMember(member)}>
                    <FormTrash/>
                </Button>
            </Box>
        )
    }

    const handleMemberDelete = useCallback(async () => {
        if (deleteMember) {
            try {
                setLoading(true)
                if (mode == Mode.HUB)
                    await removeHubMembership(client, orgId, deleteMember.userId)
                else if (mode == Mode.PROJECT)
                    await removeProjectMembership(client, orgId, deleteMember.userId)

                const newMembers = members.filter(item => item.userId !== deleteMember.userId)
                const newCandidate: Profile = {
                    id: deleteMember.userId,
                    avatarFilename: deleteMember.avatarFilename,
                    avatarURL: deleteMember.avatarURL,
                    username: deleteMember.username}
                if (memberCandidates) {
                    memberCandidates.push(newCandidate)
                    setMemberCandidates([...memberCandidates])
                }
                setMembers([...newMembers])
                setDeleteMember(null)
            } catch (error) {
                alert('Unable to delete member ID: ' + deleteMember.userId + '. Message: ' + JSON.stringify(error))
            } finally {
                setLoading(false)
            }
        }
    }, [deleteMember, members, client, orgId, mode, memberCandidates, setDeleteMember, setMembers, setMemberCandidates, setLoading])

    const addNewMember = useCallback( async () => {
        if(newMember) {
            try {
                setLoading(true)
                let memberDetails: any = undefined
                if (mode == Mode.HUB)
                    memberDetails = await addHubMembership(client, orgId, newMember.userId, newMember.roleId)
                else if (mode == Mode.PROJECT)
                    memberDetails = await addProjectMembership(client, orgId, newMember.userId, newMember.roleId)
                if (memberDetails) {
                    members.push(memberDetails)
                    if (memberCandidates) {
                        const newCandidates = memberCandidates.filter((p) => p.id != memberDetails.userId)
                        setMemberCandidates([...newCandidates])
                    }
                    setMembers([...members])
                    setNewMember(emptyNewMember)
                }
            }
            catch (error) {
                alert('Unable to create new link. Message: '+JSON.stringify(error))
            }
            finally {
                setLoading(false)
            }
        }
    }, [members, client, newMember, orgId, mode, memberCandidates, setMemberCandidates, setMembers, setNewMember, setLoading])

    return (
        <Card pad="small">
            <CardHeader pad="small">Members</CardHeader>
            <CardBody>
                <Box pad="small" margin={{bottom: "small"}}>
                    <Form<NewMember>
                        value={newMember}
                        onChange={(nextValue) => setNewMember(nextValue)}
                        onSubmit={() => addNewMember()}>
                        <Box direction="row">
                            <FormField name="userId" htmlFor="candidateSelectId" label="Candidates" required>
                                <Select
                                    id="candidateSelectId"
                                    name="userId"
                                    valueKey={{ key: 'id', reduce: true }}
                                    labelKey={(profile) => profile.username || profile.id}
                                    options={memberCandidates || []}
                                    onSearch={(text) => {
                                                  // The line below escapes regular expression special characters:
                                                  // [ \ ^ $ . | ? * + ( )
                                                  const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
                                                  // Create the regular expression with modified value which
                                                  // handles escaping special characters. Without escaping special
                                                  // characters, errors will appear in the console
                                                  const exp = new RegExp(escapedText, 'i');
                                                  if (memberCandidates)
                                                      setMemberCandidates(memberCandidates.filter((p) => exp.test(p.username || p.id)));
                                                }}
                                />
                            </FormField>
                            <FormField name="roleId" htmlFor="roleSelectId" label="Role" required>
                                <Select
                                    id="roleSelectId"
                                    name="roleId"
                                    valueKey={{ key: 'id', reduce: true }}
                                    labelKey={(role) => role.name.toUpperCase()}
                                    options={availableRoles || []}
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
                {members.map((item, index) => <MemberRow key={index} {...item}/>)}
            </CardBody>
            {deleteMember && (
                <Layer
                    id="deleteMemberModal"
                    position="center"
                    onClickOutside={() => setDeleteMember(null)}
                    onEsc={() => setDeleteMember(null)}
                    animation="fadeIn"
                >
                    <Box pad="medium" gap="small" width="medium">
                        <Heading level={3} margin="none">Confirm</Heading>
                        <Text>Are you sure you want to remove this member?</Text>
                        <Box
                            as="footer"
                            gap="small"
                            direction="row"
                            align="center"
                            justify="end"
                            pad={{ top: 'medium', bottom: 'small' }}
                        >
                            <Button label="Cancel" onClick={() => setDeleteMember(null)} color="dark-3" />
                            <Button
                                label={
                                    <Text color="white">
                                        <strong>Delete</strong>
                                    </Text>
                                }
                                onClick={() => handleMemberDelete()}
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