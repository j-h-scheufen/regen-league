import {Anchor, Avatar, Box, Text} from 'grommet'
import {User as UserIcon} from "grommet-icons/icons";
import React from "react";

type Props = {
    profileId?: string,
    name?: string,
    avatarURL?: string,
    size?: "xsmall" | "small" | "medium" | "large" | "xlarge" | string,
    linkTo?: string
}

const AnchorWrapper = ({ condition, url, children }: {condition: any, url: string | undefined, children: any}) =>
    (condition && url) ? <Anchor href={url}>{children}</Anchor> : children;

function ProfileAvatar({profileId, name, avatarURL, size="medium", linkTo}: Props) {
    const MyAvatar = ({url}: {url: string | undefined}) => {
        let content
        if (url)
            content = (<AnchorWrapper condition={linkTo} url={linkTo}>
                            <Avatar
                                src={url}
                                size={size!}
                                margin="small"
                                round="medium"/>
                        </AnchorWrapper>)
        else
            content = (<AnchorWrapper condition={linkTo} url={linkTo}>
                            <Avatar size={size!}
                                margin="small"
                                round="medium">
                                <UserIcon/>
                            </Avatar>
            </AnchorWrapper>)

        return content
    }

    return (
        <Box direction="column" align="center">
            <MyAvatar url={avatarURL}/>
            {name ? (<Text size="small">{name}</Text>) : ''}
        </Box>
    )
}

export default ProfileAvatar