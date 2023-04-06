import { Box } from '@chakra-ui/react';
import { ComponentProps, FunctionComponent } from 'react';

export const H4: FunctionComponent<ComponentProps<typeof Box>> = props => (
    <Box as="h4" textStyle="h4" cursor="default" {...props} />
);
