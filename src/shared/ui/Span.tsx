import { ComponentProps } from 'react';
import { Box, chakra, forwardRef } from '@chakra-ui/react';

export const Span = forwardRef<ComponentProps<typeof Box>, typeof Box>((props, ref) => (
    <chakra.span ref={ref} {...props} />
));
