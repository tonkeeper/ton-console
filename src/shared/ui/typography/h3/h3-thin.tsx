import { Box } from '@chakra-ui/react';
import { ComponentProps, forwardRef } from 'react';

export const H3Thin = forwardRef<HTMLHeadingElement, ComponentProps<typeof Box>>((props, ref) => (
    <Box ref={ref} as="h3" textStyle="h3Thin" cursor="default" {...props} />
));

H3Thin.displayName = 'H3Thin';
