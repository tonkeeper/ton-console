import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { modalAnatomy as parts } from '@chakra-ui/anatomy';

export const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
    parts.keys
);
