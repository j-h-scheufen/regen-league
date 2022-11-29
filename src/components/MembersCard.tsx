import {Box, Card, CardBody, CardHeader, Text} from 'grommet'
import React from "react";

import ProfileAvatar from "./profile/ProfileAvatar";
import {useAtomValue} from "jotai";
import {membersAtom} from "../state/global";

export default function MembersCard() {
    const members = useAtomValue(membersAtom)

    return (
        <Card pad="small">
            <CardHeader pad="small"><Text>{members.length} Member{members.length != 1?'s':''}</Text></CardHeader>
            <CardBody>
                <Box direction="row">
                    {members.map((member, index) =>
                        <ProfileAvatar
                            key={index}
                            profileId={member.userId}
                            name={member.username}
                            avatarURL={member.avatarURL}
                            linkTo={'/profile/'+member.userId}/>
                    )}
                </Box>
            </CardBody>
        </Card>
    )

}