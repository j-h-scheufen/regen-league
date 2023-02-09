import { Box, Card, CardBody, CardHeader, Paragraph, Text } from "grommet";
import { LocationEntity } from "../utils/types";

type Props = {
  entity: LocationEntity;
};
export default function AttributesCard({ entity }: Props) {
  return (
    <Card pad="small" margin={{ vertical: "small" }}>
      <CardHeader justify="center">
        <Text size="large">Description</Text>
      </CardHeader>
      <CardBody gap="small">
        <Box width="100%" pad="small">
          <Paragraph
            style={{ whiteSpace: "pre-wrap" }}
            maxLines={20}
            fill={true}
            margin={{ vertical: "xsmall" }}
          >
            {entity.description || ""}
          </Paragraph>
        </Box>
        {entity.position && (
          <Text margin={{ horizontal: "small" }}>
            Location: Lng: {entity.position[0]}, Lat: {entity.position[1]}
          </Text>
        )}
      </CardBody>
    </Card>
  );
}
