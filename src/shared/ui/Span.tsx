import { ComponentProps, FunctionComponent } from 'react';
import { Box, chakra } from '@chakra-ui/react';

export const Span: FunctionComponent<ComponentProps<typeof Box>> = props => {
    return <chakra.span {...props} />;
};
