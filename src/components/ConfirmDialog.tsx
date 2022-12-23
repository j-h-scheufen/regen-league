import {Box, Button, Heading, Layer, Text} from "grommet";

type Props = {
    id: string,
    heading: string,
    text?: string,
    onCancel: () => void,
    onSubmit: () => void
}

export default function ConfirmDialog({id, heading, text, onCancel, onSubmit}: Props) {

    return (
        <Layer
            id={id}
            position="center"
            onClickOutside={onCancel}
            onEsc={onCancel}
            animation="fadeIn"
        >
            <Box pad="medium" gap="small" width="medium">
                <Heading level={3} margin="none">{heading}</Heading>
                {text && (<Text>{text}</Text>)}
                <Box
                    as="footer"
                    gap="small"
                    direction="row"
                    align="center"
                    justify="end"
                    pad={{ top: 'medium', bottom: 'small' }}
                >
                    <Button label="Cancel" onClick={onCancel} color="dark-3" />
                    <Button
                        label={
                            <Text color="white">
                                <strong>Delete</strong>
                            </Text>
                        }
                        onClick={onSubmit}
                        primary
                        color="status-critical"
                    />
                </Box>
            </Box>
        </Layer>
    )

}