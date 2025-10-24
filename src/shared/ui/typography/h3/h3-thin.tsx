import { Box, BoxProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const H3Thin = forwardRef<HTMLHeadingElement, BoxProps>((props, ref) => (
    <Box ref={ref} as="h3" textStyle="h3Thin" cursor="default" {...props} />
));

H3Thin.displayName = 'H3Thin';
