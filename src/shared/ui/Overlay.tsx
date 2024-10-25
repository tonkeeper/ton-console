import { Box } from '@chakra-ui/react';
import { ComponentProps, FunctionComponent } from 'react';

export const Overlay: FunctionComponent<ComponentProps<typeof Box>> = props => {
    return (
        <Box h="100%" px="6" py="5" borderRadius="lg" bgColor="background.content" {...props}>
            {props.children}
        </Box>
    );
};
