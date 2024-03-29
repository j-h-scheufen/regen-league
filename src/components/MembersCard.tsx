import { Box, Card, CardBody, CardHeader, Text } from "grommet";
import React from "react";

import ProfileAvatar from "./profile/ProfileAvatar";
import { useAtomValue } from "jotai";
import { memberDetailsAtom } from "../state/global";

export default function MembersCard() {
  const members = useAtomValue(memberDetailsAtom);

  return (
    <Card pad="small" margin={{ vertical: "small" }}>
      <CardHeader justify="center">
        <Text size="large">
          {members.length} Member{members.length != 1 ? "s" : ""}
        </Text>
      </CardHeader>
      <CardBody>
        <Box direction="row">
          {members.map((member, index) => (
            <ProfileAvatar
              key={index}
              profileId={member.userId}
              name={member.username}
              avatarURL={member.avatarURL}
              linkTo={"/profile/" + member.userId}
              role={member.roleName}
            />
          ))}
        </Box>
      </CardBody>
    </Card>
  );
}
