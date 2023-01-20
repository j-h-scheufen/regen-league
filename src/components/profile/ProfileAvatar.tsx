import { Anchor, Avatar, Box, Stack, Text } from "grommet";
import { User as UserIcon } from "grommet-icons/icons";
import React from "react";

type Props = {
    profileId?: string;
    name?: string;
    avatarURL?: string;
    size?: "xsmall" | "small" | "medium" | "large" | "xlarge" | string;
    linkTo?: string;
    role?: string;
};

const AnchorWrapper = ({
    condition,
    url,
    children,
}: {
    condition: any;
    url: string | undefined;
    children: any;
}) => (condition && url ? <Anchor href={url}>{children}</Anchor> : children);

function ProfileAvatar({
    profileId,
    name,
    avatarURL,
    size = "medium",
    linkTo,
    role,
}: Props) {
    const MyAvatar = ({ url }: { url: string | undefined }) => {
        let content;
        if (url)
            content = (
                <AnchorWrapper condition={linkTo} url={linkTo}>
                    <Stack anchor="bottom-right">
                        <Avatar
                            src={url}
                            size={size!}
                            margin={{ horizontal: "small", bottom: "xsmall" }}
                            round="medium"
                        />
                        {role && role.toUpperCase().startsWith("ADMIN") && (
                            <Box
                                background="light-6"
                                pad={{ horizontal: "xsmall" }}
                                round="small"
                            >
                                <Text size="xsmall" color="black">
                                    {role}
                                </Text>
                            </Box>
                        )}
                    </Stack>
                </AnchorWrapper>
            );
        else
            content = (
                <AnchorWrapper condition={linkTo} url={linkTo}>
                    <Avatar
                        size={size!}
                        margin={{ horizontal: "small", bottom: "xsmall" }}
                        round="medium"
                    >
                        <UserIcon />
                    </Avatar>
                </AnchorWrapper>
            );

        return content;
    };

    return (
        <Box direction="column" align="center">
            <MyAvatar url={avatarURL} />
            {name ? <Text size="small">{name}</Text> : ""}
        </Box>
    );
}

export default ProfileAvatar;
