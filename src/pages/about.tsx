import { Anchor, Box, Card, Text } from "grommet";
import { Github, Twitter } from "grommet-icons";
import React from "react";

export default function AboutPage() {
    return (
        <Box direction="row" pad="small" justify="between" gap="medium">
            <Card align="center" pad="medium">
                <Text>Follow along on Twitter</Text>
                <Anchor
                    icon={<Twitter color="black" />}
                    href="https://twitter.com/regen_league"
                />
            </Card>
            <Card align="center" pad="medium">
                <Text>Contribute to the Regen League App</Text>
                <Anchor
                    icon={<Github color="black" />}
                    href="https://github.com/j-h-scheufen/regen-league"
                />
            </Card>
        </Box>
    );
}
