import { Box } from '@chakra-ui/react';
import { ComponentProps, FC } from 'react';

export const H4: FC<ComponentProps<typeof Box>> = props => (
    <Box as="h4" textStyle="h4" cursor="default" {...props} />
);
