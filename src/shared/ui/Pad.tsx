import { forwardRef } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

export const Pad = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
    return (
        <Box ref={ref} px="6" py="5" borderRadius="md" bgColor="background.page" {...props}></Box>
    );
});

Pad.displayName = 'Pad';
