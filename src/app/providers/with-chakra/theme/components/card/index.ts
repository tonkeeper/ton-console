import { defineMultiStyleConfig } from './parts';
import baseStyle from './baseStyle';
import defaultProps from './defaultProps';
import sizes from './sizes';

const cardConfig = defineMultiStyleConfig({
    baseStyle,
    defaultProps,
    sizes
});

export default cardConfig;
