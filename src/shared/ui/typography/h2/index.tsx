import { Box, forwardRef } from '@chakra-ui/react';
import { ComponentProps, FunctionComponent } from 'react';

export const H2: FunctionComponent<ComponentProps<typeof Box>> = forwardRef((props, ref) => (
    <Box ref={ref} as="h2" textStyle="h2" cursor="default" {...props} />
));
