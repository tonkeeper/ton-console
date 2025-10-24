import { Box } from '@chakra-ui/react';
import { ComponentProps, FC } from 'react';

export const H3: FC<ComponentProps<typeof Box>> = ({ ...props }) => (
    <Box as="h3" textStyle="h3" cursor="default" {...props} />
);
