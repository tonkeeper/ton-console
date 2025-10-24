import { ComponentProps, FC } from 'react';
import { Box, Image as ChakraImage } from '@chakra-ui/react';

export const Image: FC<ComponentProps<typeof ChakraImage>> = props => (
    <ChakraImage fallback={<Box bgColor="background.placeholderDark" {...props} />} {...props} />
);
