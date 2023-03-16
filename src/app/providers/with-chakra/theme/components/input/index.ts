import baseStyle from './baseStyle';
import { defineMultiStyleConfig } from './parts';
import defaultProps from './defaultProps';
import variants from './variants';

const inputConfig = defineMultiStyleConfig({
    baseStyle,
    defaultProps,
    variants
});

export default inputConfig;
