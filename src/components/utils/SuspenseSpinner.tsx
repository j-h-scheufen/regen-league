import { Box, Spinner } from "grommet";

export default function SuspenseSpinner() {
  return (
    <Box fill={true} align="center" margin={{ top: "50%" }}>
      <Spinner size="medium" />
    </Box>
  );
}
