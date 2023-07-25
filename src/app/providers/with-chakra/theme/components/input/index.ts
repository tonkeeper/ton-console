import baseStyle from './baseStyle';
import { defineMultiStyleConfig } from './parts';
import defaultProps from './defaultProps';
import variants from './variants';
import sizes from './sizes';

const inputConfig = defineMultiStyleConfig({
    baseStyle,
    defaultProps,
    variants,
    sizes
});

export default inputConfig;
