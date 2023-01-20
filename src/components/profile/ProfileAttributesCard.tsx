import { Card, CardBody, CardHeader, Text } from "grommet";

import { Profile } from "../../utils/types";

type Props = {
    profile: Profile;
};

export default function ProfileAttributesCard({ profile }: Props) {
    return (
        <Card pad="small">
            <CardHeader pad="small">Attributes</CardHeader>
            <CardBody direction="column" pad="small" gap="small">
                <Text>ID: {profile.id}</Text>
                <Text>Username: {profile.username || ""}</Text>
            </CardBody>
        </Card>
    );
}
