import {Box, Card, CardBody, CardHeader, Text} from 'grommet'
import React from "react";

import {MemberDetails} from "../utils/types";
import ProfileAvatar from "./profile/ProfileAvatar";

type Props = {
    members: Array<MemberDetails>
}

export default function MembersCard({members}: Props) {
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