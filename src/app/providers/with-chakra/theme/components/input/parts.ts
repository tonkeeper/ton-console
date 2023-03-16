import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { inputAnatomy as parts } from '@chakra-ui/anatomy';

export const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
    parts.keys
);
