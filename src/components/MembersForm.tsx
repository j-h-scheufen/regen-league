import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Form,
    FormField,
    Select,
    Text,
} from "grommet";
import React, { useCallback } from "react";
import { FormTrash } from "grommet-icons";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { atom, useAtom, useAtomValue } from "jotai";
import { useHydrateAtoms } from "jotai/utils";

import { memberDetailsAtom } from "../state/global";
import { MemberDetails, Profile, Role } from "../utils/types";
import { getUserProfile } from "../utils/supabase";
import ConfirmDialog from "./ConfirmDialog";

type Props = {
    orgId: string;
    roles: Array<Role>;
    initialCandidates: Array<Profile>;
    performAdd: (userId: string, roleId: string) => Promise<MemberDetails>;
    performDelete: (userId: string) => Promise<void>;
};

type NewMember = {
    userId: string;
    roleId: string;
};

const emptyNewMember = { roleId: "", userId: "" };
const deleteMemberAtom = atom<MemberDetails | null>(null);
const newMemberAtom = atom<NewMember>({ ...emptyNewMember });
const loadingAtom = atom<boolean>(false);
const memberCandidatesAtom = atom<Array<Profile>>(new Array<Profile>());
const displayCandidatesAtom = atom<Array<Profile>>(new Array<Profile>());
const availableRolesAtom = atom<Array<Role>>(new Array<Role>());

export default function MembersForm({
    orgId,
    roles,
    initialCandidates,
    performAdd,
    performDelete,
}: Props) {
    const [members, setMembers] = useAtom(memberDetailsAtom);
    useHydrateAtoms([
        [memberCandidatesAtom, initialCandidates],
        [displayCandidatesAtom, initialCandidates],
        [availableRolesAtom, roles],
    ] as const);

    const [memberCandidates, setMemberCandidates] =
        useAtom(memberCandidatesAtom);
    const [displayCandidates, setDisplayCandidates] = useAtom(
        displayCandidatesAtom
    );
    const [deleteMember, setDeleteMember] = useAtom(deleteMemberAtom);
    const [newMember, setNewMember] = useAtom(newMemberAtom);
    const [loading, setLoading] = useAtom(loadingAtom);
    const availableRoles = useAtomValue(availableRolesAtom);
    const client = useSupabaseClient();
    const user = useUser();

    const updateMemberCandidatesState = useCallback(
        (members: Array<Profile>) => {
            setMemberCandidates(members);
            setDisplayCandidates(members);
        },
        [setMemberCandidates, setDisplayCandidates]
    );

    const handleMemberDelete = useCallback(async () => {
        if (deleteMember) {
            try {
                setLoading(true);
                await performDelete(deleteMember.userId);
                const newMembers = members.filter(
                    (item) => item.userId !== deleteMember.userId
                );
                const newCandidate = await getUserProfile(
                    client,
                    deleteMember.userId
                );
                if (memberCandidates && newCandidate) {
                    memberCandidates.push(newCandidate);
                    updateMemberCandidatesState([...memberCandidates]);
                }
                setMembers([...newMembers]);
                setDeleteMember(null);
            } catch (error) {
                alert(
                    "Unable to delete member ID: " +
                        deleteMember.userId +
                        ". Message: " +
                        JSON.stringify(error)
                );
            } finally {
                setLoading(false);
            }
        }
    }, [
        client,
        deleteMember,
        members,
        memberCandidates,
        performDelete,
        setLoading,
        setMembers,
        setDeleteMember,
        updateMemberCandidatesState,
    ]);

    const addNewMember = useCallback(async () => {
        if (newMember) {
            try {
                setLoading(true);
                let memberDetails: any = undefined;
                memberDetails = await performAdd(
                    newMember.userId,
                    newMember.roleId
                );
                if (memberDetails) {
                    members.push(memberDetails);
                    if (memberCandidates) {
                        const newCandidates = memberCandidates.filter(
                            (p) => p.id != memberDetails.userId
                        );
                        updateMemberCandidatesState([...newCandidates]);
                    }
                    setMembers([...members]);
                    setNewMember(emptyNewMember);
                }
            } catch (error) {
                alert(
                    "Unable to create new link. Message: " +
                        JSON.stringify(error)
                );
            } finally {
                setLoading(false);
            }
        }
    }, [
        newMember,
        members,
        memberCandidates,
        performAdd,
        setLoading,
        setMembers,
        setNewMember,
        updateMemberCandidatesState,
    ]);

    const MemberRow = (member: MemberDetails) => {
        return (
            <Box direction="row" gap="medium" pad="small" flex>
                <Text>{member.username || member.userId}</Text>
                <Text>[{member.roleName.toUpperCase()}]</Text>
                {member.userId !== user?.id && (
                    <Button
                        margin={{ left: "auto" }}
                        onClick={() => setDeleteMember(member)}
                    >
                        <FormTrash />
                    </Button>
                )}
            </Box>
        );
    };

    return (
        <Card pad="small" margin={{ vertical: "small" }}>
            <CardHeader justify="center">
                <Text size="large">Members</Text>
            </CardHeader>
            <CardBody>
                <Box pad="small" margin={{ bottom: "small" }}>
                    <Form<NewMember>
                        value={newMember}
                        onChange={(nextValue) => setNewMember(nextValue)}
                        onSubmit={() => addNewMember()}
                    >
                        <Box direction="row">
                            <FormField
                                name="userId"
                                htmlFor="candidateSelectId"
                                label="Candidate"
                                width="100%"
                                required
                            >
                                <Select
                                    id="candidateSelectId"
                                    name="userId"
                                    valueKey={{ key: "id", reduce: true }}
                                    labelKey={(profile) =>
                                        profile.username || profile.id
                                    }
                                    options={displayCandidates || []}
                                    onSearch={(text) => {
                                        // The line below escapes regular expression special characters:
                                        // [ \ ^ $ . | ? * + ( )
                                        const escapedText = text.replace(
                                            /[-\\^$*+?.()|[\]{}]/g,
                                            "\\$&"
                                        );
                                        // Create the regular expression with modified value which
                                        // handles escaping special characters. Without escaping special
                                        // characters, errors will appear in the console
                                        const exp = new RegExp(
                                            escapedText,
                                            "i"
                                        );
                                        if (memberCandidates)
                                            setDisplayCandidates(
                                                memberCandidates.filter((p) =>
                                                    exp.test(p.username || p.id)
                                                )
                                            );
                                    }}
                                />
                            </FormField>
                            <FormField
                                name="roleId"
                                htmlFor="roleSelectId"
                                label="Role"
                                required
                            >
                                <Select
                                    id="roleSelectId"
                                    name="roleId"
                                    valueKey={{ key: "id", reduce: true }}
                                    labelKey={(role) => role.name.toUpperCase()}
                                    options={availableRoles || []}
                                />
                            </FormField>
                            <Button
                                primary
                                type="submit"
                                label={loading ? "Loading ..." : "Add"}
                                disabled={loading}
                                alignSelf="center"
                                margin={{ left: "small" }}
                            />
                        </Box>
                    </Form>
                </Box>
                {members.map((item, index) => (
                    <MemberRow key={index} {...item} />
                ))}
            </CardBody>
            {deleteMember && (
                <ConfirmDialog
                    id="deleteMemberModel"
                    heading="Confirm"
                    text="Are you sure you want to remove this member?"
                    onCancel={() => setDeleteMember(null)}
                    onSubmit={handleMemberDelete}
                />
            )}
        </Card>
    );
}
