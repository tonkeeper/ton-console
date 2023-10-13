import baseStyle from './baseStyle';
import defaultProps from './defaultProps';
import variants from './variants';
import { defineStyleConfig } from '@chakra-ui/react';

const textAreaConfig = defineStyleConfig({
    baseStyle,
    defaultProps,
    variants
});

export default textAreaConfig;
