import { Box, BoxProps } from '@chakra-ui/react';
import { FC } from 'react';

export const H3: FC<BoxProps> = ({ ...props }) => (
    <Box as="h3" textStyle="h3" cursor="default" {...props} />
);
