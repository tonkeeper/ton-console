import { Box } from '@chakra-ui/react';
import { ComponentProps, FC } from 'react';

export const H1: FC<ComponentProps<typeof Box>> = ({ ...props }) => (
    <Box as="h1" textStyle="h1" cursor="default" {...props} />
);
