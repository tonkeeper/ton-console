import { Box } from '@chakra-ui/react';
import { ComponentProps, FunctionComponent } from 'react';

export const H3: FunctionComponent<ComponentProps<typeof Box>> = ({ ...props }) => (
    <Box as="h3" textStyle="h3" cursor="default" {...props} />
);
