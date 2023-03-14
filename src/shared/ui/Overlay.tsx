import { Box } from '@chakra-ui/react';
import { ComponentProps, FunctionComponent } from 'react';

export const Overlay: FunctionComponent<ComponentProps<typeof Box>> = props => {
    return (
        <Box p="2" borderRadius="lg" bgColor="background.content" {...props}>
            {props.children}
        </Box>
    );
};
