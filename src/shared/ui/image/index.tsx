import { FC } from 'react';
import { Box, Image as ChakraImage, ImageProps } from '@chakra-ui/react';

export const Image: FC<ImageProps> = props => (
    <ChakraImage fallback={<Box bgColor="background.placeholderDark" {...props} />} {...props} />
);
