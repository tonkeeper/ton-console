import { ComponentProps, forwardRef } from 'react';
import { Box, chakra } from '@chakra-ui/react';

export const Span = forwardRef<HTMLSpanElement, ComponentProps<typeof Box>>((props, ref) => {
    return <chakra.span ref={ref} {...props} />;
});

Span.displayName = 'Span';
