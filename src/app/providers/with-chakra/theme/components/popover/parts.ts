import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { popoverAnatomy as parts } from '@chakra-ui/anatomy';

export const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
    parts.keys
);
