import { ComponentProps, FunctionComponent } from 'react';
import { Box, Image as ChakraImage } from '@chakra-ui/react';

export const Image: FunctionComponent<ComponentProps<typeof ChakraImage>> = props => (
    <ChakraImage fallback={<Box bgColor="background.placeholderDark" {...props} />} {...props} />
);
