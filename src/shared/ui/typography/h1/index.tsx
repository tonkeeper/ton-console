import { Box, BoxProps } from '@chakra-ui/react';
import { FC } from 'react';

export const H1: FC<BoxProps> = ({ ...props }) => (
    <Box as="h1" textStyle="h1" cursor="default" {...props} />
);
