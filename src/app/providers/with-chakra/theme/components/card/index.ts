import { defineMultiStyleConfig } from './parts';
import baseStyle from './baseStyle';
import defaultProps from './defaultProps';
import sizes from './sizes';
import variants from './variants';

const cardConfig = defineMultiStyleConfig({
    baseStyle,
    defaultProps,
    sizes,
    variants
});

export default cardConfig;
