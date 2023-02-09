import { Anchor, Box, Card, Heading, Page, Paragraph, Text } from "grommet";
import { Github, Twitter } from "grommet-icons";
import React from "react";

export default function AboutPage() {
  return (
    <Page width="large">
      <Box align="center" width="large" alignSelf="center">
        <Heading level={2}>About</Heading>
        <Paragraph fill>
          This project was initially called the &quot;Region Legion&quot; as an
          allusion to the proverbial &quot;army&quot; of stewards (caretakers of
          the planet) and the literal wartime-like, collective effort and
          attitude shift in our relationship to this planet that must be
          espoused to save as much as we can.
        </Paragraph>
        <Paragraph fill>
          The Regen League App is meant to curate the available information
          about regenerative efforts around the globe, make it openly
          accessible, and thereby increase visibility of the breadth of work
          already happening. The current situation for these projects on the
          ground is very organic and their relationships are largely
          inter-personal. To publish content or access funding functionality the
          project operators resort to whatever is available, like social media
          or various platforms specializing in sustainability and regeneration.
        </Paragraph>
      </Box>
      <Box
        direction="row"
        pad="small"
        gap="medium"
        alignSelf="center"
        margin={{ top: "medium" }}
      >
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
    </Page>
  );
}
