import { ComponentProps, forwardRef } from 'react';
import { Box } from '@chakra-ui/react';

export const Pad = forwardRef<HTMLDivElement, ComponentProps<typeof Box>>((props, ref) => {
    return (
        <Box ref={ref} px="6" py="5" borderRadius="md" bgColor="background.page" {...props}></Box>
    );
});

Pad.displayName = 'Pad';
