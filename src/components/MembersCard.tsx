import {Box, Card, CardBody, CardHeader, Paragraph, Text, List, Avatar} from 'grommet'
import {User as UserIcon} from "grommet-icons/icons";
import {useRouter} from "next/router";
import {MemberDetails} from "../utils/types";


type Props = {
    members: Array<MemberDetails>
}

export default function MembersCard({members}: Props) {
    const router = useRouter()

    const createAvatar = (member: MemberDetails) => {
        if (member.avatarURL)
            return (<Avatar src={member.avatarURL}
                            size="medium"
                            margin="small"
                            round="medium"
                            onClick={() => router.push('/profile/'+member.userId)}/>)
        else
            return (<Avatar size="medium"
                            margin="small"
                            round="medium"
                            onClick={() => router.push('/profile/'+member.userId)}>
                <UserIcon/>
            </Avatar>)
    }

    return (
        <Card pad="small">
            <CardHeader pad="small"><Text>{members.length} Member{members.length != 1?'s':''}</Text></CardHeader>
            <CardBody>
                <Box direction="row">
                    {members.map((member, index) =>
                        <Box key={index} direction="column" align="center">
                            {createAvatar(member)}
                            <Text size="small">{member.username}</Text>
                        </Box>
                    )}
                </Box>
            </CardBody>
        </Card>
    )

}