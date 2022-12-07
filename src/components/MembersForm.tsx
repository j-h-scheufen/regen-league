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
import {SupabaseClient, useSupabaseClient} from "@supabase/auth-helpers-react";
import {atom, useAtom, useAtomValue} from "jotai";
import {useHydrateAtoms} from "jotai/utils";

import {memberDetailsAtom} from "../state/global";
import {MemberDetails, Profile, Role} from "../utils/types";
import {getUserProfile} from "../utils/supabase";

type Props = {
    orgId: string
    roles: Array<Role>
    initialCandidates: Array<Profile>
    performAdd: (client: SupabaseClient, orgId: string, userId: string, roleId: number) => Promise<MemberDetails>
    performDelete: (client: SupabaseClient, orgId: string, userId: string) => Promise<void>
}

type NewMember = {
    userId: string
    roleId: number
}

const emptyNewMember = {roleId: 0, userId: ''}
const deleteMemberAtom = atom<MemberDetails | null>(null)
const newMemberAtom = atom<NewMember>({...emptyNewMember})
const loadingAtom = atom<boolean>(false)
const memberCandidatesAtom = atom<Array<Profile>>(new Array<Profile>())
const displayCandidatesAtom = atom<Array<Profile>>(new Array<Profile>())
const availableRolesAtom = atom<Array<Role>>(new Array<Role>())

export default function MembersForm({orgId, roles, initialCandidates, performAdd, performDelete}: Props) {
    const [members, setMembers] = useAtom(memberDetailsAtom)
    useHydrateAtoms([
        [memberCandidatesAtom, initialCandidates],
        [displayCandidatesAtom, initialCandidates],
        [availableRolesAtom, roles]] as const)

    const [memberCandidates, setMemberCandidates] = useAtom(memberCandidatesAtom)
    const [displayCandidates, setDisplayCandidates] = useAtom(displayCandidatesAtom)
    const [deleteMember, setDeleteMember] = useAtom(deleteMemberAtom)
    const [newMember, setNewMember] = useAtom(newMemberAtom)
    const [loading, setLoading] = useAtom(loadingAtom)
    const availableRoles = useAtomValue(availableRolesAtom)
    const client = useSupabaseClient()

    const updateMemberCandidatesState = useCallback((members: Array<Profile>) => {
        setMemberCandidates(members)
        setDisplayCandidates(members)
    }, [setMemberCandidates, setDisplayCandidates])

    const handleMemberDelete = useCallback( async () => {
        if (deleteMember) {
            try {
                setLoading(true)
                await performDelete(client, orgId, deleteMember.userId)
                const newMembers = members.filter(item => item.userId !== deleteMember.userId)
                const newCandidate = await getUserProfile(client, deleteMember.userId)
                if (memberCandidates && newCandidate) {
                    memberCandidates.push(newCandidate)
                    updateMemberCandidatesState([...memberCandidates])
                }
                setMembers([...newMembers])
                setDeleteMember(null)
            } catch (error) {
                alert('Unable to delete member ID: ' + deleteMember.userId + '. Message: ' + JSON.stringify(error))
            } finally {
                setLoading(false)
            }
        }
    }, [client, orgId, deleteMember, members, memberCandidates, performDelete, setLoading, setMembers, setDeleteMember, updateMemberCandidatesState])

    const addNewMember =  useCallback(async () => {
        if(newMember) {
            try {
                setLoading(true)
                let memberDetails: any = undefined
                memberDetails = await performAdd(client, orgId, newMember.userId, newMember.roleId)
                if (memberDetails) {
                    members.push(memberDetails)
                    if (memberCandidates) {
                        const newCandidates = memberCandidates.filter((p) => p.id != memberDetails.userId)
                        updateMemberCandidatesState([...newCandidates])
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
    }, [client, orgId, newMember, members, memberCandidates, performAdd, setLoading, setMembers, setNewMember, updateMemberCandidatesState])

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
                            <FormField name="userId" htmlFor="candidateSelectId" label="Candidate" width="100%" required>
                                <Select
                                    id="candidateSelectId"
                                    name="userId"
                                    valueKey={{ key: 'id', reduce: true }}
                                    labelKey={(profile) => profile.username || profile.id}
                                    options={displayCandidates || []}
                                    onSearch={(text) => {
                                                  // The line below escapes regular expression special characters:
                                                  // [ \ ^ $ . | ? * + ( )
                                                  const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
                                                  // Create the regular expression with modified value which
                                                  // handles escaping special characters. Without escaping special
                                                  // characters, errors will appear in the console
                                                  const exp = new RegExp(escapedText, 'i');
                                                  if (memberCandidates)
                                                      setDisplayCandidates(memberCandidates.filter((p) => exp.test(p.username || p.id)));
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