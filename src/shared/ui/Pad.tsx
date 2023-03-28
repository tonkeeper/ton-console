import { ComponentProps, FunctionComponent } from 'react';
import { Box } from '@chakra-ui/react';

export const Pad: FunctionComponent<ComponentProps<typeof Box>> = props => {
    return <Box px="6" py="5" borderRadius="md" bgColor="background.page" {...props}></Box>;
};
