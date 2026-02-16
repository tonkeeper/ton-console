import { Box, BoxProps, forwardRef } from '@chakra-ui/react';
import { FC } from 'react';

export const H2: FC<BoxProps> = forwardRef((props, ref) => (
    <Box ref={ref} as="h2" textStyle="h2" cursor="default" {...props} />
));
