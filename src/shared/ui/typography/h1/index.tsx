import { Box } from '@chakra-ui/react';
import { ComponentProps, FunctionComponent } from 'react';

export const H1: FunctionComponent<ComponentProps<typeof Box>> = ({ ...props }) => (
    <Box as="h1" textStyle="h1" cursor="default" {...props} />
);
