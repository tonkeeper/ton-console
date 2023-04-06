import { Box } from '@chakra-ui/react';
import { ComponentProps, FunctionComponent } from 'react';

export const H2: FunctionComponent<ComponentProps<typeof Box>> = ({ ...props }) => (
    <Box as="h2" textStyle="h2" cursor="default" {...props} />
);
