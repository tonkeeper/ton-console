import defaultProps from './defaultProps';
import sizes from './sizes';
import baseStyle from './baseStyle';
import variants from './variants';
import { defineStyleConfig } from '@chakra-ui/react';

const buttonConfig = defineStyleConfig({
    sizes,
    baseStyle,
    variants,
    defaultProps
});

export default buttonConfig;
