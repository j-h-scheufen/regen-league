import {Box, Spinner} from "grommet";

export default function SuspenseSpinner() {
    return (
        <Box fill={true} align="center" justify="center">
            <Spinner size="large"/>
        </Box>
    )
}