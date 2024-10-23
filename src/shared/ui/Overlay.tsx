import { Box, BoxProps } from '@chakra-ui/react';
import { FC } from 'react';

export const Overlay: FC<BoxProps> = props => {
    return (
        <Box h="100%" px="6" py="5" borderRadius="lg" bgColor="background.content" {...props}>
            {props.children}
        </Box>
    );
};
